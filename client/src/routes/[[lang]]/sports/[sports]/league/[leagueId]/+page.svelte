<script>
  import { onMount } from 'svelte';

  import { LL } from '@src/i18n/i18n-svelte';

  import globalStore from '@store/globalStore';
  import { page } from '$app/stores';

  import BreadCrumb from '@components/breadCrumb/breadCrumb.svelte';
  import SportsApi from '@apis/sport.js';
  import SportsHighlight from '@components/sports/sportsHighlight.svelte';

  $: isLoggedIn = $globalStore.userDetail;
  $: leagueMatches = [];

  export let data;

  const sportsName = $page.params.sports;

  let link = '';
  let title = 'League matches';
  let type = '';

  let oddsData = [];
  let oddNamesData = {};
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
      name: 'League',
      route: `/sports/${sportsName}/league`
    }
  ];

  let activeHandicapMenuIndex = null;

  const handleHandicapMenu = (index) => {
    if (index === activeHandicapMenuIndex) {
      activeHandicapMenuIndex = null;
      return;
    }
    activeHandicapMenuIndex = index;
  };

  const getMatches = async () => {
    try {
      const id = $page.params.leagueId;
      const res = await SportsApi.fetchMatchesByLeagueId(sportsName, id);

      const oddNames = await SportsApi.fetchOddNames(sportsName);
      oddNamesData = oddNames.data;

      console.log(res.data);
      leagueMatches = res.data.odd;
    } catch (err) {
      console.error(err);
      leagueMatches = [];
    }
  };

  onMount(async () => {
    getMatches().then(() => {
      dragableFuntion();
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.handicap-arrow') && !e.target.closest('.handicap-menu')) {
        activeHandicapMenuIndex = null;
      }
    });
  });

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
</script>

<main class="w-full py-[27px] md:pl-[30px] md:pr-[30px]" id="main">
  <div class="relative container-main">
    <div class="pl-[15px] pr-[15px] md:pl-[0px] md:pr-[0px] overflow-auto scrollbar-hidden">
      <BreadCrumb pages={breadCrumbPages} current={leagueMatches[0]?.league_name} />
    </div>

    <div class="relative w-full hidden md:flex mt-10">
      <img
        class="w-full min-h-[260px] object-bottom max-h-[320px] object-cover rounded-[14px]"
        src={`/imgs/banners/${sportsName}.png`}
        alt=""
      />
      <div class="absolute left-0 top-0 w-full h-full bg-black21 rounded-[33px]" />

      <div class="absolute left-[47px] top-[50%] translate-y-[-50%]">
        <div class="flex flex-col mt-[65px] w-full max-w-[550px]">
          <h4 class="text-3xl text-white font-semibold">{leagueMatches[0]?.league_name}</h4>
          <!-- <Filter filters={filterOptions} /> -->
        </div>
      </div>
    </div>
    <SportsHighlight 
      sportsName={sportsName} 
      sportItems={leagueMatches} 
      seeAll={true}
      oddNames={oddNamesData}
    />
  </div>
</main>
