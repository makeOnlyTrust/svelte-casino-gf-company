<script>
  import { LL, setLocale, locale } from '@src/i18n/i18n-svelte';
  import firebase from '@components/firebase/firebase';
  import { signIn, getAccessToken, getRefreshToken, signupSocial } from '@apis/account';
  import globalStore from '@store/globalStore';
  import toast from '@components/toast/toast';

  $: isLoggedIn = $globalStore.userDetail;

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

  const onGetStart = async () => {
    if (isLoggedIn) {
      globalStore.toggleItem('newDepositModal', true);
    } else {
      await signInWithGoogle();
    }
  };
</script>

<div class="relative w-full">
  <img
    class="hidden md:flex w-full min-h-[260px] max-h-[320px] object-cover md:rounded-[14px]"
    src="/imgs/hero.svg"
    alt=""
  />
  <img class="md:hidden max-h-[450px] flex w-full object-cover md:rounded-[14px]" src="/imgs/hero2.svg" alt="" />
  <div class="md:flex hidden absolute left-[47px] top-[50%] translate-y-[-50%]">
    <div class="flex flex-col w-full max-w-[293px]">
      <p class="text-xs text-purpleLight font-medium uppercase">
        {$LL.SIGN_UP_GET_DEPOSIT_BONUS()}
      </p>
      <h4 class="text-3xl text-white font-semibold">{$LL.UP_TO_300()}</h4>
      <p class="text-xs text-purpleLight font-medium uppercase">
        {$LL.WWW()}
      </p>
      <button
        on:click={onGetStart}
        class="px-[26px] py-[16px] font-semibold text-msm bg-white9 text-white mt-[18px] border border-white9 rounded-[9px] opacity-80 hover:opacity-100 transition-all max-w-max"
        >{$LL.GET_STARTED()}</button
      >
    </div>
  </div>
  <div class="absolute bottom-[-15px] pt-[14px] flex flex-col items-center md:hidden justify-center w-full gap-[25px]">
    <div class="relative z-[1]">
      <div class="flex flex-col items-center w-full max-w-[293px]">
        <p class="text-base text-purpleLight font-medium uppercase">SIGN UP & GET DEPOSIT BONUS</p>
        <h4 class="text-2xl md:text-3xl text-yellow font-semibold">+300 Rewards</h4>
      </div>
    </div>
    <div class="relative z-[1] flex items-center gap-[15px]">
      <a
        href="#"
        class="rounded-[7px] px-[34px] py-[18px] bg-white dark:bg-white11 text-black dark:text-white font-semibold text-sm md:text-base border border-grayLight dark:border-white11 hover:text-white hover:bg-linear"
        >Deposit & Play</a
      >
      <a
        href="#"
        class="rounded-[7px] px-[34px] py-[18px] bg-white dark:bg-white11 text-black dark:text-white font-semibold text-sm md:text-base border border-grayLight dark:border-white11 hover:text-white hover:bg-linear"
        >Buy Crypto</a
      >
    </div>
    <img
      class="dark:flex hidden absolute h-full min-h-[250px] bottom-0 object-cover w-full"
      src="/imgs/ln.svg"
      alt="linear Background"
    />
    <img
      class="dark:hidden flex absolute h-full min-h-[250px] bottom-0 object-cover w-full"
      src="/imgs/heroLinearLight.svg"
      alt="linear Background"
    />
  </div>
</div>
