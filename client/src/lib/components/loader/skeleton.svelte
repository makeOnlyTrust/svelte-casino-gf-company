<script>
  export let cardCount;
  export let className = '';
  export let auto = false;
</script>

{#each Array.from({ length: cardCount }, (_, i) => i) as index}
  <div
    key={index}
    class="w-full flex flex-col {className} gap-[10px] {auto
      ? 'h-full'
      : 'h-[210px]'} bg-grayLight2 dark:bg-black21 rounded-[17px] overflow-hidden skeleton-loader"
  >
    <div class="item w-full {auto ? 'h-full' : ' h-[165px]'}" />
    <div class="flex items-center justify-between px-[12px]">
      <div class="item h-[25px] w-[70%] rounded-[10px] bg-grayLight dark:bg-white5" />
      <div class="item h-[25px] w-[25px] rounded-full bg-grayLight dark:bg-white5" />
    </div>
  </div>
{/each}
