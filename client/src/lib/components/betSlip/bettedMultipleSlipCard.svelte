<script>
  import MyBetSlipCard from './bettedSlipCard.svelte';

  export let betSlip;
  export let bettingMode;

  let totalOdd = 1;
  let winAmount = 0;

  $: if(betSlip) {
    totalOdd = 1;

    betSlip.bet.map(ele => {
      totalOdd *= ele.oddValue;
    })

    winAmount = Number(betSlip.bettingAmount) * Number(totalOdd);
  }

</script>

<div class="px-2 py-1">
  <div class="p-2 border rounded-[10px] border-white11 overflow-hidden">
    {#each betSlip.bet as item}
      <MyBetSlipCard 
        bettingMode={bettingMode} 
        item={item} 
      />
    {/each}
    <div class="w-full flex items-center justify-between px-[22px] py-[10px] bg-white5">
      <div class="flex flex-col gap-[10px]">
        <p class="text-xs font-medium text-white">Bet Amount</p>
        <p class="text-xs font-medium text-white">Total Odds</p>
        <p class="text-xs font-semibold text-white">Possible Win</p>
      </div>
      <div class="flex flex-col gap-[10px]">
        <p class="text-xs font-medium text-black50 dark:text-white50">
          {betSlip.bettingAmount} <span class="font-bold" />
        </p>
        <p class="text-xs font-medium text-black50 dark:text-white50">
          {totalOdd.toFixed(2)} <span class="font-bold" />
        </p>
        <p class="text-base font-semibold text-black dark:text-white">
          {winAmount.toFixed(2)} <span class="font-bold" />
        </p>
      </div>
    </div>
  </div>
</div>
