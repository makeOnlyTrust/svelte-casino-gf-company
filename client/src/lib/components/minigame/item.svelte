<script>
  import firebase from '@components/firebase/firebase';
  import { signIn, getAccessToken, getRefreshToken, signupSocial } from '@apis/account';
  import toast from '@components/toast/toast';

  import { LL, setLocale, locale } from '@src/i18n/i18n-svelte';
  import globalStore from '@store/globalStore';
  import FavoriteApi from '@apis/favorite';
  import Skeleton from '$lib/components/loader/skeleton.svelte';

  export let load = false;
  export let item;

  const type = 'minigame';

  const handleLoad = () => {
    load = true;
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

  const updateFavorite = async () => {
    if ($globalStore.userDetail == null) {
      await signInWithGoogle();
      return;
    } else if (item.favorites == false) {
      const res = await FavoriteApi.createFavorite($globalStore.userDetail._id, item.id, type);
      if (res.success) item.favorites = true;
    } else {
      const res = await FavoriteApi.deleteFavorite($globalStore.userDetail._id, item.id, type);

      if (res.success) item.favorites = false;
    }
  };
</script>

{#if !load}
  <Skeleton cardCount={1} className="min-h-[210px] pb-[25px]" auto={true} />
{/if}
<div
  class="{!load
    ? 'hidden'
    : ''} slider-main border-b-4 border-b-transparent group flex flex-col bg-white dark:bg-white5 relative w-full rounded-[20px] overflow-hidden hover:border-b-blue transition-all"
>
  <div class="relative main rounded-[20px] overflow-hidden">
    <img
      on:load={handleLoad}
      on:error={(event) => (event.target.src = '/imgs/no-image.jpg')}
      class="image w-full object-cover transition05"
      src={item.thumbnail}
      alt="slot"
    />

    <div
      class="group-hover:opacity-100 opacity-0 transition-all absolute left-0 top-0 w-full h-full bg-black81 flex items-center justify-center"
    >
      <div
        class="group-hover:opacity-100 opacity-0 transition-all absolute left-0 top-0 w-full h-full bg-black81 flex items-center justify-center"
      >
        <a
          href="/minigame/play/{item.category}/{item.gameId.toLowerCase().replaceAll(' ', '-')}/{item._id}"
          class="flex flex-col gap-[12px] scale-[0.80] group-hover:scale-[1] transition-all"
        >
          <img src="/imgs/play.svg" alt="play.svg" />
        </a>
      </div>
    </div>
  </div>
  <div class="w-full flex gap-[6px] items-center justify-between px-[13px] pt-[11px] pb-[16px]">
    <p class="text-sm text-grayDark2 font-semibold text-ellipsis overflow-hidden whitespace-nowrap">
      {item.title}
    </p>
    <button
      class="cursor-pointer flex items-center justify-center w-[30px] h-[30px] bg-grayLight4 dark:bg-white5 rounded-md"
      on:click={updateFavorite}
    >
      <svg width="12" height="12">
        <use class={`${item.favorites ? 'fill-yellow' : 'fill-gray'}`} href="/imgs/icons/icons.svg#star" />
      </svg>
    </button>
  </div>
</div>
