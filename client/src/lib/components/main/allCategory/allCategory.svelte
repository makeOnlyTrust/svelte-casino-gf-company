<script>
  import { onMount } from 'svelte';
  import { Navigation, Pagination } from 'swiper';

  import { Swiper, SwiperSlide } from 'swiper/svelte';
  import 'swiper/css';
  import 'swiper/css/navigation';
  import 'swiper/css/pagination';
  import { LL, setLocale, locale } from '@src/i18n/i18n-svelte';

  import globalStore from '@store/globalStore';
  import firebase from '@components/firebase/firebase';
  import { signIn, getAccessToken, getRefreshToken, signupSocial } from '@apis/account';
  import toast from '@components/toast/toast';
  import { goto } from '$app/navigation';

  // Category Slider
  let categorySlider;
  const categorySliderArr = [
    {
      title: $LL.CASINO(),
      image: '/imgs/casino.svg',
      link: '/casino'
    },
    {
      title: $LL.SLOT(),
      image: '/imgs/slot.svg',
      link: '/casino/slot'
    },
    {
      title: $LL.SPORTS(),
      image: '/imgs/sports.svg',
      link: 'sports/soccer'
    },
    // {
    //   title: $LL.V_GAME(),
    //   image: '/imgs/v-games.svg',
    //   link: '/'
    // },
    {
      title: $LL.MINI_GAMES(),
      image: '/imgs/mini-games.svg',
      link: '/minigame'
    },
    {
      title: $LL.LIVE_SPORTS(),
      image: '/imgs/live-sports.svg',
      link: '/'
    }
  ];

  onMount(() => {
    categorySlider = document.getElementById('categorySlider').swiper;
  });

  const categorySliderPrev = () => {
    categorySlider.slidePrev();
  };
  const categorySliderNext = () => {
    categorySlider.slideNext();
  };

  const refreshToken = () => {
    return new Promise((resolve, reject) => {
      fetch('https://api.honorlink.org/api/user/refresh-token', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer q7Eh8nvLDivhwGpdjaefJ1U4t0eN31Z2OG6yL3N9'
        },
        body: JSON.stringify({
          username: $globalStore.userDetail._id
        })
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          resolve(data);
        })
        .catch((error) => console.error('Error:', error));
    });
  };

  const replaceToken = (url, newToken) => {
    return url.replace(/token=[^&]+/, 'token=' + newToken);
  };

  const createUrl = async () => {
    if ($globalStore.userDetail == null) {
      await signInWithGoogle();
      return;
    }
    fetch(
      `https://api.honorlink.org/api/game-launch-link?username=${$globalStore.userDetail._id}&game_id=live_sport&vendor=live-inplay`,
      {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer q7Eh8nvLDivhwGpdjaefJ1U4t0eN31Z2OG6yL3N9'
        }
      }
    )
      .then((response) => response.json())
      .then(async (data) => {
        const _ = await refreshToken();
        window.open(replaceToken(data.link, _.token));
      })
      .catch((error) => console.error('Error:', error));
  };

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    await provider.addScope('email');
    const data = await firebase.auth().signInWithPopup(provider);
    const userInfo = data.additionalUserInfo.profile;
    const res = await signupSocial({
      email: userInfo.email,
      password: userInfo.id
    });
    try {
      const res1 = await signIn({
        email: userInfo.email,
        password: userInfo.id
      });

      if (res1.success) {
        toast.success($LL[res1.data.key]());
        globalStore.toggleItem('loginForm', false);
        handleTokens();
      } else {
        toast.error($LL[res1.data.key]());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleTokens = async () => {
    const res = await getAccessToken();
    if (res.success) {
      globalStore.toggleItem('userDetail', res.data);
    } else if (res.data.code == 4001) {
      const res1 = await getRefreshToken();
      if (res1.success) {
        const res2 = await getAccessToken();
        if (res2.success) globalStore.toggleItem('userDetail', res2.data);
      } else {
        globalStore.toggleItem('userDetail', null);
      }
    } else {
      globalStore.toggleItem('userDetail', null);
    }
  };
</script>

<div class="w-full flex flex-col items-start gap-[15px] mt-[37px]">
  <div class="w-full flex items-center justify-between">
    <h6 class="font-semibold text-xl gradient-text-white2 main">
      {$LL.ALL_CATEGORIES()}
    </h6>
    <div class="flex items-center gap-[11px]">
      <button
        class="bg-grayLight dark:bg-blueDark border border-grayLight4 dark:border-white11 opacity-80 hover:opacity-100 rounded-[11px] w-[36px] h-[36px] flex items-center justify-center"
        id="slidePrev"
        on:click={categorySliderPrev}
      >
        <svg class="w-[24px] h-[24px]">
          <use class="dark:fill-white fill-black" href="/imgs/icons/icons.svg#chevron-left" />
        </svg>
      </button>
      <button
        class="bg-grayLight dark:bg-blueDark border border-grayLight4 dark:border-white11 opacity-80 hover:opacity-100 rounded-[11px] w-[36px] h-[36px] flex items-center justify-center"
        id="slidePrev"
        on:click={categorySliderNext}
      >
        <svg class="w-[24px] h-[24px] rotate-[180deg]">
          <use class="dark:fill-white fill-black" href="/imgs/icons/icons.svg#chevron-left" />
        </svg>
      </button>
    </div>
  </div>
  <Swiper
    id="categorySlider"
    class="w-full"
    spaceBetween={15}
    slidesPerView={2}
    modules={[Pagination]}
    breakpoints={{
      0: {
        slidesPerView: 2
      },
      535: {
        slidesPerView: 3
      },
      768: {
        slidesPerView: 4
      },
      1440: {
        slidesPerView: 4
      }
    }}
  >
    {#each categorySliderArr as categoryItem}
      <SwiperSlide>
        <a
          on:click={async () => {
            if (categoryItem.title == $LL.LIVE_SPORTS()) {
              await createUrl();
            } else {
              goto(categoryItem.link);
            }
          }}
          class="cursor-pointer group flex relative w-full bg-black rounded-[20px] border border-grayLight2 dark:border-white11 overflow-hidden"
        >
          <img
            class="group-hover:scale-[1.2] max-h-[250px] w-full object-cover transition05"
            src={categoryItem.image}
            alt="slot"
          />
          <p class="absolute top-0 top-[18px] left-[18px] text-xl gradient-text-white2 font-semibold">
            {categoryItem.title}
          </p>
        </a>
      </SwiperSlide>
    {/each}
  </Swiper>
</div>
