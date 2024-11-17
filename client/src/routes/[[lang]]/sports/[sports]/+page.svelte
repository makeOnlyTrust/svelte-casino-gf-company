<script>
  import { onMount } from 'svelte';

  import { LL } from '@src/i18n/i18n-svelte';

  import globalStore from '@store/globalStore';
  import { page } from '$app/stores';

  import { socket } from '$lib/utils/socketConnection';
  import { clearSportsName } from '$lib/utils/common';

  import SportsApi from '@apis/sport.js';

  import Filter from '@components/filter/filter.svelte';
  import BreadCrumb from '@components/breadCrumb/breadCrumb.svelte';
  import SportsHighlight from '@components/sports/sportsHighlight.svelte';

  $: isLoggedIn = $globalStore.userDetail;
  $: sportsName = $page.params.sports;
  $: setupSocketListener(sportsName);

  let title = 'Highlights';
  let currentEventName = null;

  let breadCrumbPages = [];
  let filterOptions = [];

  const sportsTabs = [
    {
      title: 'SOCCER',
      image: '/imgs/live-sports/ball.svg'
    },
    {
      title: 'ESPORTS',
      image: '/imgs/live-sports/headphone.svg'
    },
    {
      title: 'TENNIS',
      image: '/imgs/live-sports/tennis-ball.svg'
    },
    {
      title: 'BASKETBALL',
      image: '/imgs/live-sports/basket-ball.svg'
    },
    {
      title: 'RUGBY',
      image: '/imgs/live-sports/rugby-ball.svg'
    },
    {
      title: 'CRICKET',
      image: '/imgs/live-sports/cricket-ball.svg'
    }
  ];

  let oddsData = [];
  let timestamp = '';
  let oddNamesData = {};
  let SportsSearchStatus = false;
  let SportsSearch = '';
  let originOddsData = [];
  $:{
    SportsSearch = $globalStore.SportsSearch;
    SportsSearchStatus = $globalStore.SportsSearchStatus;
    if ( SportsSearchStatus ) {
        let filterData = originOddsData.filter(e=>{
            const a = e.matchA.name;
            const b = e.matchB.name;
            if (a.includes(SportsSearch) || b.includes(SportsSearch)) {
                return true;
            }else {
                return false;
            }
        });
        oddsData = filterData;
    }
  }
  const fetchData = async () => {
    try {
      const odds = await SportsApi.fetchOdds(sportsName);
      oddsData = odds.data.odd;
      originOddsData = oddsData;
      timestamp = odds.data.timestamp.ts;

      const oddNames = await SportsApi.fetchOddNames(sportsName);
      oddNamesData = oddNames.data;
      loader = false;
    } catch (err) {
      console.error(err);
      oddsData = [];
    }
  };

  function setupSocketListener(sport) {
    socket.off(currentEventName);

    socket.on(`${sport}-odds`, (data) => {
      console.log('socket = ', data);
      oddsData = data.odd;
      timestamp = data.timestamp.ts;
    });

    currentEventName = `${sport}-odds`;

    return () => {
      socket.off(`${sport}-odds`);
    };
  }

  let loader = true;

  const dragableFuntion = () => {
    const container = document.querySelectorAll('.dragable');
    container.forEach((cont) => {
      let startY;
      let startX;
      let scrollLeft;
      let scrollTop;
      let isDown;

      cont.addEventListener('mousedown', (e) => {
        isDown = true;
        startY = e.pageY - cont.offsetTop;
        startX = e.pageX - cont.offsetLeft;
        scrollLeft = cont.scrollLeft;
        scrollTop = cont.scrollTop;
      });

      cont.addEventListener('mouseup', (e) => {
        isDown = false;
      });

      cont.addEventListener('mouseleave', (e) => {
        isDown = false;
      });

      cont.addEventListener('mousemove', (e) => {
        if (isDown) {
          e.preventDefault();
          //Move Horizontally
          const x = e.pageX - cont.offsetLeft;
          const walkX = x - startX;
          cont.scrollLeft = scrollLeft - walkX;
        }
      });
    });
  };

  onMount(() => {
    fetchData().then(() => {
      dragableFuntion();
    });
  });

  $: if (sportsName) {
    loader = true;
    oddsData = [];
    fetchData();
    loader = false;

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

  const handleFilter = (title) => {
    currentTab = title.toLowerCase();
    // updateDynamicSportsItems();
  };

  let currentTab = sportsTabs[0].title;
</script>

<main class="w-full py-[27px] md:pl-[30px] md:pr-[30px]" id="main">
  <div class="relative container-main">
    <div class="pl-[15px] pr-[15px] md:pl-[0px] md:pr-[0px]">
      <BreadCrumb pages={breadCrumbPages} current={title} />
    </div>
    <div class="px-[15px] md:px-0">
      <div class="relative w-full flex mt-10">
        <img
          class="w-full min-h-[260px] object-bottom max-h-[320px] object-cover rounded-[16px] md:rounded-[14px]"
          src={`/imgs/banners/${sportsName}.png`}
          alt=""
        />
        <div class="absolute left-0 top-0 w-full h-full bg-black21 rounded-[16px] md:rounded-[33px]" />

        <div class="absolute left-[24px] md:left-[47px] top-[50%] translate-y-[-50%]">
          <div class="flex flex-col mt-[65px] w-full max-w-[530px]">
            <h4 class="text-3xl mb-2 text-white font-semibold">
              <span class="sports-name">{clearSportsName(sportsName)}</span> Odds
            </h4>
            <Filter filters={filterOptions} activeFilter="highlight" />
          </div>
        </div>
      </div>
    </div>

    <!-- <SportsBet sportItems={liveSportsItems} title="Highlights" seeAll={true} /> -->
    <div class="md:px-0 px-[15px]">
      <!-- <div class="flex gap-3 dragable mt-6 overflow-auto scrollbar-hidden sm:hidden">
        {#each sportsTabs as tab}
          <div
            on:click={() => handleFilter(tab.title)}
            class={`${currentTab.toLowerCase() === tab.title.toLowerCase() ? 'bg-linear active-p-white' : ''} ${
              tab.hide ? 'hidden sm:flex' : 'flex'
            } min-w-max group items-center gap-[8px] p-[12px] bg-black5 dark:bg-white5 border border-black5 dark:border-white11 rounded-[7px] cursor-pointer hover:bg-linear`}
          >
            <img class="w-[15px] mb-[3px]" src={tab.image} alt={tab.title} />
            <p class="group-hover:text-white text-black dark:text-white text-xs sm:text-sm font-normal uppercase">
              {$LL[tab.title]()}
            </p>
          </div>
        {/each}
      </div> -->

      <SportsHighlight
        sportsName={sportsName}
        sportItems={oddsData}
        oddNames={oddNamesData}
        loader={loader}
        timestamp={timestamp}
        title="Highlights"
        seeAll={true}
      />
    </div>
  </div>
</main>
