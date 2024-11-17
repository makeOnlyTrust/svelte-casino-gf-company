<script>
  import { onMount } from 'svelte';
  import { SwiperSlide } from 'swiper/svelte';

  import { LL, setLocale, locale } from '@src/i18n/i18n-svelte';

  import { page } from '$app/stores';

  import { getCasinoList } from '@apis/casino';
  import { getMinigameLists, getMinigameVendors } from '@apis/minigame.js';

  import Footer from '@components/footer/footer.svelte';
  import Skeleton from '@components/loader/skeleton.svelte';
  import SliderView from '@components/sliderview/sliderView.svelte';
  import SliderItem from '@components/sliderview/sliderItem.svelte';
  import CasinoItem from '@components/casino/item.svelte';
  import VendorItem from '@components/minigame/vendorItem.svelte';
  import globalStore from '@store/globalStore';
  import MinigameItem from '@components/minigame/item.svelte';
  import BettingHistory from '@components/minigame/bettingHistory.svelte';
  import MinigameSliderView from '@components/minigame/minigameSliderWrap.svelte';

  $: activeRoutePath = $page.url.pathname;

  const casinoTabs = [
    {
      title: 'All',
      href: '/minigame'
    },
    {
      title: 'Powerball',
      image: '/imgs/powerball.svg',
      href: '/minigame/type/powerball'
    },
    {
      title: 'Ladder',
      image: '/imgs/ladder.svg',
      href: '/minigame/type/ladder'
    },
    {
      title: 'Keno',
      image: '/imgs/keno.svg',
      href: '/minigame/type/keno'
    }
  ];

  let type = '';

  let totalNumber = 0,
    casinoList = [],
    currentLimit = 0,
    vendorList = [],
    powerball = [],
    ladder = [],
    keno = [];

  let searchKey = '',
    pageIndex = 0;

  let slotsLoaded = false;

  let inputFocus = false;

  onMount(async () => {
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

    setTimeout(async () => {
      await load();
    }, 1000);
  });

  const load = async () => {
    const vendors = await getMinigameVendors({});
    const userId = $globalStore.userDetail ? $globalStore.userDetail._id : '';

    const data = await getMinigameLists(userId, '', '');
    // const res = await getCasinoList({
    //     title: '',
    //     type: type,
    //     vendor: '',
    //     page: 0,
    //     sort: '',
    //     limit: 40,
    //     userId: $globalStore.userDetail ? $globalStore.userDetail._id : ''
    // });
    vendorList = vendors;
    powerball = data.filter((e) => e.category === 'powerball');
    ladder = data.filter((e) => e.category === 'ladder');
    keno = data.filter((e) => e.category === 'keno');
    // totalNumber = res.data.totalNumber;
    // casinoList = res.data.list;
    // currentLimit = casinoList.length;
    slotsLoaded = true;
  };

  const search = async () => {
    if (searchKey.length < 3) {
      return;
    }

    pageIndex = 0;
    currentLimit = 0;
    casinoList = [];
    const res = await getCasinoList({
      title: filterTitle,
      type: '',
      vendor: '',
      page: pageIndex,
      sort: '',
      limit: 40,
      userId: $globalStore.userDetail ? $globalStore.userDetail._id : ''
    });
    totalNumber = res.data.totalNumber;
    casinoList = res.data.list;
    currentLimit = casinoList.length;
  };

  const moreLoad = async () => {
    pageIndex++;
    slotsLoaded = false;
    const res = await getCasinoList({
      title: searchKey,
      type: '',
      vendor: '',
      page: pageIndex,
      sort: '',
      limit: 40,
      userId: $globalStore.userDetail ? $globalStore.userDetail._id : ''
    });
    currentLimit += res.data.list.length;
    casinoList = [...casinoList, ...res.data.list];
    slotsLoaded = true;
  };
</script>

