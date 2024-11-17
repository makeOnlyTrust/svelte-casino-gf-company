<script>
  import { onMount } from 'svelte';

  export let to = '#';
  export let text = 'text';
  export let iconName = '';
  export let additionalText = undefined;
  export let sidebarOpen = undefined;
  export let onClick;
  export let classname = '';
  let dynamicIconComponent;

  const loadDynamicComponnt = async () => {
    try {
      const module = await import(`$lib/components/icons/${iconName}-icon.svelte`);
      dynamicIconComponent = module.default
    } catch (error) {
      console.error(`Error loading component "${iconName}":`, error);
    }
  }
  onMount(async () => {
    await loadDynamicComponnt();
  });

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };
</script>

<li class="w-full">
  <a
    on:click={(e) => handleClick(e)}
    href={to}
    class={`${classname ? classname : ''} group navLink relative flex items-center justify-center`}
  >
    <svg class="icon" width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <svelte:component this={dynamicIconComponent} />
    </svg>

    <p class="nav-text text-gray font-medium text-base">
      {text}
    </p>

    {#if additionalText && sidebarOpen}
      <p class="ml-auto text-gray text-bas">{additionalText}</p>
    {/if}

    <img
      class="navRadial absolute left-[-10px] opacity-0 group-hover:opacity-[1]"
      src="/imgs/navRadial.svg"
      alt="navRadial"
    />
  </a>
</li>
