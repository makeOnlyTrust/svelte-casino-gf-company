<script>
  import { onMount } from 'svelte';

  import globalStore from '@store/globalStore';

  export let name;
  export let value;
  export let oddTarget;
  export let cardData = {};
  export let onClick = () => {};

  $: singleBettingCards = $globalStore.sportsSingleBettingCards;
  $: multipleBettingCards = $globalStore.sportsMultipleBettingCards;
  $: bettingMode = $globalStore.sportsbetSlipMode;

  let clicked = false;

  const handleClick = () => {
    if (oddTarget) {
      onClick(
        cardData.leagueId,
        cardData.matchId,
        cardData.matchA,
        cardData.matchB,
        cardData.oddId,
        cardData.oddName,
        cardData.subOddName,
        oddTarget,
        value
      );
    } else {
      onClick(
        cardData.leagueId,
        cardData.matchId,
        cardData.matchA,
        cardData.matchB,
        cardData.oddId,
        cardData.oddName,
        cardData.subOddName,
        name,
        value
      );
    }
  };

  const checkClicked = () => {
    const _oddTarget = oddTarget ? oddTarget : name;

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
        card.oddTarget === _oddTarget
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

  $: if ((singleBettingCards, multipleBettingCards, name, bettingMode)) {
    checkClicked();
  }
</script>

<div
  on:click={handleClick}
  class="w-full flex items-center justify-between rounded-[7px] border-l border-t border-black5 dark:border-white5 p-3 cursor-pointer hover:bg-[#5e41bd] {clicked
    ? 'bg-[#5e41bd]'
    : 'bg-white5'}"
>
  <p class="text-base dark:text-grayDark font-semibold">{name}</p>
  <p class="text-base dark:text-white text-black font-medium">{value}</p>
</div>
