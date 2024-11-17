<script>
  import { Pagination } from 'swiper';

  import { Swiper, SwiperSlide } from 'swiper/svelte';
  import globalStore from '@store/globalStore';

  import 'swiper/css';
  import 'swiper/css/navigation';
  import 'swiper/css/pagination';
  import { getMinigameVendors } from '@apis/minigame.js';
  import VendorItem from '$lib/components/minigame/vendorItem.svelte';

  // Category Slider
  export let title;
  export let type;
  export let category;

  let page = 0;
  let casinoSlider;
  let casinoSliderArr = [];

  let isLoad = '';

  $: {
    if ($globalStore.userDetail && $globalStore.userDetail != isLoad) {
      isLoad = $globalStore.userDetail;
      load();
    } else if (!$globalStore.userDetail && $globalStore.userDetail != isLoad) {
      isLoad = $globalStore.userDetail;
      load();
    }
  }

  const onPrevPage = () => {
    casinoSlider.swiper().slidePrev();
  };

  const onNextPage = () => {
    casinoSlider.swiper().slideNext();
  };

  const load = async () => {
    casinoSliderArr = [];
    const res = await getMinigameVendors({});
    casinoSliderArr = res;
  };
</script>

<div class="w-full flex flex-col items-start gap-[15px] mt-[37px]">
  <div class="w-full flex items-center justify-between">
    <h6 class="font-semibold text-xl gradient-text-white2 main">{title}</h6>
    <div class="flex items-center gap-4">
      {#if type !== 'vendors' && type !== 'types'}
        <a href={`/minigame/${category}`} class="text-sm text-grayLight hover:text-primary transition-all capitalize"
          >View All</a
        >
      {/if}
      <div class="flex items-center gap-[11px]">
        <button
          class="bg-grayLight dark:bg-blueDark border border-grayLight4 dark:border-white11 opacity-80 hover:opacity-100 rounded-[11px] w-[36px] h-[36px] flex items-center justify-center"
          id="slidePrev"
          on:click={onPrevPage}
        >
          <svg class="w-[24px] h-[24px]">
            <use class="dark:fill-white fill-black" href="/imgs/icons/icons.svg#chevron-left" />
          </svg>
        </button>
        <button
          class="bg-grayLight dark:bg-blueDark border border-grayLight4 dark:border-white11 opacity-80 hover:opacity-100 rounded-[11px] w-[36px] h-[36px] flex items-center justify-center"
          id="slidePrev"
          on:click={onNextPage}
        >
          <svg class="w-[24px] h-[24px] rotate-[180deg]">
            <use class="dark:fill-white fill-black" href="/imgs/icons/icons.svg#chevron-left" />
          </svg>
        </button>
      </div>
    </div>
  </div>
  <Swiper
    id="casinoSlider"
    bind:this={casinoSlider}
    class="w-full"
    spaceBetween={15}
    slidesPerView={2}
    modules={[Pagination]}
    breakpoints={{
      0: {
        slidesPerView: 2
      },
      640: {
        slidesPerView: 3
      },
      768: {
        slidesPerView: 4
      },
      1024: {
        slidesPerView: 5
      },
      1440: {
        slidesPerView: 6
      }
    }}
  >
    <slot />
  </Swiper>
</div>
