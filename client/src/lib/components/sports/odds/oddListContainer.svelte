<script>
  import OddList from './oddList.svelte';

  export let odds;
  export let index;
  export let cardData = {};
  export let addBettingCard = () => {};

  const showCount = 1;

  let isHidden = true;

  const showMore = () => {
    isHidden = !isHidden;
  };

  console.log('odds = ', odds);
</script>

<div class="w-full grid grid-cols-{odds[index].odds ? odds[index].odds.length : odds.length} gap-3">
  {#each odds as odd, ind}
    {#if odd}
      {#if odd.odds}
        {#each odd.odds as oddItem}
          {#if odds.length <= showCount || ind < 1 || !isHidden}
            <OddList
              name={odd.name}
              value={oddItem.value}
              oddTarget={oddItem.name}
              cardData={{
                ...cardData,
                subOddName: odd.name,
                oddTarget: oddItem.name,
                oddValue: oddItem.value
              }}
              onClick={addBettingCard}
            />
          {/if}
        {/each}
      {:else if odds.length <= 3 || ind < 1 || !isHidden}
        <OddList
          name={odd.name}
          value={odd.value}
          cardData={{
            ...cardData,
            subOddName: '',
            oddTarget: odd.name,
            oddValue: odd.value
          }}
          onClick={addBettingCard}
        />
      {/if}
    {/if}
  {/each}
</div>

{#if (odds[index].odds && odds.length > 1) || odds.length > 3}
  <p on:click={showMore} class="show-odds font-medium text-base mt-4 cursor-pointer text-primary text-center w-full">
    {#if isHidden}
      Show more
    {:else}
      Show less
    {/if}
  </p>
{/if}
