<script>
  import globalStore from '@store/globalStore';

  import FavoriteApi from '@apis/favorite.js';

  export let league;
  export let sportsName;
  export let user = true;
  export let deleteList = null;

  const type = 'soccer';

  const updateFavorite = async () => {
    if (!$globalStore.userDetail) return;

    if (!league.isFavorite) {
      await FavoriteApi.createFavorite($globalStore.userDetail._id, league.id, type);
    } else {
      await FavoriteApi.deleteFavorite($globalStore.userDetail._id, league.id, type);

      if (deleteList) {
        deleteList(league.id);
      }
    }

    league = { ...league, isFavorite: !league.isFavorite };
  };
</script>

<div class="w-full flex gap-1 mt-[6px] items-center justify-between px-4 py-3 bg-black5 dark:bg-white5 rounded-[7px]">
  <a href="/sports/{sportsName}/league/{league.id}" class="flex w-full">
    <p class="text-base mt-1 text-black dark:text-white">
      {league.name} <span class="text-gray">({league.matches_count})</span>
    </p>
  </a>
  {#if user}
    <div
      class="cursor-pointer flex items-center justify-center w-[30px] h-[30px] bg-grayLight4 dark:bg-white5 rounded-md"
      on:click={updateFavorite}
    >
      <svg width="12" height="12">
        <use class={league.isFavorite ? 'fill-yellow' : 'fill-gray'} href="/imgs/icons/icons.svg#star" />
      </svg>
    </div>
  {/if}
</div>
