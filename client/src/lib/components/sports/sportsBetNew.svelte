<script>
  import { onMount } from 'svelte';
  import { LL, setLocale, locale } from '@src/i18n/i18n-svelte';
  import SportCheckbox from '../sportCheckbox.svelte';

  export let sportTabs;
  export let sportItems;
  export let activeTab;
  export let title;
  export let seeAll;
  export let filter;

  $: dynamicSportItems = sportItems; // use dynamicSportItems as dynamicArray
  // currentTab must be same as sportTabs title
  let currentTab = activeTab; // you can add as uppercase as lowercase chars because in filter when compare to string to each other both string willl be transform to lowerCase letters
  let activeHandicapMenuIndex = null;

  const handleFilter = (title) => {
    currentTab = title.toLowerCase();
    updateDynamicSportsItems();
  };

  const updateDynamicSportsItems = () => {
    if (sportTabs) {
      dynamicSportItems = sportItems.filter((item) => {
        if (item.type.toLowerCase() === currentTab.toLowerCase()) {
          return item;
        }
      });
    }
  };

  const generateId = () => {
    return `id_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  };

  const handleHandicapMenu = (index) => {
    if (index === activeHandicapMenuIndex) {
      activeHandicapMenuIndex = null;

      return;
    }
    activeHandicapMenuIndex = index;
  };

  onMount(() => {
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.handicap-arrow') && !e.target.closest('.handicap-menu')) {
        activeHandicapMenuIndex = null;
      }
    });

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

    updateDynamicSportsItems();
  });
</script>

<div class="w-full flex flex-col items-start gap-[15px] mt-[37px]">
  <div class="w-full flex items-center justify-between">
    {#if title}
      <h6 class="font-semibold text-xl gradient-text-white2 main">{title}</h6>
    {/if}
  </div>
  <div
    class={`${
      filter === 'scroll' ? 'md:flex-wrap dragable overflow-auto scrollbar-hidden' : 'flex-wrap'
    } w-full flex items-center gap-[15px]`}
  >
    <!-- {#if sportTabs}
        {#each sportTabs as tab}
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
        {#if seeAll}
          <a href="/" class="flex sm:hidden ml-auto gradient-text hover:text-blue transition-all font-normal text-sm"
            >See All</a
          >
        {/if}
      {/if} -->
  </div>
  <div class="w-full flex flex-col gap-[15px] mt-[5px]">
    {#each dynamicSportItems as sportData, indexMain}
      {#each sportData.matches as data}
        <div class="w-full bg-white dark:bg-blackDark px-[13px] pt-[13px] pb-[11px] rounded-[7px]">
          <div class="w-full grid gap-[10px] sm:gap-[15px] md:gap-[0px] md:grid-cols-[450px,1fr]">
            <div class="flex items-center">
              <div
                class="flex flex-col items-center gap-[4px] pr-[10px] border-r border-grayLight dark:border-r-white9 mr-[10px]"
              >
                <p class="min-w-max text-xs sm:text-base font-medium text-grayDark dark:text-grayLight">{data.time}</p>
                <p class="min-w-max text-xs sm:text-base font-medium text-black dark:text-grayDark2">{data.date}</p>
              </div>
              <div class="flex flex-col gap-[12px] sm:gap-[20px]">
                <div class="flex items-center gap-[5px]">
                  <img class="w-[14px] sm:w-[16px] mb-1" src="/imgs/global.svg" alt="global" />
                  <p class="text-xs sm:text-sm uppercase font-medium text-grayDark2">{sportData.name}</p>
                </div>
                <div class="flex items-center gap-[15px] sm:gap-[31px]">
                  <div class="flex items-center gap-[6px] sm:gap-[10px]">
                    <img class="w-[22px] sm:w-[27px]" src="/imgs/global.svg" alt="image" />
                    <p class="text-sm sm:text-base font-bold text-black dark:text-grayLight">{data.matchA.name}</p>
                  </div>
                  <p class="text-sm font-normal text-grayDark2">{$LL.VS()}</p>
                  <div class="flex items-center gap-[6px] sm:gap-[10px]">
                    <img class="w-[22px] sm:w-[27px]" src="/imgs/global.svg" alt="image" />
                    <p class="text-sm sm:text-base font-bold text-black dark:text-grayLight">{data.matchB.name}</p>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="border-t border-t-grayLight dark:border-t-white11 mt-[10px] sm:mt-[15px] md:mt-[0px] py-[15px] md:border-none md:py-[0px] flex cursor-draggable items-center gap-[10px] dragable overflow-auto scrollbar-hidden"
            >
              <div class="flex items-center gap-[10px]">
                {#each data.odds as odd, index}
                  {#if odd.value === 'Match Winner'}
                    <div class="flex items-center gap-[5px]">
                      <SportCheckbox
                        title="1"
                        value={odd.bookmakers[0] && odd.bookmakers[0].odds && odd.bookmakers[0].odds[1]
                          ? odd.bookmakers[0].odds[0].value
                          : 'NO'}
                      />
                      <SportCheckbox
                        title="x"
                        value={odd.bookmakers[0] && odd.bookmakers[0].odds && odd.bookmakers[0].odds[1]
                          ? odd.bookmakers[0].odds[1].value
                          : 'NO'}
                      />
                      <SportCheckbox
                        title="2"
                        value={odd.bookmakers[0] && odd.bookmakers[0].odds && odd.bookmakers[0].odds[2]
                          ? odd.bookmakers[0].odds[2].value
                          : 'NO'}
                      />
                    </div>
                  {:else if odd.value === 'Asian Handicap'}
                    <div class="flex flex-col gap-[0px] items-center">
                      <p class="text-xs sm:text-sm font-bold text-grayDark2">
                        {$LL.HANDICAP()}
                      </p>
                      <div class="flex items-center gap-[5px]">
                        <div class="flex items-center gap-[5px]">
                          <SportCheckbox additionalTitle="+2" value={odd.bookmakers[0].odds[0].odds[0].value} />
                          <SportCheckbox additionalTitle="-2" value={odd.bookmakers[0].odds[0].odds[1].value} />
                        </div>
                        {#if activeHandicapMenuIndex === indexMain + odd.bookmakers[0].odds[0].odds[0].value}
                          <div
                            class="handicap-menu flex flex-col absolute bg-black max-h-[400px] overflow-auto custom-scrollbar p-2 rounded-md"
                          >
                            {#each odd.bookmakers[0].odds as handicapOdds}
                              <div class="flex items-center gap-[5px]">
                                {#each handicapOdds.odds as odd}
                                  <SportCheckbox additionalTitle="+2" value={odd.value} />
                                {/each}
                              </div>
                            {/each}
                          </div>
                        {/if}
                        <div
                          on:click={() => handleHandicapMenu(indexMain + odd.bookmakers[0].odds[0].odds[0].value)}
                          class="handicap-arrow transition-all h-full rounded-[4px] cursor-pointer hover:dark:bg-white5 hover:bg-black5"
                        >
                          <svg
                            width="16"
                            height="32"
                            class="svg-icon"
                            viewBox="0 0 16 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.3334 9.33333L8.00008 6L4.66675 9.33333"
                              class="dark:stroke-white11 stroke-black5"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M4.66659 22.6667L7.99992 26L11.3333 22.6667"
                              stroke-width="2"
                              class="dark:stroke-white11 stroke-black5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  {:else if odd.value === 'Total - Home'}
                    <div class="flex flex-col gap-[0px] items-center">
                      <p class="text-sm font-bold text-grayDark2">{$LL.TOTAL()}</p>
                      <div class="flex items-center gap-[5px]">
                        {#each odd.bookmakers[0].odds as bookmarker}
                          {#each bookmarker.odds as odd}
                            <SportCheckbox value={odd.value} />
                            <!-- <div
                              class="flex flex-col items-center justify-center rounded-[7px] text-black dark:text-white cursor-pointer hover:border-blue text-sm sm:text-base w-[65px] sm:w-[81px] h-[52px] bg-grayLight4 dark:bg-white5 border border-grayLight2 dark:border-white11"
                            >

                              <p class="text-xs font-medium text-grayDark2">
                                {totalItem.subTitle}
                              </p>
                              <p class="text-sm sm:text-base font-medium text-black dark:text-white">
                                {totalItem.title}
                              </p>
                            </div> -->
                          {/each}
                        {/each}
                      </div>
                    </div>
                  {/if}
                {/each}

                {#if !data.odds.some((odd) => odd.value === 'Match Winner')}
                  <SportCheckbox title="1a" value="" disabled />
                  <SportCheckbox title="x" value="" disabled />
                  <SportCheckbox title="2" value="" disabled />
                {/if}
                {#if !data.odds.some((odd) => odd.value === 'Asian Handicap')}
                  <div class="flex flex-col gap-[0px] items-center">
                    <p class="text-xs sm:text-sm font-bold text-grayDark2">
                      {$LL.HANDICAP()}
                    </p>
                    <div class="flex items-center gap-[5px]">
                      <SportCheckbox value="" disabled />
                      <SportCheckbox value="" disabled />
                    </div>
                  </div>
                {/if}
                {#if !data.odds.some((odd) => odd.value === 'Total - Home')}
                  <div class="flex flex-col gap-[0px] items-center">
                    <p class="text-xs sm:text-sm font-bold text-grayDark2">
                      {$LL.TOTAL()}
                    </p>
                    <div class="flex items-center gap-[5px]">
                      <SportCheckbox value="" disabled />
                      <SportCheckbox value="" disabled />
                      <SportCheckbox value="" disabled />
                      <SportCheckbox value="" disabled />
                    </div>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>
      {/each}
    {/each}
  </div>
</div>
