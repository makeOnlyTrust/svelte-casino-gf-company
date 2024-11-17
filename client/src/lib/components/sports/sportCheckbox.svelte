<style>
  .green-border {
    animation-name: green-border-animation;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
  }

  .red-border {
    animation-name: red-border-animation;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
  }

  @keyframes red-border-animation {
    0% {
      box-shadow: auto;
    }
    50% {
      box-shadow: 0px 1.5px 2px 1px theme('colors.red');
    }
    100% {
      box-shadow: auto;
    }
  }

  @keyframes green-border-animation {
    0% {
      box-shadow: auto;
    }
    50% {
      box-shadow: 0px -1px 2px 1px theme('colors.green');
    }
    100% {
      box-shadow: auto;
    }
  }
</style>

<script>
  import { onMount } from 'svelte';
  import globalStore from '@store/globalStore';

  export let title = '';
  export let odd = {};
  export let disabled = false;
  export let additionalTitle = '';
  export let titleColor = false;
  export let cardData = {};
  export let onClick = () => {};

  $: bettingMode = $globalStore.sportsbetSlipMode;
  $: singleBettingCards = $globalStore.sportsSingleBettingCards;
  $: multipleBettingCards = $globalStore.sportsMultipleBettingCards;

  let originalValue = '';
  let clicked = false;

  $: if (odd && odd.value && odd.value !== originalValue) {
    setTimeout(() => {
      originalValue = odd.value;
    }, 1100);
  }

  const handleClick = () => {
    if (odd && odd.value) {
      const name = odd.name ? odd.name : '';
      onClick(
        cardData.leagueId,
        cardData.matchId,
        cardData.matchA,
        cardData.matchB,
        cardData.oddId,
        cardData.oddName,
        cardData.subOddName,
        name,
        odd.value
      );
    }
  };

  const checkClicked = () => {
    let bettingCards = [];

    if (bettingMode === 'single') {
      bettingCards = [...singleBettingCards];
    } else {
      bettingCards = [...multipleBettingCards];
    }

    const cardIndex = bettingCards.findIndex((card) => {
      return (
        card.sportsName === cardData.sportsName &&
        card.leagueId === cardData.leagueId &&
        card.matchId === cardData.matchId &&
        card.oddId === cardData.oddId &&
        card.subOddName === cardData.subOddName &&
        card.oddTarget === odd.name
      );
    });

    if (cardIndex !== -1) {
      clicked = true;
    } else {
      clicked = false;
    }
  };

  onMount(() => {
    checkClicked();
  });

  $: if ((singleBettingCards, multipleBettingCards, odd)) {
    checkClicked();
  }
</script>

{#if !odd || disabled}
  <div class="flex flex-col gap-0 items-center">
    {#if title}
      <p class="text-xs sm:text-sm font-bold text-grayDark2">{title}</p>
    {/if}
    <div
      class="cursor-not-allowed odd-block flex items-center justify-center rounded-[7px] text-black dark:text-white hover:border-blue text-sm sm:text-base w-[65px] sm:w-[81px] h-[52px] bg-grayLight4 dark:bg-white5 border border-grayLight2 dark:border-white11"
    >
      <div class="w-[25px] h-[25px] rounded-full bg-black5 dark:bg-white5 flex items-center justify-center">
        <div class="w-[10px] h-[4px] bg-red rounded-full" />
      </div>
    </div>
  </div>
{:else}
  <div class="flex flex-col gap-0 items-center">
    {#if title}
      <p class="text-xs sm:text-sm font-bold text-grayDark2">{title}</p>
    {/if}
    <div
      on:click={handleClick}
      class="cursor-pointer
        {additionalTitle && 'flex-col'} 
        {odd.value !== originalValue && odd.state && odd.state == 1 && 'green-border'} 
        {odd.value !== originalValue && odd.state && odd.state == -1 && 'red-border'} 
        odd-block flex items-center justify-center border rounded-[7px] text-black dark:text-white text-sm sm:text-base w-[65px] sm:w-[81px] h-[52px] border-white11 hover:bg-[#5e41bd] {clicked
        ? 'bg-[#5e41bd]'
        : 'bg-white5'}"
    >
      {#if additionalTitle}
        <p
          class="text-xs font-medium {titleColor && additionalTitle > 0
            ? 'text-green'
            : additionalTitle < 0
            ? 'text-red'
            : 'dark:text-white text-black'}"
        >
          {additionalTitle}
        </p>
      {/if}
      <div>
        {odd.value}
      </div>
    </div>
  </div>
{/if}
