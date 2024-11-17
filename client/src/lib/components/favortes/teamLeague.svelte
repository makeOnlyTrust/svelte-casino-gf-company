<script>
  import { LL } from '@src/i18n/i18n-svelte';
  import League from '../sports/league.svelte';
  import { onMount } from 'svelte';

  export let data = [];

  let dynamicData = [];

  const deleteFavorite = (id) => {
    dynamicData = dynamicData.filter((ele) => ele.id !== id);
  }

  onMount(() => {
    dynamicData = [...data];
  })
</script>

<div class="flex flex-col gap-6 mt-10">
  <h6 class="font-semibold text-xl gradient-text-white2 main">Team/League</h6>

  <div class="w-full flex flex-col gap-1">
    {#each dynamicData as item}
      <League league={item} deleteList={deleteFavorite}/>
    {/each}
  </div>
</div>
