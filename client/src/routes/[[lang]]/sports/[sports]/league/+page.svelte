<style>
  .league-box {
    background: linear-gradient(112deg, rgba(126, 44, 255, 0.1) 35.54%, rgba(89, 107, 247, 0.1) 90.78%);
  }
</style>

<script>
  import { onMount } from 'svelte';

  import { LL } from '@src/i18n/i18n-svelte';
  import { page } from '$app/stores';

  import globalStore from '@store/globalStore';

  import { clearSportsName } from '$lib/utils/common';

  import League from '@components/sports/league.svelte';
  import Filter from '@components/filter/filter.svelte';
  import Spinner from '@components/spinner/spinner.svelte';
  import BreadCrumb from '@components/breadCrumb/breadCrumb.svelte';

  import SportsApi from '@apis/sport.js';

  $: isLoggedIn = $globalStore.userDetail;
  $: sportsName = $page.params.sports;

  let title = 'League';

  let breadCrumbPages = [];
  let filterOptions = [];
  let leaguesData = [];

  $: if (isLoggedIn) {
    getData();
  }

  $: if (sportsName) {
    breadCrumbPages = [
      {
        name: 'Home',
        route: '/'
      },
      {
        name: 'Sports',
        route: `/sports/${sportsName}`
      }
    ];

    filterOptions = [
      {
        label: 'Highlights',
        to: `/sports/${sportsName}`
      },
      {
        label: 'Live',
        to: `/sports/${sportsName}/live`
      },
      {
        label: 'League',
        to: `/sports/${sportsName}/league`
      }
    ];
  }

  let loader = false;

  const getData = async () => {
    try {
      if (isLoggedIn) {
        const res = await SportsApi.fetchLeagues(sportsName, isLoggedIn._id);
        leaguesData = res.data;
      } else {
        const res = await SportsApi.fetchLeagues(sportsName);
        leaguesData = res.data;
      }
    } catch (err) {
      console.error(err);
      leaguesData = [];
    }
  };

  onMount(async () => {
    loader = true;
    await getData();
    loader = false;
  });
</script>

<main class="w-full py-[27px] md:pl-[30px] md:pr-[30px]" id="main">
  <div class="relative container-main">
    <div class="pl-[15px] pr-[15px] md:pl-[0px] md:pr-[0px]">
      <BreadCrumb pages={breadCrumbPages} current={title} />
    </div>

    <div class="relative w-full hidden md:flex mt-10">
      <img
        class="w-full min-h-[260px] object-bottom max-h-[320px] object-cover rounded-[14px]"
        src={`/imgs/banners/${sportsName}.png`}
        alt=""
      />
      <div class="absolute left-0 top-0 w-full h-full bg-black21 rounded-[33px]" />

      <div class="absolute left-[47px] top-[50%] translate-y-[-50%]">
        <div class="flex flex-col mt-[65px] w-full max-w-[530px]">
          <h4 class="text-3xl mb-2 text-white font-semibold">
            <span class="sports-name">{clearSportsName(sportsName)}</span> Odds
          </h4>
          <Filter filters={filterOptions} />
        </div>
      </div>
    </div>

    <!-- <div class="w-full px-4 py-2 bg-primary rounded-[7px] mt-8">
      <p class="text-xl mt-1 text-white">Top Leagues</p>
    </div>
    <League title="England - FA Cup" total={10} />
    <League title="England - Premier League" total={15} />
    <League title="England - FA Cup" total={10} />
    <League title="England - Premier League" total={15} /> -->

    {#if loader}
      <div class="mt-8">
        <Spinner />
      </div>
    {/if}
    <div class="md:px-0 px-[15px]">
      {#if leaguesData.length === 0}
        <div class="w-full h-full relative">
          <div class="flex flex-col items-center mt-20">
            <img src="/imgs/sports/odd_not_found.png" alt="not found" />
            <p class="text-[#FFFFFF4D] text-xl">No Leagues found</p>
          </div>
        </div>
      {:else}
        {#each leaguesData as league, index}
          <!-- {#if league.isTopLeague}
          <div class="w-full px-4 py-2 league-box rounded-[7px] mt-8">
            <p class="text-xl mt-1 text-primary">TOP LEAGUE</p>
          </div>
        {/if} -->

          {#if index === 0 || league.name.charAt(0) !== leaguesData[index - 1].name.charAt(0)}
            <div class="w-full px-4 py-2 league-box rounded-[7px] mt-8">
              <p class="text-xl mt-1 text-primary">{league.name.charAt(0)}</p>
            </div>
          {/if}
          <League sportsName={sportsName} league={league} user={isLoggedIn} />
        {/each}
      {/if}
    </div>
  </div>
</main>
