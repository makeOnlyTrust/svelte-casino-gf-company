<script>
  import { onMount } from 'svelte';

  import { LL } from '@src/i18n/i18n-svelte';

  import { page } from '$app/stores';
  import globalStore from '@store/globalStore';

  import Filter from '@components/filter/filter.svelte';
  import Spinner from '@components/spinner/spinner.svelte';
  import BreadCrumb from '@components/breadCrumb/breadCrumb.svelte';
  import OddListContainer from '@components/sports/odds/oddListContainer.svelte';
  import BettingAccordion from '@components/accordion/betting/bettingAccordion.svelte';

  import SportsApi from '@apis/sport.js';

  $: isLoggedIn = $globalStore.userDetail;

  export let data;

  const sportsName = $page.params.sports;

  // $: path = $page.url;
  let path;

  let link = '';

  let title = $page.params.league.split('-').join(' ');
  let type = '';

  let itemData = null;

  let isPlay = false;
  let isFullscreen = false;

  let breadCrumbPages = [
    {
      name: 'Home',
      route: '/'
    },
    {
      name: 'Sports',
      route: `/sports/${sportsName}`
    },
    {
      name: 'Match',
      route: `/sports/${sportsName}`
    }
  ];

  const filterOptions = [
    {
      label: 'All',
      value: 'all'
    },
    {
      label: 'Main',
      value: 'winner'
    },
    {
      label: 'Total',
      value: 'Total'
    },
    {
      label: 'Handicaps',
      value: 'handicap'
    },
    {
      label: 'Correct Score',
      value: 'correct score'
    }
  ];

  let activeTab = filterOptions[0].value;

  $: matchData = null;

  let dynamicMatchData = [];
  const oddNamesData = [];

  onMount(() => {
    getMatch();
  });

  let loader = true;

  const getMatch = async () => {
    try {
      const id = $page.params.match;
      const odds = await SportsApi.fetchMatchById(sportsName, id);

      const oddNames = await SportsApi.fetchOddNames(sportsName);

      for (const [key, value] of Object.entries(oddNames.data)) {
        if (key === 'odd1' || key === 'odd2' || key === 'odd3') {
          if (value !== '') {
            oddNamesData.unshift(value);
          }
        }
      }
      console.log(odds.data);

      matchData = odds.data.odd;

      const sortedOdds = odds.data.odd.odds.sort((a, b) => {
        if (oddNamesData.indexOf(b.value) > oddNamesData.indexOf(a.value)) {
          return 1;
        } else {
          return -1;
        }
      });
      matchData.odd = sortedOdds;
      dynamicMatchData = { ...matchData };

      loader = false;
    } catch (err) {
      console.error(err);

      matchData = {};
      dynamicMatchData = {};
      loader = false;
    }
  };

  const handleFilter = (activeValue) => {
    activeTab = activeValue;

    if (activeTab !== 'all') {
      const odds = matchData.odds.filter((item) => {
        if (item.value.toLowerCase().includes(activeTab.toLowerCase())) {
          return item;
        }
      });

      dynamicMatchData.odds = odds;
    } else {
      getMatch();
    }

    return activeValue;
  };

  const addBettingCard = (leagueId, matchId, matchA, matchB, oddId, oddName, subOddName, oddTarget, oddValue) => {
    let bettingCards = [];

    if ($globalStore.sportsbetSlipMode === 'single') {
      bettingCards = [...$globalStore.sportsSingleBettingCards];
    } else {
      bettingCards = [...$globalStore.sportsMultipleBettingCards];
    }

    const cardIndex = bettingCards.findIndex((ele) => {
      return (
        ele.leagueId === leagueId &&
        ele.matchId === matchId &&
        ele.oddId === oddId &&
        ele.subOddName === subOddName &&
        ele.oddTarget === oddTarget
      );
    });

    if (!$globalStore.betSlip) {
      globalStore.toggleItem('betSlip', true);
    }

    if (cardIndex !== -1) {
      bettingCards.splice(cardIndex, 1);

      if ($globalStore.sportsbetSlipMode === 'single') {
        globalStore.toggleItem('sportsSingleBettingCards', bettingCards);
      } else {
        globalStore.toggleItem('sportsMultipleBettingCards', bettingCards);
      }
    } else {
      if ($globalStore.sportsbetSlipMode === 'single') {
        globalStore.toggleItem('sportsSingleBettingCards', [
          ...$globalStore.sportsSingleBettingCards,
          {
            sportsName,
            matchId,
            leagueId,
            matchA,
            matchB,
            oddId,
            oddName,
            subOddName,
            oddTarget,
            oddValue,
            bettingAmount: 0
          }
        ]);
      } else {
        const matchIndex = bettingCards.findIndex((ele) => {
          return ele.matchId === matchId;
        });

        if (matchIndex === -1) {
          globalStore.toggleItem('sportsMultipleBettingCards', [
            ...$globalStore.sportsMultipleBettingCards,
            {
              sportsName,
              matchId,
              leagueId,
              matchA,
              matchB,
              oddId,
              oddName,
              subOddName,
              oddTarget,
              oddValue
            }
          ]);
        }
      }
    }
  };
