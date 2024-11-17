<style>
  :global(.hide-selected-item) {
    opacity: 100 !important;
  }
  :global(.svelte-cr .prepend) {
    position: absolute;
  }
  :global(.svelte-cr.focused) {
    border-color: theme('colors.blue') !important;
    z-index: 999 !important;
  }
  :global(.svelte-cr .svelte-select-list) {
    border: none;
    background: transparent !important;
  }
</style>

<script>
  import { writable } from 'svelte/store';
  import Select from 'svelte-select';
  import { createEventDispatcher, onMount } from 'svelte';
  import globalStore from '@store/globalStore';

  const dispatch = createEventDispatcher();
  export let customSearch = false;
  export let items;
  export let classname = '';
  export let textClassname = '';
  export let selectedIndex;
  export let imagePrepend = true;
  export let listClassName = '';

  $: selectedValue = items.length > 0 ? writable(items[0].label) : writable('');
  if (selectedIndex) {
    selectedValue = writable(items[selectedIndex].value);
  } else {
    selectedValue = items.length > 0 ? writable(items[0].label) : writable('');
  }

  const handleChange = (item) => {
    selectedValue = writable(item.label);
    const selectElement = document.querySelectorAll('.svelte-select input');
    if (selectElement) {
      selectElement.forEach((select) => {
        select.blur();
      });
    }
    dispatch('handleChange', item);
    value = '';
  };
  let value = '';
  let i = false;
  const handleFocus = (e) => {
    if (!i) {
      let searchInput = e.target.closest('.svelte-select').querySelector('.value-container input');
      searchInput.classList.add('!opacity-0');
      searchInput.addEventListener('input', (e) => {
        value = e.target.value;
      });
      return (i = true);
    }
  };
  const handleBlur = () => {
    value = '';
  };
</script>

<div class="w-full" on:click={handleFocus}>
  <Select
    class="{classname} svelte-cr relative z-[99] max !max-w-full !rounded-[7px] !w-full !gap-[17px] !bg-grayLight4 dark:!bg-white5 !backdrop-blur-[8px] !border !border-transparent !py-[6px] min-w-[250px]"
    items={items}
    clearable={false}
    showChevron
    searchable={true}
    customSearch={true}
    bind:value={$selectedValue}
    on:blur={handleBlur}
  >
    <div slot="selection" let:selection>
      <div class="w-full flex items-center gap-2">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            {#if selection.image && imagePrepend}
              <div class="w-[30px] h-[30px] mt-[2px]">
                <img
                  width="30"
                  class="w-full max-w-[30px] h-[30px] rounded-full"
                  src={selection.image}
                  alt={selection.label}
                />
              </div>
            {/if}
            {#if selection.labelSelected}
              <p class="text-base {textClassname} text-black dark:text-white font-medium ml-2">
                {selection.labelSelected.split(' ')[0]}
              </p>
            {/if}
          </div>
          <div>
            {#if selection.labelSelected}
              <p class="text-base {textClassname} text-black dark:text-white font-medium ml-2">
                {selection.labelSelected.split(' ')[1]}
              </p>
            {/if}
          </div>
        </div>
        {#if !selection.labelSelected}
          <p class="text-base {textClassname} text-black dark:text-white font-medium">
            {selection.label}
          </p>
        {/if}

        {#if selection.image && !imagePrepend}
          <div class="w-[30px] h-[30px]">
            <img width="30" class="w-full rounded-full" src={selection.image} alt={selection.label} />
          </div>
        {/if}
      </div>
    </div>

    <div slot="chevron-icon">
      <svg class="w-[20px] h-[20px]">
        <use class="fill-black dark:fill-white" href="/imgs/icons/icons.svg#chevron-down" />
      </svg>
    </div>
    <div slot="list" let:filteredItems class="bg-grayLight4 dark:bg-blackLight min-w-[300px] {listClassName}">
      {#if customSearch}
        <div class="w-full p-[10px] z-[999]">
          <div class="grid grid-cols-[auto] gap-[4px] rounded-[7px] overflow-hidden h-[40px]">
            <div
              class="w-full grid grid-cols-[40px,auto] items-center bg-black5 dark:bg-white5 rounded-[7px] search"
              id="search"
            >
              <div
                class="opacity-80 hover:opacity-100 flex h-[calc(100%-20px)] justify-center items-center cursor-pointer"
              >
                <svg class="w-[20px] h-[20px]">
                  <use class="fill-grayDark" href="/imgs/icons/icons.svg#search" />
                </svg>
              </div>

              <input
                class="w-full z-[999] pt-[5px] h-full bg-transparent outline-none px-[8px] text-sm text-black dark:text-grayLight placeholder:text-grayDark4"
                type="text"
                value={value}
                placeholder="Seach here..."
                id="asd"
              />
            </div>
          </div>
        </div>
      {/if}
      {#each filteredItems as items}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          class={`${
            $selectedValue.value === items.value ? 'bg-blue select-selected !opacity-100' : ''
          } cursor-pointer flex items-center gap-[6px] px-[15px] py-[12px]  hover:bg-blue hover:opacity-80`}
          on:click={handleChange(items)}
        >
          {#if items.labelHTML}
            <div class="w-full">{@html items.labelHTML}</div>
          {:else}
            {#if items.image}
              <div class="w-[30px] h-[30px]">
                <img class="rounded-full" src={items.image} alt={items.label} />
              </div>
            {/if}
            {#if items.label}
              <p class="text-sm text-black dark:text-white font-medium">
                {items.label}
              </p>
            {/if}
          {/if}
        </div>
      {/each}
    </div>
  </Select>
</div>
