<script>
  import { onMount } from 'svelte';
  import { Navigation, Pagination } from 'swiper';
  import { LL, setLocale, locale } from '@src/i18n/i18n-svelte';

  import { getCasinoList, getTypes, getVendors } from '@apis/casino';
  import { Swiper, SwiperSlide } from 'swiper/svelte';
  import globalStore from '@store/globalStore';

  import 'swiper/css';
  import 'swiper/css/navigation';
  import 'swiper/css/pagination';
  import Skeleton from '../loader/skeleton.svelte';

  import firebase from '@components/firebase/firebase';
  import { signIn, getAccessToken, getRefreshToken, signupSocial } from '@apis/account';
  import toast from '@components/toast/toast';

  import SliderItem from './sliderItem.svelte';

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
    if (type == 'casino') {
      const res = await getCasinoList({
        title: '',
        type: category == 'hot' ? '' : category,
        vendor: '',
        page,
        sort: category == 'hot' ? 'rank' : '',
        limit: 20,
        userId: $globalStore.userDetail ? $globalStore.userDetail._id : ''
      });

      casinoSliderArr = res.data.list;
    } else if (type == 'vendors') {
      const res = await getVendors({});

      casinoSliderArr = res.data;
    } else if (type == 'types') {
      const res = await getTypes({});

      casinoSliderArr = res.data;
    } else {
      casinoSliderArr = [];
    }
  };
</script>

<div class="w-full flex flex-col items-start gap-[15px] mt-[37px]">
  <div class="w-full flex items-center justify-between">
    <h6 class="font-semibold text-xl gradient-text-white2 main">{title}</h6>
    <div class="flex items-center gap-4">
      {#if type !== 'vendors' && type !== 'types'}
        <a href={`/casino/${category}`} class="text-sm text-grayLight hover:text-primary transition-all capitalize"
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
    {#if type !== 'vendors' && type !== 'types'}
      {#if casinoSliderArr.length > 0}
        {#each casinoSliderArr as categoryItem}
          {#if categoryItem.thumbnail && categoryItem.thumbnail !== ''}
            <SwiperSlide>
              <SliderItem item={categoryItem} load={false} type={type} />
            </SwiperSlide>
          {/if}
        {/each}
      {/if}
    {:else if type == 'vendors'}
      {#each casinoSliderArr as categoryItem}
        <SwiperSlide>
          <a
            href="/vendors/{categoryItem.title.replaceAll(' ', '-')}"
            class="slider-main border-b-4 border-b-transparent px-2 group flex bg-white dark:bg-white5 relative w-full rounded-[20px] items-center gap-2 py-[18px] overflow-hidden hover:border-b-blue transition-all cursor-pointer"
          >
            <p
              class="text-sm text-grayDark2 mt-1 text-center w-full font-semibold text-ellipsis overflow-hidden whitespace-nowrap"
            >
              {categoryItem.title}
            </p>
          </a>
        </SwiperSlide>
      {/each}
    {:else if type == 'types'}
      {#each casinoSliderArr as categoryItem}
        <SwiperSlide>
          <a
            href="/themes/{categoryItem.title}"
            class="slider-main border-b-4 border-b-transparent px-2 group flex bg-white dark:bg-white5 relative w-full rounded-[20px] items-center gap-2 py-[18px] overflow-hidden hover:border-b-blue transition-all cursor-pointer"
          >
            <p
              class="text-sm text-grayDark2 mt-1 text-center w-full font-semibold text-ellipsis overflow-hidden whitespace-nowrap"
            >
              {categoryItem.title}
            </p>
          </a>
        </SwiperSlide>
      {/each}
    {/if}
  </Swiper>
</div>
