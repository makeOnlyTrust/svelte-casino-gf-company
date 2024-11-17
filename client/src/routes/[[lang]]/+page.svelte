<script>
  import { onMount } from 'svelte';
  import Hero from '$lib/components/main/hero/hero.svelte';
  import AllCategory from '$lib/components/main/allCategory/allCategory.svelte';
  import LiveSports from '$lib/components/main/liveSports/liveSports.svelte';
  import MainSports from '$lib/components/main/mainSports/mainSports.svelte';
  import ActivityTable from '$lib/components/main/activityTable/activityTable.svelte';
  import Footer from '$lib/components/footer/footer.svelte';
  import { LL, setLocale, locale } from '@src/i18n/i18n-svelte';
  import SliderView from '$lib/components/sliderview/sliderView.svelte';

  import SportsApi from '@apis/sport.js';
  import MinigameItem from "@components/minigame/item.svelte";
  import MinigameSliderView from "@components/minigame/minigameSliderWrap.svelte";
  import { SwiperSlide } from "swiper/svelte";
  import globalStore from "@store/globalStore.js";
  import { getMinigameLists } from "@apis/minigame.js";

  let sportsOddsData = {};
  let sportsOddNames = [];

  const fetchData = async () => {
    const resData = await SportsApi.fetchMainOdds();

    console.log(resData)

    sportsOddsData = resData.odds;
    sportsOddNames = resData.oddNames;
  }
  let minigameList = [];
  onMount(async () => {
    const userId = $globalStore.userDetail ? $globalStore.userDetail._id : '';

    minigameList = await getMinigameLists(userId, '', '');
    fetchData().then(()=>{
      dragableFuntion();
    })
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

<main class="w-full md:py-[27px] md:pl-[30px] md:pr-[30px]" id="main">
  <div class="container-main">
    <!--Hero-->
    <Hero />
    <div class="px-[15px] py-[30px] sm:px-[30px] md:px-[0px] md:py-[0px]">
      <!-- All Category -->
      <AllCategory />
      <!-- Live Sports -->
      <!-- <LiveSports /> -->
      <!-- Main Sports -->
      <MainSports odds={sportsOddsData} oddNames={sportsOddNames} />
      <!-- Best Casino -->
      <SliderView title="Best Casino" type="casino" category="hot" />
      <!-- Best Slot -->
      <SliderView title="Best Slot" type="casino" category="slot" />
      <!-- Mini Game -->
      <MinigameSliderView title="Best Minigame" type="Best Minigame" category="">
        {#each minigameList as categoryItem}
          <SwiperSlide>
            <MinigameItem item={categoryItem} load={false} type={categoryItem.category} />
          </SwiperSlide>
        {/each}
      </MinigameSliderView>
      <SliderView title="Best Minigame" type="minigame" category="minigame" />
      <!-- Recent Bet Deposits & Withdrawal History -->
      <ActivityTable title={$LL.RECENT_BET_DEPOSITS_AND_WITHDRAWAL_HISTORY()} showCols={[1, 0, 0]} />
      <!-- Footer -->
      <Footer />
    </div>
  </div>
</main>
