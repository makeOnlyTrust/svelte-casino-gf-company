<script>
  import { onMount } from 'svelte';

  export let item = {};
  export let index = {};
  export let bettingMode = 'single';
  export let removeBettingCard = () => {};
  export let updateBettingAmount = () => {};

  let winAmount = 0;

  const changeBettingAmount = (e) => {
    const value = Number(e.target.value);
    updateBettingAmount(index, value);
    winAmount = value * Number(item.oddValue);
  };

  onMount(() => {
    if (item.bettingAmount) {
      winAmount = Number(item.bettingAmount) * Number(item.oddValue);
    }
  });
</script>

<div
  class="w-full flex flex-col gap-[6px] md:gap-[11px] hover:bg-white5 transition-all py-[18px] px-[22px] border-b border-b-white11"
>
  <div class="w-full flex items-start justify-between">
    <div class="flex flex-col gap-[7px]">
      <div class="flex items-center gap-[6px]">
        <img class="w-[14px]" src="/imgs/sports/icons/{item.sportsName}.svg" alt={item.sportsName} />
        <p class="text-sm font-medium text-black dark:text-white">
          {item.matchA.name} - {item.matchB.name}
        </p>
      </div>
      <p class="text-xs text-black50 dark:text-white50 font-medium">
        {item.oddName}
        {#if item.subOddName !== ''}
          <span class="pl-2">({item.subOddName})</span>
        {/if}
      </p>
    </div>
    <div
      on:click={() => {
        removeBettingCard(index);
      }}
      class="cursor-pointer group hover:bg-red bg-red30 transition-all w-[31px] h-[31px] rounded-full flex items-center justify-center"
    >
      <svg class="w-[15px] h-[12px]">
        <use class="fill-red group-hover:fill-white transition-all" href="/imgs/icons/icons.svg#close" />
      </svg>
    </div>
  </div>
  <div class="w-full flex items-center justify-between">
    <p class="text-black dark:text-white font-medium text-sm">
      {#if item.oddTarget === 'Home'}
        {item.matchA.name}
      {:else if item.oddTarget === 'Away'}
        {item.matchB.name}
      {:else}
        {item.oddTarget}
      {/if}
    </p>
    <div class="px-[12px] py-[8px] bg-linear rounded-[7px] text-white text-xs font-semibold">
      {item.oddValue}
    </div>
  </div>
  {#if bettingMode === 'single'}
    <div class="w-full grid grid-cols-2 gap-[16px]">
      <div
        class="w-full grid items-center grid-cols-[auto,50px] bg-grayLight4 dark:bg-white5 rounded-[7px] focus:bg-red"
      >
        <input
          value={item.bettingAmount}
          on:input={(e) => changeBettingAmount(e)}
          type="text"
          class="w-full h-full bg-transparent py-[9px] outline-none text-black dark:text-white text-sm pl-[13px]"
        />
        <div class="pl-[13px] border-l border-l-grayDark text-black50 dark:text-grayDark">Bet</div>
      </div>
      <div
        class="w-full grid items-center grid-cols-[auto,50px] bg-grayLight4 dark:bg-white5 rounded-[7px] focus:bg-red"
      >
        <p
          class="w-full h-full bg-transparent py-[9px] outline-none text-black dark:text-white text-sm pl-[13px] overflow-hidden"
        >
          {winAmount.toFixed(2)}
        </p>
        <div class="pl-[13px] border-l border-l-grayDark text-black50 dark:text-grayDark">Win</div>
      </div>
    </div>
  {/if}
</div>