<main class="w-full py-[27px] pl-[15px] pr-[15px] md:pl-[30px] md:pr-[30px]" id="main">
  <div class="container-main">
    <h6 class="font-semibold text-2xl gradient-text-white2 main">Lobby</h6>

    <div class="grid grid-cols-[auto] gap-[4px] rounded-[7px] overflow-hidden h-[50px] mt-[30px] hidden">
      <div
        class="{(inputFocus || searchKey.length > 0) && searchKey.length < 3
          ? 'border-red '
          : 'border-transparent'} w-full grid grid-cols-[auto,50px] items-center bg-white dark:bg-white5 rounded-[7px] border"
      >
        <input
          class={` w-full h-full bg-transparent outline-none px-[23px] text-sm font-medium font-normal text-black dark:text-grayLight placeholder:text-grayDark4`}
          type="text"
          bind:value={searchKey}
          placeholder="Seach here..."
          on:input={search}
          on:focus={() => (inputFocus = true)}
          on:focusout={() => (inputFocus = false)}
        />
        <div
          class="opacity-80 hover:opacity-100 flex h-[calc(100%-20px)] justify-center items-center cursor-pointer border-l border-grayDark40"
        >
          <svg class="w-[20px] h-[20px]">
            <use class="fill-grayDark" href="/imgs/icons/icons.svg#search" />
          </svg>
        </div>
      </div>
    </div>

    {#if (inputFocus || searchKey.length > 0) && searchKey.length < 3}
      <p class="text-red mt-1">Search require at least 3 Characters</p>
    {/if}

    {#if searchKey.length < 3}
      <div
        class="select-none flex sm:flex-wrap items-center gap-[15px] mt-[15px] dragable overflow-auto scrollbar-hidden"
      >
        {#each casinoTabs as tab}
          <a
            href={tab.href}
            class={`${activeRoutePath === tab.href ? 'bg-linear active-p-white' : ''} ${
              tab.hide ? 'hidden sm:flex' : 'flex'
            } group items-center gap-[8px] p-[12px] min-w-max bg-black5 dark:bg-white5 border border-black5 dark:border-white11 rounded-[7px] cursor-pointer hover:bg-linear`}
          >
            {#if tab.image}
              <img class="w-[15px] mb-[3px] group-hover:brightness-[2.5] mt-[px]" src={tab.image} alt={tab.title} />
            {/if}
            <p
              class="{activeRoutePath === tab.href
                ? '!text-white'
                : ''} group-hover:text-white text-black dark:text-gray text-xs sm:text-sm font-normal"
            >
              {tab.title}
            </p>
          </a>
        {/each}
      </div>

      <MinigameSliderView title="Power Ball" type="powerball" category="">
        {#each powerball as categoryItem}
          <SwiperSlide>
            <MinigameItem item={categoryItem} load={false} type={categoryItem.category} />
          </SwiperSlide>
        {/each}
      </MinigameSliderView>
      <MinigameSliderView title="Ladder" type="ladder" category="">
        {#each ladder as categoryItem}
          <SwiperSlide>
            <MinigameItem item={categoryItem} load={false} type={categoryItem.category} />
          </SwiperSlide>
        {/each}
      </MinigameSliderView>
      <MinigameSliderView title="Keno" type="keno" category="">
        {#each keno as categoryItem}
          <SwiperSlide>
            <MinigameItem item={categoryItem} load={false} type={categoryItem.category} />
          </SwiperSlide>
        {/each}
      </MinigameSliderView>
      <MinigameSliderView title="Vendors" type="vendors" category="vendors">
        {#each vendorList as categoryItem}
          <SwiperSlide>
            <VendorItem item={categoryItem} />
          </SwiperSlide>
        {/each}
      </MinigameSliderView>

      <BettingHistory title={$LL.RECENT_BET_DEPOSITS_AND_WITHDRAWAL_HISTORY()} />
    {:else}
      <div>
        {#if casinoList.length > 0}
          <div class="grid grid-system-slots w-full gap-[20px] mt-[20px]">
            {#each casinoList as item}
              <CasinoItem item={item} load={false} />
            {/each}

            {#if !slotsLoaded}
              <Skeleton cardCount={40} />
            {/if}
          </div>

          {#if slotsLoaded}
            <div class="w-full justify-center flex flex-col items-center gap-[12px] mt-[32px]">
              <p class="text-base font-medium text-black dark:text-white">
                {currentLimit} / {totalNumber}
              </p>
              <button
                class="p-[12px] bg-linear text-white rounded-[6px] border border-white11"
                disabled={currentLimit == totalNumber}
                on:click={moreLoad}>{$LL.LOAD_MORE()}</button
              >
            </div>
          {/if}
        {:else}
          <div class="w-full flex flex-col gap-[25px] justify-center items-center mt-[141px]">
            <img src="/imgs/not-found.svg" class="w-full max-w-[204px]" alt="" />
            <p class="text-white32 font-medium">No Search Result found</p>
          </div>
        {/if}
      </div>
    {/if}
    <Footer />
  </div>
</main>
