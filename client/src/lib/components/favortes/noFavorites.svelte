<script>
  import { LL } from '@src/i18n/i18n-svelte';
</script>

<div class="w-full flex flex-col items-center justify-center py-10">
  <div class="flex flex-col items-center">
    <img class="w-[167px]" src="/imgs/nofav.svg" />
    <p class="text-black text-2xl text-black dark:text-white">
      {$LL.NO_FAVORITES_YET()}
    </p>
    <div class="flex flex-col md:flex-row gap-2 text-lg text-gray font-semibold items-center">
      <div class="flex items-center gap-2">
        <p class="min-w-max">{$LL.CLICK_THE()}</p>
        <svg width="12" height="12">
          <use class="fill-yellow" href="/imgs/icons/icons.svg#star" />
        </svg>
      </div>
      <p>{$LL.BY_YOUR_FAVORITE_LEAGUE_OR_TEAM_AND_GAME_TO_ADD()}.</p>
    </div>
  </div>

  <a
    href="/"
    class="mt-12 px-4 active-p-white min-w-max group items-center gap-[8px] p-[12px] bg-black5 dark:bg-white5 border border-black5 dark:border-white11 rounded-[7px] cursor-pointer hover:bg-linear"
  >
    <p class="group-hover:text-white text-black dark:text-white text-xs sm:text-sm font-normal uppercase">
      {$LL.GO_HOME()}
    </p>
  </a>
</div>
