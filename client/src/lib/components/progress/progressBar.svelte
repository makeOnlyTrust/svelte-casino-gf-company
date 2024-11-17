<script>
  export let percent = 0; // Receive progress as a prop
  export let required = 0
  export let symbol = ""

  $: barWidth = `${percent}%`; // Reactive statement to calculate the width dynamically
</script>


<div class="relative flex items-center justify-center w-full h-[18px] rounded-full bg-white5 overflow-hidden">
  <p class="text-xs z-10 mt-1 text-white mx-auto"> 
    {#if percent < 100}
    Required Betting Amount: {required.toFixed(4).toLocaleString()} {symbol} ({percent}%)
    {:else}
    Enjoy various events through betting! (100 %)
    {/if}
  </p>
  
  <div class="absolute h-full flex top-0 left-0 rounded-full bg-primary" style="width: {barWidth};" />
</div>