</script>

<main class="w-full py-[27px] md:pl-[30px] md:pr-[30px]" id="main">
  <div class="relative container-main">
    <div class="pl-[15px] pr-[15px] md:pl-[0px] md:pr-[0px] overflow-auto scrollbar-hidden">
      <BreadCrumb pages={breadCrumbPages} current={title} />
    </div>

    <div class="sm:px-0 px-[15px]">
      {#if matchData}
        <div class="relative w-full hidden md:flex mt-10">
          <img
            class="w-full min-h-[260px] object-bottom max-h-[320px] object-cover rounded-[14px]"
            src={`/imgs/banners/${sportsName}.png`}
            alt=""
          />
          <div class="absolute left-0 top-0 w-full h-full bg-black50" />

          <div class="absolute w-full top-[50%] translate-y-[-50%]">
            <div class="flex w-full items-center justify-between max-w-[80%] mx-auto">
              <div class="flex flex-col gap-4 items-center">
                <img
                  width="100"
                  class="w-full max-w-[100px]"
                  src={matchData.matchA?.url ? matchData.matchA?.url : '/imgs/global.svg'}
                  alt="manchester"
                />
                <h6 class="text-xl text-white font-semibold uppercase">{matchData.matchA?.name}</h6>
              </div>
              <div class="flex flex-col gap-4 items-center">
                <img
                  width="100"
                  class="w-full max-w-[100px]"
                  src={matchData.matchB?.url ? matchData.matchB?.url : '/imgs/global.svg'}
                  alt="manchester"
                />
                <h6 class="text-xl text-white font-semibold uppercase">{matchData.matchB?.name}</h6>
              </div>
            </div>
          </div>
        </div>
      {/if}
      <div class="my-8 py-2 dragable overflow-x-auto overflow-y-hidden scrollbar-hidden">
        <Filter filters={filterOptions} activeFilter={activeTab} onFilter={handleFilter} />
      </div>

      {#if loader}
        <Spinner />
      {/if}
      {#if matchData}
        <div class="flex flex-col gap-4">
          {#each dynamicMatchData.odds as odd}
            <BettingAccordion oddNames={oddNamesData} title={odd.value}>
              {#each odd.bookmakers as bookmaker, index}
                <OddListContainer
                  odds={bookmaker.odds}
                  index={index}
                  cardData={{
                    sportsName: sportsName,
                    matchId: matchData.id,
                    leagueId: matchData.league_id,
                    matchA: matchData.matchA,
                    matchB: matchData.matchB,
                    oddId: odd.id,
                    oddName: odd.value
                  }}
                  addBettingCard={addBettingCard}
                />
              {/each}
            </BettingAccordion>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</main>
