<script>
  import { onMount } from 'svelte';
  import globalStore from '@store/globalStore';
  import BreadCrumb from '$lib/components/breadCrumb/breadCrumb.svelte';
  import ActivityTable from '$lib/components/main/activityTable/activityTable.svelte';
  import Footer from '$lib/components/footer/footer.svelte';
  import { LL, setLocale, locale } from '@src/i18n/i18n-svelte';
  import SliderView from '$lib/components/sliderview/sliderView.svelte';
  import firebase from '@components/firebase/firebase';
  import { signIn, getAccessToken, getRefreshToken, signupSocial } from '@apis/account';
  import toast from '@components/toast/toast';
  import PlayBallance from '@components/playBallance.svelte';

  import { LaunchCasino, getCasinoInfo, refreshToken, updateBalance } from '@apis/casino';
  import FavoriteApi from '@apis/favorite';

  let currencyId;

  $: if ($globalStore.userDetail) {
    currencyId = $globalStore.userDetail.currency._id;
  }
  $: isLoggedIn = $globalStore.userDetail;

  export let data;

  let link = '';
  let title = '';
  let type = '';
  let vendor = '';
  let itemData = null;
  $: idx = data.idx;

  let isPlay = false;
  let currency = '';
  let oldIdx = '';
  let isFullscreen = false;
  let thumbnail;
  let userId = $globalStore.userDetail ? $globalStore.userDetail._id : 'demo';

  let breadCrumbPages = [
    {
      name: 'casino',
      route: '/casino'
    },
    {
      name: type,
      route: `/casino/${type}`
    }
  ];

  let isLoad = '';

  $: {
    if (!$globalStore.userDetail && $globalStore.userDetail != isLoad) {
      isLoad = $globalStore.userDetail;
      currency = '';
      oldIdx = data.idx;
      onRefreshGame();
    } else if ($globalStore.userDetail && $globalStore.userDetail != isLoad) {
      currency = $globalStore.userDetail.currentCurrecnySymbol;
      oldIdx = data.idx;
      isLoad = $globalStore.userDetail;
      onRefreshGame();
    } else if ($globalStore.userDetail && currency != $globalStore.userDetail.currentCurrecnySymbol) {
      isLoad = $globalStore.userDetail;
      currency = $globalStore.userDetail.currentCurrecnySymbol;
      oldIdx = data.idx;
      onRefreshGame();
    } else if (oldIdx != data.idx) {
      isLoad = $globalStore.userDetail;
      currency = $globalStore.userDetail.currentCurrecnySymbol;
      oldIdx = data.idx;
      onRefreshGame();
    }
  }

  const onRefreshGame = async () => {
    isPlay = false;
    const res = await getCasinoInfo(idx, userId);
    
    title = res.info.title;
    type = res.info.type;
    thumbnail = res.info.thumbnail;
    vendor = res.info.vendor;

    itemData = res.info;

    breadCrumbPages = [
      {
        name: 'casino',
        route: '/casino'
      },
      {
        name: type,
        route: `/casino/${type}`
      }
    ];

    updateLink();
  };

  const loginAndStart = async () => {
    await signInWithGoogle();
  };

  const updateLink = async () => {
    const resLink = await LaunchCasino(idx, userId);
    const tokenData = await refreshToken(userId);
    link = resLink.link;

    link = link.replace(/token=[^&]+/, 'token=' + tokenData.token);
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

  const onPlay = () => {
    isPlay = true;
  };

  const linkPlay = async () => {
    await updateBalance(userId, currencyId);
    const resLink = await LaunchCasino(idx, userId);
    const tokenData = await refreshToken(userId);
    link = resLink.link;
    link = link.replace(/token=[^&]+/, 'token=' + tokenData.token);

    window.open(link, '_blank');
  };

  const updateFavorite = async () => {
    if ($globalStore.userDetail == null) {
      await signInWithGoogle();
      return;
    } else if (itemData && itemData.isFavorite == false) {
      const res = await FavoriteApi.createFavorite($globalStore.userDetail._id, itemData.id, 'casino');
      if (res.success) {
        itemData.favorites++;
        itemData.isFavorite = true;
      }
    } else if (itemData && itemData.isFavorite == true) {
      const res = await FavoriteApi.deleteFavorite($globalStore.userDetail._id, itemData.id, 'casino');

      if (res.success) {
        itemData.favorites--;
        itemData.isFavorite = false;
      }
    }
  };
</script>

<main class="w-full py-[27px] md:pl-[30px] md:pr-[30px]" id="main">
  <div class="relative container-main-sm">
    <div class="pl-[15px] pr-[15px] md:pl-[0px] md:pr-[0px]">
      <BreadCrumb pages={breadCrumbPages} current={title} />
    </div>

    <div
      class="relative w-full flex flex-col bg-white dark:bg-white5 rounded-b-[14px] md:rounded-[14px] border-b-[4px] border-b-blue mt-[25px] overflow-hidden"
    >
      <!-- PC version -->
      <div class="hidden sm:block">
        <div
          class={`min-h-[350px] md:min-h-[450px]${
            isFullscreen ? 'fixed top-0 left-0 w-screen h-screen z-[999999999]' : 'relative w-full'
          }`}
        >
          <iframe class="h-full min-h-[500px]" src={link} width="100%" frameborder="0" />
          {#if !isLoggedIn}
            <div
              class="absolute left-0 top-0 bg-black60 backdrop-blur-[6px] w-full h-full flex items-center justify-center"
            >
              <button
                class="px-[15px] py-[10px] bg-linear rounded-[7px] flex items-center gap-[10px]"
                on:click={loginAndStart}
              >
                <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_200_7965)">
                    <path
                      opacity="0.994"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M7.34082 -0.0146484C7.77052 -0.0146484 8.20019 -0.0146484 8.62988 -0.0146484C11.5685 0.351038 13.6632 1.87448 14.9141 4.55566C15.2157 5.29356 15.4062 6.05528 15.4854 6.84082C15.4854 7.27052 15.4854 7.70019 15.4854 8.12988C15.1197 11.0685 13.5962 13.1632 10.915 14.4141C10.1771 14.7157 9.41542 14.9062 8.62988 14.9854C8.20019 14.9854 7.77052 14.9854 7.34082 14.9854C4.4022 14.6197 2.30746 13.0962 1.05664 10.415C0.75498 9.67714 0.56455 8.91542 0.485352 8.12988C0.485352 7.70019 0.485352 7.27052 0.485352 6.84082C0.851038 3.9022 2.37448 1.80746 5.05566 0.556641C5.79356 0.25498 6.55528 0.0645504 7.34082 -0.0146484ZM6.43262 4.70215C6.60181 4.68091 6.75805 4.71507 6.90137 4.80469C8.06545 5.54871 9.23732 6.28113 10.417 7.00195C10.7537 7.16235 10.8465 7.41138 10.6953 7.74902C9.38937 8.60962 8.06612 9.44458 6.72559 10.2539C6.3793 10.3177 6.17911 10.1761 6.125 9.8291C6.10546 8.26661 6.10546 6.70409 6.125 5.1416C6.14334 4.93333 6.24588 4.78685 6.43262 4.70215Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_200_7965">
                      <rect width="15" height="15" fill="white" transform="translate(0.5)" />
                    </clipPath>
                  </defs>
                </svg>
                <p class="text-sm font-medium text-white">
                  {$LL.LOGIN_AND_GET_STARTED()}
                </p>
              </button>
            </div>
          {:else}
            <div
              class={`absolute left-0 top-0 bg-black60 backdrop-blur-[6px] w-full h-full flex items-center justify-center ${
                isPlay ? 'hidden' : ''
              }`}
            >
              <PlayBallance on:play={onPlay} />
            </div>
            <span
              class="absolute bottom-2 right-2 w-[40px] h-[40px] p-[10px] rounded-full cursor-pointer hover:bg-[#00000080]"
              on:click={() => (isFullscreen = !isFullscreen)}
            >
              <!-- {#if !isFullscreen}
                <img src="/imgs/fullscreen.svg" alt="" />
              {:else}
                <img src="/imgs/fullscreen_exit.svg" alt="" />
              {/if} -->
            </span>
          {/if}
        </div>
        <div class="w-full hidden md:flex items-center gap-[17px] p-[15px]">
          <div
            class="cursor-pointer flex items-center justify-center w-[30px] h-[30px] bg-grayLight4 dark:bg-white5 rounded-md"
            on:click={updateFavorite}
          >
            <svg width="16" height="16">
              <use
                class={`${itemData && itemData.isFavorite ? 'fill-yellow' : 'fill-gray'}`}
                href="/imgs/icons/icons.svg#star"
              />
            </svg>
          </div>

          <p class="mt-1 text-sm font-medium text-black50 dark:text-white50 capitalize">
            {itemData ? itemData.favorites.toLocaleString() : 0}
          </p>
        </div>
      </div>

      <!-- Mobile Version-->
      <div class="sm:hidden relative top-0">
        <div class="sm:hidden block max-h-[300px] h-screen bg-[url('{thumbnail}')]">
          <img class="rounded-md h-full w-full opacity-10" src={thumbnail} alt="" />
        </div>

        <div class="absolute top-0 m-5">
          <div class="flex gap-10">
            <img src={thumbnail} alt="" class="max-h-[200px] rounded-xl" />
            <div>
              <div class="text-xl text-stone-50">{title}</div>
              <div>
                <span class="text-sm text-stone-600">BY</span>
                <span class="text-sm text-stone-300"> {vendor}</span>
              </div>

              <div class="flex gap-3 mt-28">
                <div
                  class="cursor-pointer flex items-center justify-center w-[30px] h-[30px] bg-grayLight4 dark:bg-white5 rounded-md"
                  on:click={updateFavorite}
                >
                  <svg width="16" height="16">
                    <use
                      class={`${itemData && itemData.isFavorite ? 'fill-yellow' : 'fill-gray'}`}
                      href="/imgs/icons/icons.svg#star"
                    />
                  </svg>
                </div>

                <p class="mt-1 text-sm font-medium text-black50 dark:text-white50 capitalize">
                  {itemData ? itemData.favorites.toLocaleString() : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <button
            on:click={onPlay}
            class="flex items-center justify-center h-[52px] bg-primary px-6 rounded-[7px] w-full"
            on:click={() => {
              linkPlay();
            }}
          >
            <p class="text-white text-base">Play Game</p>
          </button>
        </div>
      </div>
    </div>

    <div class="pl-[15px] pr-[15px] md:pl-[0px] md:pr-[0px]">
      <!-- Recent Bet Deposits & Withdrawal History -->
      <ActivityTable title="Latest Bet & Race" showCols={[1, 0, 0]} />
      <!-- Footer -->
      <Footer banner={false} />
    </div>
  </div>
</main>
