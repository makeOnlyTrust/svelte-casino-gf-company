<script>
  import { onMount } from 'svelte';
  import { SwiperSlide } from "swiper/svelte";

  import { LL, setLocale, locale } from '@src/i18n/i18n-svelte';

  import globalStore from '@store/globalStore';

  import FavoriteApi from '@apis/favorite';

  import Footer from '@components/footer/footer.svelte';
  import SlideView from '@components/favortes/slideView.svelte';
  import BreadCrumb from '@components/breadCrumb/breadCrumb.svelte';
  import TeamLeague from '@components/favortes/teamLeague.svelte';
  import NoFavorites from '@components/favortes/noFavorites.svelte';
  
  import MinigameItem from "@components/minigame/item.svelte";
  import MinigameSliderView from "@components/minigame/minigameSliderWrap.svelte";

  const breadCrumbPages = [
      {
          name: 'Favorites',
          route: '/favorites'
      }
  ];

  let isLoad = '',
    casinoList = [],
    miniList = [],
    soccerList = [];
      
  $: {
      if ($globalStore.userDetail && $globalStore.userDetail != isLoad) {
          isLoad = $globalStore.userDetail;
          onGetFavoriteList();
      }
  }

  const onGetFavoriteList = async () => {
    const res = await FavoriteApi.getFavoriteList($globalStore.userDetail._id);
    
    casinoList = res.data.casino;
    miniList = res.data.minigame;
    soccerList = res.data.soccer;
  };
</script>

<main class="w-full py-[27px] md:pl-[30px] md:pr-[30px]" id="main">
    <div class="container-main-sm">
        <div class="pl-[15px] pr-[15px] md:pl-[0px] md:pr-[0px]">
            <BreadCrumb pages={breadCrumbPages} current=""/>
        </div>

        <div class="pl-[15px] pr-[15px] md:pl-[0px] md:pr-[0px]">
            {#if casinoList.length === 0 && miniList.length === 0 && soccerList.length === 0}
                <NoFavorites />
            {:else}
                {#if casinoList.length > 0}
                    <SlideView data={casinoList} type="casino"/>
                {/if}

                {#if miniList.length > 0}
                    <MinigameSliderView title="Mini Game" type="types" category="">
                        {#each miniList as categoryItem}
                            <SwiperSlide>
                                <MinigameItem item={categoryItem} load={false} type={categoryItem.type}/>
                            </SwiperSlide>
                        {/each}
                    </MinigameSliderView>
                {/if}
                
                {#if soccerList.length > 0}
                    <TeamLeague data={soccerList} />
                {/if}
            {/if}
            <Footer banner={false}/>
        </div>
    </div>
</main>
