<style>
  .active-filter {
    position: relative;
    background: linear-gradient(103deg, #c6a3ff 11.96%, #7e8bed 82.13%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .active-filter::before {
    position: absolute;
    content: '';
    top: calc(100% + 10px);
    width: 100%;
    height: 2px;
    border-radius: 4px;
    background: linear-gradient(103deg, #c6a3ff 11.96%, #7e8bed 82.13%);
  }
</style>

<script>
  // Props
  export let filters;
  export let activeFilter;
  export let onFilter = (activeValue) => {
    return activeValue;
  };

  // Components
  import { onMount } from 'svelte';

  let pathname;
  onMount(() => {
    // Initialize active filter based on the current URL
    pathname = window.location.pathname;
  });

  const handleFilter = (val) => {
    activeFilter = val;
    onFilter(activeFilter);
    return true;
  };
</script>

<div class="relative z-[99] w-full flex items-center gap-4 p-[5px] rounded-[12px]">
  <ul class="flex items-center gap-6">
    {#each filters as filter}
      {#if filter.to}
        <a
          href={filter.to}
          class="{pathname === filter.to
            ? 'active-filter'
            : 'text-grayDark'} min-w-max hover:text-white transition-all cursor-pointer uppercase font-medium"
        >
          {filter.label}
        </a>
      {:else}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <li
          class="{activeFilter === filter.value
            ? 'active-filter'
            : 'text-grayDark'} min-w-max hover:text-white transition-all cursor-pointer uppercase font-medium"
          on:click={() => handleFilter(filter.value)}
        >
          {filter.label}
        </li>
      {/if}
    {/each}
  </ul>
</div>
