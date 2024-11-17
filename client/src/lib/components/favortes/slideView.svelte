<script>
  import { onMount } from 'svelte';
  import { Navigation, Pagination } from 'swiper';

  import { Swiper, SwiperSlide } from 'swiper/svelte';
  import 'swiper/css';
  import 'swiper/css/navigation';
  import 'swiper/css/pagination';
  import SliderItem from '../sliderview/sliderItem.svelte';

  // Category Slider
  export let data;
  export let type;
  let slider;

  const onSliderPrev = () => {
    slider.swiper().slidePrev();
  };
  const onSliderNext = () => {
    slider.swiper().slideNext();
  };
</script>

<div class="w-full flex flex-col items-start gap-[15px] mt-[37px]">
  <div class="w-full flex items-center justify-between">
    <h6 class="font-semibold text-xl gradient-text-white2 main">{type}</h6>
    <div class="flex items-center gap-[11px]">
      <button
        class="bg-grayLight dark:bg-blueDark border border-grayLight4 dark:border-white11 opacity-80 hover:opacity-100 rounded-[11px] w-[36px] h-[36px] flex items-center justify-center"
        id="slidePrev"
        on:click={onSliderPrev}
      >
        <svg class="w-[24px] h-[24px]">
          <use class="dark:fill-white fill-black" href="/imgs/icons/icons.svg#chevron-left" />
        </svg>
      </button>
      <button
        class="bg-grayLight dark:bg-blueDark border border-grayLight4 dark:border-white11 opacity-80 hover:opacity-100 rounded-[11px] w-[36px] h-[36px] flex items-center justify-center"
        id="slidePrev"
        on:click={onSliderNext}
      >
        <svg class="w-[24px] h-[24px] rotate-[180deg]">
          <use class="dark:fill-white fill-black" href="/imgs/icons/icons.svg#chevron-left" />
        </svg>
      </button>
    </div>
  </div>
  <Swiper
    bind:this={slider}
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
    {#each data as categoryItem}
      <SwiperSlide>
        <SliderItem item={categoryItem} load={false} type={categoryItem.type} />
      </SwiperSlide>
    {/each}
  </Swiper>
</div>
