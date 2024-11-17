<script>
  import globalStore from '@store/globalStore';

  import { LL } from '@src/i18n/i18n-svelte';

  import Filter from '@components/filter/filter.svelte';
  import BreadCrumb from '@components/breadCrumb/breadCrumb.svelte';
  import BettingAccordion from '@components/accordion/betting/bettingAccordion.svelte';

  $: isLoggedIn = $globalStore.userDetail;

  export let data;

  let link = '';

  let title = 'sports',
    type = '';

  let itemData = null;

  let isPlay = false;
  let isFullscreen = false;

  let breadCrumbPages = [
    {
      name: 'Home',
      route: '/'
    }
  ];

  const filterOptions = [
    {
      label: 'All',
      value: 'All'
    },
    {
      label: 'Match',
      value: 'Match'
    },
    {
      label: '1ST Half',
      value: '1ST_Half'
    }
  ];
  let activeTab = filterOptions[0].value;

  const handleFilter = (activeValue) => {
    activeTab = activeValue;
    return activeValue;
  };
</script>

<main class="w-full py-[27px] md:pl-[30px] md:pr-[30px]" id="main">
  <div class="relative container-main">
    <div class="pl-[15px] pr-[15px] md:pl-[0px] md:pr-[0px]">
      <BreadCrumb pages={breadCrumbPages} current={title} />
    </div>

    <div class="relative w-full hidden md:flex mt-10">
      <img
        class="w-full min-h-[260px] max-h-[320px] object-cover rounded-[14px]"
        src="/imgs/banners/Banner_Football.jpg"
        alt=""
      />
      <div class="absolute left-0 top-0 w-full h-full bg-black21 rounded-[33px]" />

      <div class="absolute w-full top-[50%] translate-y-[-50%]">
        <div class="flex w-full items-center justify-between max-w-[80%] mx-auto">
          <div class="flex flex-col gap-4 items-center">
            <img width="100" class="w-full max-w-[100px]" src="/imgs/sevilia.svg" alt="manchester" />
            <h6 class="text-xl text-white font-semibold uppercase">Manchester</h6>
          </div>
          <div class="flex flex-col gap-6 items-center">
            <img width="30" class="w-full max-w-[30px]" src="/imgs/LEAGUE-LOGO.svg" alt="leagueLogo" />
            <h6 class="text-3xl text-white uppercase">VS</h6>
            <h6 class="text-sm text-primary font-semibold uppercase">Saturday, April 1, 2023 at 16:30</h6>
          </div>
          <div class="flex flex-col gap-4 items-center">
            <img width="100" class="w-full max-w-[100px]" src="/imgs/sevilia.svg" alt="manchester" />
            <h6 class="text-xl text-white font-semibold uppercase">Manchester</h6>
          </div>
        </div>
      </div>
    </div>
    <div class="my-8">
      <Filter filters={filterOptions} active={activeTab} onFilter={handleFilter} />
    </div>
    <div class="flex flex-col gap-8">
      <!---->
      <BettingAccordion title="Money Line • Match">
        <div class="w-full grid grid-cols-3 gap-3">
          <div
            class="w-full flex items-center justify-between rounded-[7px] bg-black5 dark:bg-white5 border-l border-t border-black5 dark:border-white5 p-3"
          >
            <p class="text-base dark:text-grayDark font-semibold">Manchester</p>
            <p class="text-base dark:text-white text-black font-medium">1.5</p>
          </div>
          <div
            class="w-full flex items-center justify-between rounded-[7px] bg-black5 dark:bg-white5 border-l border-t border-black5 dark:border-white5 p-3"
          >
            <p class="text-base dark:text-grayDark font-semibold">Draw</p>
            <p class="text-base dark:text-white text-black font-medium">1.7</p>
          </div>
          <div
            class="w-full flex items-center justify-between rounded-[7px] bg-black5 dark:bg-white5 border-l border-t border-black5 dark:border-white5 p-3"
          >
            <p class="text-base dark:text-grayDark font-semibold">Liverpool</p>
            <p class="text-base dark:text-white text-black font-medium">1.5</p>
          </div>
        </div>
      </BettingAccordion>

      <!---->
      <BettingAccordion title="Handicap • Match" classname="!p-0">
        <div class="flex flex-col gap-4">
          <div class="w-full grid grid-cols-2 gap-3 place-items-center mb-2">
            <p class="text-grayDark2 text-base font-semibold">Manchester</p>
            <p class="text-grayDark2 text-base font-semibold">Liverpool</p>
          </div>
          <div class="w-full flex flex-col p-4 rounded-[7px] bg-grayLight dark:bg-white5">
            <div class="w-full grid grid-cols-2 gap-3">
              <div
                class="w-full flex items-center justify-between rounded-[7px] bg-black5 dark:bg-white5 border-l border-t border-black5 dark:border-white5 p-3"
              >
                <p class="text-base dark:text-grayDark font-semibold">
                  <span class="dark:text-white text-black">Over</span> 2.75
                </p>
                <p class="text-base dark:text-white text-black font-medium">1.5</p>
              </div>
              <div
                class="w-full flex items-center justify-between rounded-[7px] bg-black5 dark:bg-white5 border-l border-t border-black5 dark:border-white5 p-3"
              >
                <p class="text-base dark:text-grayDark font-semibold">
                  <span class="dark:text-white text-black">Under</span> 2.75
                </p>
                <p class="text-base dark:text-white text-black font-medium">1.7</p>
              </div>
            </div>
            <p class="text-primary font-semibold text-mg mt-4 text-center cursor-pointer">Show more</p>
          </div>
        </div>
      </BettingAccordion>
      <!---->

      <BettingAccordion title="Total • Match" classname="!p-0">
        <div class="w-full grid grid-cols-2 gap-3 place-items-center mb-2">
          <p class="text-grayDark2 text-base font-semibold">Manchester</p>
          <p class="text-grayDark2 text-base font-semibold">Liverpool</p>
        </div>
        <div class="w-full flex flex-col p-4 rounded-[7px] bg-grayLight dark:bg-white5">
          <div class="w-full grid grid-cols-2 gap-3">
            <div
              class="w-full flex items-center justify-between rounded-[7px] bg-black5 dark:bg-white5 border-l border-t border-black5 dark:border-white5 p-3"
            >
              <p class="text-base dark:text-grayDark font-semibold">
                <span class="dark:text-white text-black">Over</span> 2.75
              </p>
              <p class="text-base dark:text-white text-black font-medium">1.5</p>
            </div>
            <div
              class="w-full flex items-center justify-between rounded-[7px] bg-black5 dark:bg-white5 border-l border-t border-black5 dark:border-white5 p-3"
            >
              <p class="text-base dark:text-grayDark font-semibold">
                <span class="dark:text-white text-black">Under</span> 2.75
              </p>
              <p class="text-base dark:text-white text-black font-medium">1.7</p>
            </div>
          </div>

          <p class="text-primary font-semibold text-mg mt-4 text-center cursor-pointer">Show more</p>
        </div>
      </BettingAccordion>

      <!---->
      <BettingAccordion title="Team Total • Match" classname="!p-0">
        <div class="w-full grid grid-cols-2 gap-3 place-items-center mb-2">
          <p class="text-grayDark2 text-base font-semibold">Manchester</p>
          <p class="text-grayDark2 text-base font-semibold">Liverpool</p>
        </div>
        <div class="w-full gap-4 flex flex-col p-4 rounded-[7px] bg-grayLight dark:bg-white5">
          <div class="w-full grid grid-cols-2 gap-3">
            <div
              class="w-full flex items-center justify-between rounded-[7px] bg-black5 dark:bg-white5 border-l border-t border-black5 dark:border-white5 p-3"
            >
              <p class="text-base dark:text-grayDark font-semibold">
                <span class="dark:text-white text-black">Over</span> 2.75
              </p>
              <p class="text-base dark:text-white text-black font-medium">1.5</p>
            </div>
            <div
              class="w-full flex items-center justify-between rounded-[7px] bg-black5 dark:bg-white5 border-l border-t border-black5 dark:border-white5 p-3"
            >
              <p class="text-base dark:text-grayDark font-semibold">
                <span class="dark:text-white text-black">Under</span> 2.75
              </p>
              <p class="text-base dark:text-white text-black font-medium">1.7</p>
            </div>
          </div>
          <div class="w-full grid grid-cols-2 gap-3 border-t dark:border-white5 border-black5 pt-4">
            <div
              class="w-full flex items-center justify-between rounded-[7px] bg-black5 dark:bg-white5 border-l border-t border-black5 dark:border-white5 p-3"
            >
              <p class="text-base dark:text-grayDark font-semibold">
                <span class="dark:text-white text-black">Over</span> 2.75
              </p>
              <p class="text-base dark:text-white text-black font-medium">1.5</p>
            </div>
            <div
              class="w-full flex items-center justify-between rounded-[7px] bg-black5 dark:bg-white5 border-l border-t border-black5 dark:border-white5 p-3"
            >
              <p class="text-base dark:text-grayDark font-semibold">
                <span class="dark:text-white text-black">Under</span> 2.75
              </p>
              <p class="text-base dark:text-white text-black font-medium">1.7</p>
            </div>
          </div>

          <p class="text-primary font-semibold text-mg mt-4 text-center cursor-pointer">Show more</p>
        </div>
      </BettingAccordion>
    </div>
  </div>
</main>
