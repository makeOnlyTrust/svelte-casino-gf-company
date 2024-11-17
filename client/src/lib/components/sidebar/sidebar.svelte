<style>
</style>

<script>
  import { writable } from 'svelte/store';
  import Select from 'svelte-select';
  import globalStore from '@store/globalStore';
  import { onMount, setContext } from 'svelte';
  import { page } from '$app/stores';
  import { LL, setLocale, locale } from '@src/i18n/i18n-svelte';
  import { loadLocaleAsync } from '@src/i18n/i18n-util.async';
  import LangSelect from '../langSelect.svelte';
  import AddAgentModal from '../modals/addAgentModal.svelte';
  import { sportsNavItems } from '../../../controllers/sidebar.controller';
  import firebase from '@components/firebase/firebase';
  import { signIn, getAccessToken, getRefreshToken, signupSocial } from '@apis/account';
  import toast from '@components/toast/toast';
  import { goto } from '$app/navigation';
  import NavItem from '../navItem.svelte';

  $: path = $page.url.pathname;
  const items = [
    { image: '/imgs/lang/uk.svg', value: 'EN', label: 'English' },
    { image: '/imgs/lang/kr.svg', value: 'KR', label: 'Korean' },
    { image: '/imgs/lang/ch.svg', value: 'KR', label: 'Korean' },
    { image: '/imgs/lang/jp.svg', value: 'KR', label: 'Korean' }
  ];

  // Declare selectedValue as a writable store
  let selectedValue = writable(items[0].value);

  $: sidebarOpen = $globalStore.sidebar;

  $: isMobile = $globalStore.isMobile;

  $: if($globalStore.sidebar) {
    sidebarOpen = $globalStore.sidebar;
  }

  $: if(sidebarOpen) {
    if (sidebarOpen) {
      document.body.classList.add('aside-active');
    } else {
      document.body.classList.remove('aside-active');
    }
  }

  onMount(() => {
    if (sidebarOpen) {
      document.body.classList.add('aside-active');
    } else {
      document.body.classList.remove('aside-active');
    }

    handleScreenResize();
    window.addEventListener('resize', handleScreenResize);
  });

  function handleScreenResize() {
    if (window.innerWidth < 768) {
      globalStore.toggleItem('isMobile', true);
    } else {
      globalStore.toggleItem('isMobile', false);
      globalStore.toggleItem('chatOpen', true);
    }

    if (window.innerWidth > 1280) {
      globalStore.toggleItem('sidebar', true);
    }
  }

  const handleSidebar = () => {
    if (!sidebarOpen) {
      document.body.classList.add('aside-active');
    } else {
      document.body.classList.remove('aside-active');
    }
    globalStore.toggleItem('sidebar', !$globalStore.sidebar);
  };

  const closeSidebar = () => {
    if (sidebarOpen) {
      document.body.classList.remove('aside-active');
      globalStore.toggleItem('sidebar', !$globalStore.sidebar);
    }
  };

  const openAddAgentModal = () => {
    globalStore.toggleItem('addAgentModal', true);
  };

  const closeAddAgentModal = () => {
    globalStore.toggleItem('addAgentModal', false);
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

  let sportsSearchValue = '';
  const onSportsSearch = async (search) => {
      globalStore.toggleItem('SportsSearch',search)
      globalStore.toggleItem('SportsSearchStatus',true);
      // console.log(search);
      // console.log($page.params.sports)
  }
</script>

<aside
  class="sidebar fixed left-[-1000px] md:left-0 top-0 md:h-screen w-full md:w-[93px] bg-white dark:bg-blackDark border-1 dark:border-white11 z-[999999999]"
>
  <div
    on:click={handleSidebar}
    class={`${
      sidebarOpen ? 'scale-[-1]' : ''
    } hidden md:flex transition-all cursor-pointer absolute right-[-20px] top-[77px] z-[99] w-[38px] h-[38px] rounded-[11px] bg-grayLight4 dark:bg-white5 backdrop-blur-[25px] border border-grayLight dark:border-white11 flex items-center justify-center`}
  >
    <svg class="w-[24px] h-[24px] rotate-[180deg]">
      <use class="fill-black dark:fill-white" href="/imgs/icons/icons.svg#chevron-left" />
    </svg>
  </div>
  <div class="relative w-full h-full flex flex-col items-center">
    <div class="head px-[10px] w-full overflow-hidden">
      <img src="/imgs/asideEclipse.svg" class="absolute z-[-1] right-0 top-[-45px]" alt="" />

      <div
        class="head head-mob pt-[37px] pb-[28px] border-b dark:border-white9 border-grayLight2 w-full flex items-center justify-between md:justify-center"
      >
        <a href="/" on:click={closeSidebar} class="flex items-center overflow-hidden min-w-max">
          <img class=" flex max-w-[206px] logoTitle dark" src="/imgs/LogoWithTitle.svg" alt="Logo with title" />
          <img class=" max-w-[206px] logoTitle light" src="/imgs/LogoWithTitleDark.svg" alt="Logo with title" />
          <img class="logo" src="/imgs/Logo.svg" alt="Logo" />
        </a>
        <div
          on:click={closeSidebar}
          class="ml-auto w-[35px] h-[35px] bg-grayLight dark:bg-white11 rounded-full items-center justify-center flex md:hidden opacity-80 hover:opacity-100 transition-all cursor-pointer"
        >
          <svg class="w-[16px] h-[16px] translate-y-[1.5px]">
            <use class="fill-black dark:fill-white" href="/imgs/icons/icons.svg#close" />
          </svg>
        </div>
      </div>
      {#if !path.includes('/sports')}
        <div
          class="head-main head-mob flex flex-col gap-[20px] w-full items-center justify-center py-[30px] border-b dark:border-b-white9 border-b-grayLight2"
        >
          <div class="headMain-title w-full flex items-center justify-between">
            <h6 class="font-semibold text-base text-yellow min-w-max">
              {$LL.MY_VIP_PERKS()}
            </h6>
            <a class="font-medium text-xs text-gray min-w-max" href="#">{$LL.VIEW_ALL()}</a>
          </div>
          <a
            href="/"
            on:click={() => {
              closeSidebar();
            }}
            class="spinner relative overflow-hidden gap-[28px] flex bg-blue88 dark:bg-transparent items-center p-[12px] border dark:border-white9 border-grayLight2 rounded-[16px] cursor-pointer"
          >
            <img class="z-[1] min-w-max" src="/imgs/spinner.svg" alt="spinner" />
            <div class="spinner-text flex flex-col gap-[3px]">
              <p class="font-semibold text-base text-white min-w-max">
                {$LL.SPIN_NOW()}
              </p>
              <p class="font-normal text-sm text-grayLight2 dark:text-gray min-w-max">
                {$LL.UNLOCKED()}
              </p>
            </div>
            <div class="left absolute w-[58px] h-[58px] bg-linear2 left-[-12px] blur-[22px]" />
            <div class="right absolute w-[58px] h-[58px] bg-linear2 left-[6px] blur-[44px]" />
          </a>
        </div>
      {/if}
    </div>

    <nav
      class="{path.includes('/sports')
        ? 'h-[calc(100vh-265px)] md:h-[calc(100vh-125px)]'
        : 'h-[calc(100vh-445px)] md:h-[calc(100vh-345px)]'} px-[10px] relative w-full flex flex-col overflow-x-hidden overflow-y-auto custom-scrollbar"
    >
      <ul
        class="flex flex-col items-center dark:border-t-white9 border-b dark:border-b-white9 border-b-grayLight2 w-full h-fit py-[25px]"
      >
        <li class="w-full">
          <a
            href="/favorites"
            on:click={() => {
              if (isMobile) closeSidebar();
            }}
            class={`${
              path === '/favorites' ? 'active' : ''
            } group navLink relative flex gap-[21px] items-center justify-center`}
          >
            <svg class="icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_62_8892)">
                <path
                  opacity="0.987"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M9.12109 -0.0195312C9.69402 -0.0195312 10.2669 -0.0195312 10.8398 -0.0195312C14.758 0.468051 17.551 2.4993 19.2188 6.07422C19.621 7.05809 19.8749 8.07371 19.9805 9.12109C19.9805 9.69402 19.9805 10.2669 19.9805 10.8398C19.4929 14.758 17.4616 17.551 13.8867 19.2188C12.9029 19.621 11.8872 19.8749 10.8398 19.9805C10.2669 19.9805 9.69402 19.9805 9.12109 19.9805C5.20293 19.4929 2.40995 17.4616 0.742188 13.8867C0.339973 12.9029 0.0860672 11.8872 -0.0195312 10.8398C-0.0195312 10.2669 -0.0195312 9.69402 -0.0195312 9.12109C0.468051 5.20293 2.4993 2.40995 6.07422 0.742188C7.05809 0.339973 8.07371 0.0860672 9.12109 -0.0195312ZM9.90234 1.97266C10.1657 1.97739 10.3805 2.08155 10.5469 2.28516C11.184 3.66286 11.8285 5.03656 12.4805 6.40625C13.9133 6.62395 15.3456 6.84531 16.7773 7.07031C17.3059 7.31504 17.4166 7.68613 17.1094 8.18359C16.0938 9.22527 15.0781 10.2669 14.0625 11.3086C14.0364 11.4128 14.0364 11.5169 14.0625 11.6211C14.2958 13.0526 14.5237 14.4849 14.7461 15.918C14.6716 16.4809 14.3591 16.6958 13.8086 16.5625C12.5366 15.8565 11.2605 15.1599 9.98047 14.4727C8.70039 15.1599 7.42434 15.8565 6.15234 16.5625C5.60891 16.6877 5.29641 16.4729 5.21484 15.918C5.45172 14.4121 5.6991 12.9082 5.95703 11.4062C4.91055 10.2946 3.84934 9.19434 2.77344 8.10547C2.55971 7.60043 2.70945 7.25539 3.22266 7.07031C4.64121 6.84473 6.06047 6.6234 7.48047 6.40625C8.11934 5.03078 8.76387 3.6571 9.41406 2.28516C9.54602 2.12523 9.70879 2.02107 9.90234 1.97266Z"
                  fill="#687080"
                />
              </g>
              <defs>
                <clipPath id="clip0_62_8892">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <p class="nav-text text-gray font-medium text-base">
              {$LL.FAVORITE()}
            </p>
            <img
              class="navRadial absolute left-[-10px] opacity-0 group-hover:opacity-[1] transition-all"
              src="/imgs/navRadial.svg"
              alt="navRadial"
            />
          </a>
        </li>
      </ul>

      {#if path.includes('/sports')}
        <div
          class="{sidebarOpen
            ? ''
            : 'hidden'} flex flex-col items-center dark:border-t-white9 border-b dark:border-b-white9 border-b-grayLight2 w-full h-fit py-[25px]"
        >
          <div class="relative z-[99] w-full flex flex-col gap-[15px]">
            <div
              class="w-full grid grid-cols-[auto,1fr] items-center pl-3 gap-3 bg-grayLight4 dark:bg-white5 rounded-[7px] focus:bg-red"
            >
              <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M9.21094 1.6875C5.58657 1.6875 2.64844 4.62563 2.64844 8.25C2.64844 11.8744 5.58657 14.8125 9.21094 14.8125C10.7329 14.8125 12.1338 14.2944 13.247 13.425L16.6882 16.8663C16.9079 17.0859 17.264 17.0859 17.4837 16.8663C17.7034 16.6466 17.7034 16.2904 17.4837 16.0708L14.0719 12.6589C15.1292 11.4939 15.7734 9.94719 15.7734 8.25C15.7734 4.62563 12.8353 1.6875 9.21094 1.6875ZM3.77344 8.25C3.77344 5.24695 6.20789 2.8125 9.21094 2.8125C12.214 2.8125 14.6484 5.24695 14.6484 8.25C14.6484 11.253 12.214 13.6875 9.21094 13.6875C6.20789 13.6875 3.77344 11.253 3.77344 8.25Z"
                  fill="#656E79"
                />
              </svg>

              <input
                type="text"
                placeholder="Search here..."
                class="w-full h-full bg-transparent py-[14px] pt-[16px] outline-none text-sm text-black dark:text-white"
                value={sportsSearchValue}
                on:change={async (e)=>{
                  await onSportsSearch(e.currentTarget.value);
                }}
                on:input={(e)=>{
                  sportsSearchValue=e.currentTarget.value;
                }}
              />
            </div>
          </div>
        </div>
      {/if}

      <ul class="flex flex-col gap-[30px] items-center w-full h-fit py-[25px]">
        {#if path.includes('/sports')}
          {#each sportsNavItems as navItem}
            <NavItem
              to={navItem.to}
              iconName={navItem.iconName}
              text={navItem.text}
              additionalText={navItem.additionalText}
              sidebarOpen={sidebarOpen}
            />
          {/each}
        {:else}
          <li class="w-full">
            <a
              href="/casino"
              on:click={() => {
                if (isMobile) closeSidebar();
              }}
              class={`${path === '/casino' ? 'active' : ''} group navLink relative flex items-center justify-center`}
            >
              <svg
                class="icon"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_62_8950)">
                  <path
                    opacity="0.976"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M9.08203 -0.0195312C9.3034 -0.0195312 9.52473 -0.0195312 9.74609 -0.0195312C9.74609 0.944012 9.74609 1.90755 9.74609 2.87109C7.9568 2.93928 6.40734 3.5773 5.09766 4.78516C4.40754 4.12109 3.73047 3.44401 3.06641 2.75391C4.26914 1.57911 5.6884 0.765305 7.32422 0.3125C7.90777 0.158937 8.49371 0.0482598 9.08203 -0.0195312Z"
                    fill="white"
                  />
                  <path
                    opacity="0.977"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M10.2148 -0.0195312C10.4362 -0.0195312 10.6575 -0.0195312 10.8789 -0.0195312C13.0154 0.202511 14.9034 1.00329 16.543 2.38281C16.6673 2.50061 16.7845 2.6243 16.8945 2.75391C16.2305 3.44401 15.5534 4.12109 14.8633 4.78516C13.5561 3.57873 12.0066 2.94071 10.2148 2.87109C10.2148 1.90755 10.2148 0.944012 10.2148 -0.0195312Z"
                    fill="white"
                  />
                  <path
                    opacity="0.977"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M-0.0195312 9.74609C-0.0195312 9.52473 -0.0195312 9.3034 -0.0195312 9.08203C0.202511 6.94559 1.00329 5.05758 2.38281 3.41797C2.50061 3.29364 2.6243 3.17645 2.75391 3.06641C3.44401 3.73047 4.12109 4.40754 4.78516 5.09766C3.5773 6.40734 2.93928 7.9568 2.87109 9.74609C1.90755 9.74609 0.944012 9.74609 -0.0195312 9.74609Z"
                    fill="white"
                  />
                  <path
                    opacity="0.977"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M19.9805 9.08203C19.9805 9.3034 19.9805 9.52473 19.9805 9.74609C19.0169 9.74609 18.0534 9.74609 17.0898 9.74609C17.0216 7.9568 16.3836 6.40734 15.1758 5.09766C15.8398 4.40754 16.5169 3.73047 17.207 3.06641C18.3818 4.26914 19.1956 5.6884 19.6484 7.32422C19.802 7.90777 19.9127 8.49371 19.9805 9.08203Z"
                    fill="white"
                  />
                  <path
                    opacity="0.98"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M9.82422 6.30858C10.0472 6.27694 10.2425 6.33554 10.4102 6.48436C11.2891 7.36327 12.168 8.24218 13.0469 9.12108C13.6458 9.91534 13.6458 10.7096 13.0469 11.5039C12.3723 12.1472 11.6171 12.2644 10.7812 11.8555C10.8372 12.3049 10.9088 12.7541 10.9961 13.2031C10.987 13.4169 10.8829 13.5601 10.6836 13.6328C10.2148 13.6589 9.74609 13.6589 9.27734 13.6328C9.07805 13.5601 8.97391 13.4169 8.96484 13.2031C9.03297 12.7844 9.11109 12.3678 9.19922 11.9531C9.18621 11.9336 9.17316 11.9141 9.16016 11.8945C8.32418 12.2693 7.57551 12.1391 6.91406 11.5039C6.31512 10.7096 6.31512 9.91534 6.91406 9.12108C7.80598 8.22917 8.69793 7.33722 9.58984 6.4453C9.67684 6.40854 9.75496 6.36296 9.82422 6.30858Z"
                    fill="white"
                  />
                  <path
                    opacity="0.977"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M-0.0195312 10.2148C0.944012 10.2148 1.90755 10.2148 2.87109 10.2148C2.93928 12.0041 3.5773 13.5536 4.78516 14.8633C4.12109 15.5534 3.44401 16.2305 2.75391 16.8945C1.57911 15.6918 0.765305 14.2725 0.3125 12.6367C0.158937 12.0532 0.0482598 11.4672 -0.0195312 10.8789C-0.0195312 10.6575 -0.0195312 10.4362 -0.0195312 10.2148Z"
                    fill="white"
                  />
                  <path
                    opacity="0.977"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M19.9805 10.2148C19.9805 10.4362 19.9805 10.6575 19.9805 10.8789C19.7584 13.0154 18.9577 14.9034 17.5781 16.543C17.4604 16.6673 17.3366 16.7845 17.207 16.8945C16.5169 16.2305 15.8398 15.5534 15.1758 14.8633C16.3836 13.5537 17.0216 12.0042 17.0898 10.2148C18.0534 10.2148 19.0169 10.2148 19.9805 10.2148Z"
                    fill="white"
                  />
                  <path
                    opacity="0.977"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M9.74609 19.9805C9.52473 19.9805 9.3034 19.9805 9.08203 19.9805C6.94559 19.7584 5.05758 18.9577 3.41797 17.5781C3.29364 17.4604 3.17645 17.3366 3.06641 17.207C3.73047 16.5169 4.40754 15.8398 5.09766 15.1758C6.40734 16.3836 7.9568 17.0216 9.74609 17.0898C9.74609 18.0534 9.74609 19.0169 9.74609 19.9805Z"
                    fill="white"
                  />
                  <path
                    opacity="0.977"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M10.8789 19.9805C10.6575 19.9805 10.4362 19.9805 10.2148 19.9805C10.2148 19.0169 10.2148 18.0534 10.2148 17.0898C12.0041 17.0216 13.5536 16.3836 14.8633 15.1758C15.5534 15.8398 16.2305 16.5169 16.8945 17.207C15.7357 18.347 14.3685 19.1477 12.793 19.6094C12.1586 19.7818 11.5206 19.9055 10.8789 19.9805Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_62_8950">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <p class="nav-text text-gray font-medium text-base">
                {$LL.CASINO()}
              </p>

              <img
                class="navRadial absolute left-[-10px] opacity-0 group-hover:opacity-[1]"
                src="/imgs/navRadial.svg"
                alt="navRadial"
              />
            </a>
          </li>
          <li class="w-full">
            <a
              on:click={() => {
                if (isMobile) closeSidebar();
              }}
              href="/casino/slot"
              class="group navLink relative flex items-center justify-center"
            >
              <svg
                class="icon"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_62_8896)">
                  <path
                    opacity="0.987"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.24609 -0.0195312C7.76691 -0.0195312 8.28777 -0.0195312 8.80859 -0.0195312C12.0151 0.419859 14.2612 2.12559 15.5469 5.09766C16.0091 6.38645 16.1849 7.71457 16.0742 9.08203C16.5039 9.08203 16.9336 9.08203 17.3633 9.08203C17.3633 7.31121 17.3633 5.54035 17.3633 3.76953C16.5362 3.45155 16.0935 2.84608 16.0352 1.95312C16.1057 0.913059 16.6396 0.255505 17.6367 -0.0195312C17.8971 -0.0195312 18.1575 -0.0195312 18.418 -0.0195312C19.2383 0.201823 19.7591 0.722656 19.9805 1.54297C19.9805 1.80339 19.9805 2.0638 19.9805 2.32422C19.8126 3.03899 19.3829 3.52076 18.6914 3.76953C18.7104 5.8682 18.6909 7.96457 18.6328 10.0586C18.5219 10.2736 18.3461 10.3973 18.1055 10.4297C17.4285 10.4492 16.7514 10.4557 16.0742 10.4492C16.0807 13.0925 16.0742 15.7357 16.0547 18.3789C15.8631 19.2279 15.3488 19.7618 14.5117 19.9805C10.1888 19.9805 5.8659 19.9805 1.54297 19.9805C0.722656 19.7591 0.201823 19.2383 -0.0195312 18.418C-0.0195312 14.681 -0.0195312 10.944 -0.0195312 7.20703C0.293715 4.75023 1.45257 2.80362 3.45703 1.36719C4.60918 0.595527 5.87219 0.133286 7.24609 -0.0195312ZM7.75391 2.59766C9.34008 2.58035 10.6357 3.17931 11.6406 4.39453C11.9641 4.83313 12.205 5.31488 12.3633 5.83984C12.2347 6.41734 11.8961 6.59312 11.3477 6.36719C11.3021 6.3216 11.2565 6.27605 11.2109 6.23047C10.4641 4.40836 9.11645 3.65964 7.16797 3.98438C6.44656 4.19187 5.85414 4.58902 5.39062 5.17578C5.17027 5.55797 4.95543 5.94211 4.74609 6.32812C4.20145 6.60922 3.84987 6.45297 3.69141 5.85938C4.22543 4.23164 5.31918 3.18996 6.97266 2.73438C7.2366 2.67585 7.49699 2.63028 7.75391 2.59766ZM7.87109 5.21484C8.52453 5.24621 8.75238 5.57172 8.55469 6.19141C8.32867 6.46492 8.04871 6.53652 7.71484 6.40625C7.38945 6.16184 7.31785 5.85586 7.5 5.48828C7.60898 5.37246 7.7327 5.28133 7.87109 5.21484ZM3.30078 7.83203C6.45184 7.82551 9.60289 7.83203 12.7539 7.85156C12.9977 7.92609 13.1474 8.08887 13.2031 8.33984C13.2292 10.306 13.2292 12.2721 13.2031 14.2383C13.1445 14.5052 12.9818 14.668 12.7148 14.7266C9.58984 14.7526 6.46484 14.7526 3.33984 14.7266C3.08886 14.6708 2.9261 14.5211 2.85156 14.2773C2.82552 12.2852 2.82552 10.293 2.85156 8.30078C2.93042 8.07227 3.08016 7.91602 3.30078 7.83203ZM4.66797 16.0742C6.89457 16.0677 9.12113 16.0742 11.3477 16.0938C11.6899 16.1626 11.8852 16.371 11.9336 16.7188C11.8896 17.0491 11.7073 17.2574 11.3867 17.3438C9.14715 17.3698 6.90754 17.3698 4.66797 17.3438C4.16793 17.1578 4.03121 16.8258 4.25781 16.3477C4.37492 16.2212 4.51164 16.13 4.66797 16.0742Z"
                    fill="#67707B"
                  />
                  <path
                    opacity="0.953"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4.08203 9.08203C4.68098 9.08203 5.27996 9.08203 5.87891 9.08203C5.87891 10.5534 5.87891 12.0247 5.87891 13.4961C5.27996 13.4961 4.68098 13.4961 4.08203 13.4961C4.08203 12.0247 4.08203 10.5534 4.08203 9.08203Z"
                    fill="#67707B"
                  />
                  <path
                    opacity="0.953"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.12891 9.08203C7.72785 9.08203 8.32684 9.08203 8.92578 9.08203C8.92578 10.5534 8.92578 12.0247 8.92578 13.4961C8.32684 13.4961 7.72785 13.4961 7.12891 13.4961C7.12891 12.0247 7.12891 10.5534 7.12891 9.08203Z"
                    fill="#67707B"
                  />
                  <path
                    opacity="0.954"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M10.1758 9.08203C10.7747 9.08203 11.3737 9.08203 11.9727 9.08203C11.9792 10.5404 11.9727 11.9987 11.9531 13.457C11.3637 13.4957 10.7713 13.5087 10.1758 13.4961C10.1758 12.0247 10.1758 10.5534 10.1758 9.08203Z"
                    fill="#67707B"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_62_8896">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <p class="nav-text text-gray font-medium text-base">
                {$LL.SLOTS()}
              </p>

              <img
                class="navRadial absolute left-[-10px] opacity-0 group-hover:opacity-[1] transition-all"
                src="/imgs/navRadial.svg"
                alt="navRadia"
              />
            </a>
          </li>
          <li class="w-full">
            <a
              on:click={() => {
                if (isMobile) closeSidebar();
              }}
              href="/minigame"
              class="group navLink relative flex items-center justify-center"
            >
              <svg
                class="icon"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_62_8907)">
                  <path
                    opacity="0.989"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M2.12891 -0.0195312C4.86328 -0.0195312 7.59766 -0.0195312 10.332 -0.0195312C11.0385 0.17272 11.4747 0.628449 11.6406 1.34766C11.6602 2.89708 11.6667 4.44656 11.6602 5.99609C11.2165 6.10074 10.8129 6.28953 10.4492 6.5625C9.005 7.96766 7.5727 9.38691 6.15234 10.8203C4.86328 10.8464 3.57422 10.8464 2.28516 10.8203C1.49324 10.6795 1.00496 10.2172 0.820313 9.43359C0.79427 6.73828 0.79427 4.04297 0.820313 1.34766C0.986223 0.628449 1.42242 0.17272 2.12891 -0.0195312ZM4.12109 2.48047C4.73594 2.56795 5.00285 2.91951 4.92188 3.53516C4.78539 3.89269 4.52496 4.08801 4.14062 4.12109C3.4916 4.00816 3.24421 3.63055 3.39844 2.98828C3.56025 2.70223 3.80114 2.53296 4.12109 2.48047ZM8.06641 2.51953C8.78895 2.45447 9.13402 2.77999 9.10156 3.49609C8.90285 4.02187 8.53176 4.2107 7.98828 4.0625C7.49859 3.75926 7.38789 3.34911 7.65625 2.83203C7.77109 2.69388 7.90781 2.58971 8.06641 2.51953ZM8.10547 5.83984C8.6048 5.78656 8.93684 5.99488 9.10156 6.46484C9.13391 7.18758 8.78887 7.5066 8.06641 7.42188C7.53977 7.16906 7.39004 6.77191 7.61719 6.23047C7.74184 6.04832 7.90461 5.91809 8.10547 5.83984ZM4.00391 6.66016C4.6807 6.69227 4.98668 7.04383 4.92188 7.71484C4.69066 8.23734 4.30652 8.40012 3.76953 8.20312C3.30346 7.87223 3.21882 7.46207 3.51562 6.97266C3.65543 6.82516 3.81819 6.72098 4.00391 6.66016Z"
                    fill="#67707B"
                  />
                  <path
                    opacity="0.99"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12.2461 6.66016C12.8653 6.63914 13.4382 6.78891 13.9648 7.10938C15.4948 8.63934 17.0247 10.1693 18.5547 11.6992C19.1674 12.5301 19.2846 13.4286 18.9063 14.3945C18.8348 14.5636 18.7437 14.7198 18.6328 14.8633C17.1419 16.3542 15.6511 17.845 14.1602 19.3359C13.4297 19.9248 12.6094 20.094 11.6992 19.8438C11.417 19.7547 11.1566 19.6245 10.918 19.4531C9.42707 17.9622 7.93621 16.4714 6.44531 14.9805C5.87387 14.2609 5.70461 13.4536 5.9375 12.5586C6.02332 12.2958 6.14051 12.0484 6.28906 11.8164C7.81902 10.2864 9.34895 8.75653 10.8789 7.22656C11.2891 6.91863 11.7448 6.72985 12.2461 6.66016ZM12.2461 12.5195C12.8513 12.4543 13.2028 12.7212 13.3008 13.3203C13.2111 13.9048 12.8725 14.1652 12.2852 14.1016C11.7927 13.9045 11.6039 13.5464 11.7188 13.0273C11.8399 12.7954 12.0157 12.6262 12.2461 12.5195Z"
                    fill="#67707B"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_62_8907">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <p class="nav-text text-gray font-medium text-base">
                {$LL.MINI_GAME()}
              </p>

              <img
                class="navRadial absolute left-[-10px] opacity-0 group-hover:opacity-[1] transition-all"
                src="/imgs/navRadial.svg"
                alt="navRadial"
              />
            </a>
          </li>
          <li class="w-full">
            <a
              href="/sports/soccer"
              on:click={() => {
                isMobile && closeSidebar();
              }}
              class={`${
                path.includes('/sports') ? 'active' : ''
              } group navLink relative flex items-center justify-center`}
            >
              <svg
                class="icon"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_62_8894)">
                  <path
                    opacity="0.982"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.66016 0.644539C6.4218 0.614566 6.20043 0.660137 5.9961 0.781258C4.57242 1.8676 3.40707 3.17619 2.5 4.70704C2.47395 4.7461 2.47395 4.78516 2.5 4.82423C2.96379 5.13434 3.40653 5.4729 3.82813 5.83985C4.05645 6.13423 4.19317 6.46626 4.23828 6.83595C6.20332 7.83095 7.66164 9.32181 8.61328 11.3086C9.83559 11.9624 10.9359 12.7827 11.9141 13.7695C12.4219 14.3555 12.9297 14.9414 13.4375 15.5274C14.1888 16.3027 15.0287 16.9603 15.957 17.5C16.7126 17.9102 17.5199 18.1381 18.3789 18.1836C18.6871 18.1699 18.9866 18.1178 19.2773 18.0274C19.4804 17.2368 19.2591 16.5922 18.6133 16.0938C17.9753 15.5599 17.3372 15.0261 16.6992 14.4922C15.5963 14.0319 14.5025 13.5501 13.418 13.0469C12.9062 12.7199 12.5481 12.2707 12.3438 11.6992C11.6016 9.5638 10.8594 7.42841 10.1172 5.29298C9.33758 5.16677 8.62797 4.8738 7.98828 4.41407C7.51906 3.99005 7.2391 3.46271 7.14844 2.83204C7.08336 2.27275 7.07031 1.71285 7.10938 1.15235C7.04621 0.900703 6.89649 0.731434 6.66016 0.644539Z"
                    fill="#67707B"
                  />
                  <path
                    opacity="0.947"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M13.2617 3.06642C12.0313 2.94349 11.2631 3.47735 10.957 4.66798C11.2641 4.65646 11.57 4.63044 11.875 4.58986C12.5814 4.62728 13.1478 4.92677 13.5742 5.4883C13.5529 4.72236 13.4943 3.95412 13.3984 3.18361C13.3537 3.13922 13.3081 3.10015 13.2617 3.06642Z"
                    fill="#67707B"
                  />
                  <path
                    opacity="0.946"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12.0508 5.21484C11.6338 5.25391 11.2172 5.29297 10.8008 5.33203C11.5061 7.38941 12.2157 9.44672 12.9297 11.5039C13.1108 11.9321 13.3907 12.2771 13.7695 12.5391C14.6123 12.9051 15.4521 13.2762 16.2891 13.6523C16.1224 13.1228 15.9206 12.602 15.6836 12.0898C15.0837 11.8926 14.4782 11.7103 13.8672 11.543C13.5811 11.3951 13.5485 11.2063 13.7695 10.9766C13.8175 10.9461 13.8696 10.9265 13.9258 10.918C14.3835 11.0421 14.8392 11.1723 15.293 11.3086C15.306 11.2891 15.319 11.2695 15.332 11.25C15.241 10.9704 15.1238 10.7035 14.9805 10.4492C14.461 10.2956 13.9402 10.1459 13.418 10C13.1796 9.90957 13.1079 9.7468 13.2031 9.51172C13.2674 9.42727 13.352 9.3752 13.457 9.35547C13.8477 9.47266 14.2383 9.58984 14.6289 9.70703C14.6419 9.6875 14.655 9.66797 14.668 9.64844C14.5658 9.36793 14.4486 9.09449 14.3164 8.82812C13.8193 8.69281 13.3245 8.54957 12.832 8.39844C12.6157 8.2007 12.6287 8.01844 12.8711 7.85156C13.254 7.87727 13.6251 7.96191 13.9844 8.10547C13.9133 7.80148 13.8026 7.50852 13.6523 7.22656C13.2487 7.10938 12.845 6.99219 12.4414 6.875C12.1466 6.68539 12.1466 6.49008 12.4414 6.28906C12.7204 6.31016 12.9938 6.36875 13.2617 6.46484C13.2878 6.45184 13.3138 6.43879 13.3398 6.42578C13.1459 5.76281 12.7162 5.35914 12.0508 5.21484Z"
                    fill="#67707B"
                  />
                  <path
                    opacity="0.964"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M2.24609 5.37111C2.2002 5.36255 2.16113 5.37556 2.12891 5.41017C1.81227 6.05892 1.35004 6.57974 0.742188 6.97267C0.666445 7.16693 0.666445 7.36224 0.742188 7.55861C1.14984 8.42857 1.75531 9.11868 2.55859 9.62892C2.85273 8.8704 3.15875 8.11521 3.47656 7.36329C3.64328 6.94083 3.59121 6.55021 3.32031 6.19142C2.94902 5.93138 2.59094 5.65794 2.24609 5.37111Z"
                    fill="#67707B"
                  />
                  <path
                    opacity="0.957"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4.16016 7.48047C4.08848 7.50477 4.04289 7.55688 4.02344 7.63672C3.69887 8.44133 3.36684 9.24211 3.02734 10.0391C4.9359 11.4594 6.84996 12.8721 8.76953 14.2773C8.48348 11.7064 7.29855 9.65559 5.21484 8.125C4.86687 7.9 4.51531 7.68516 4.16016 7.48047ZM4.94141 9.04297C4.77367 9.03117 4.64996 9.09625 4.57031 9.23828C4.47574 9.55809 4.43668 9.88363 4.45312 10.2148C4.70375 10.4506 4.89906 10.4116 5.03906 10.0977C5.07965 9.85562 5.12523 9.61477 5.17578 9.375C5.14895 9.225 5.07082 9.11434 4.94141 9.04297ZM6.26953 10.0195C5.98074 9.9893 5.83098 10.1195 5.82031 10.4102C5.76414 10.6557 5.73809 10.903 5.74219 11.1523C5.90879 11.3893 6.09109 11.4024 6.28906 11.1914C6.36852 10.9102 6.42711 10.6237 6.46484 10.332C6.45813 10.1878 6.39301 10.0836 6.26953 10.0195Z"
                    fill="#67707B"
                  />
                  <path
                    opacity="0.954"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M9.08203 12.2852C9.04309 12.284 9.01703 12.3035 9.00391 12.3438C9.27184 13.1495 9.43457 13.9763 9.49219 14.8242C10.9961 15.9375 12.5 17.0508 14.0039 18.1641C15.285 19.0475 16.7043 19.4252 18.2617 19.2969C18.5232 19.2233 18.7055 19.0606 18.8086 18.8086C17.639 18.8466 16.5453 18.5667 15.5273 17.9688C14.5073 17.3531 13.5894 16.6044 12.7734 15.7227C11.7474 14.3514 10.517 13.2056 9.08203 12.2852Z"
                    fill="#67707B"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_62_8894">
                    <rect width="20" height="20" fill="white" transform="matrix(-1 0 0 1 20 0)" />
                  </clipPath>
                </defs>
              </svg>
              <p class="nav-text text-gray font-medium text-base">
                {$LL.SPORTS()}
              </p>

              <img
                class="navRadial absolute left-[-10px] opacity-0 group-hover:opacity-[1] transition-all"
                src="/imgs/navRadial.svg"
                alt="navRadial"
              />
            </a>
          </li>
          <li class="w-full border-b dark:border-white9 border-grayLight2 pb-8">
            <a
              href="/"
              on:click={async () => {
                if(isMobile) closeSidebar(); 
                await createUrl();
              }}
              class="group navLink relative flex items-center justify-center"
            >
              <svg
                class="icon"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.98"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M6.66016 1.62109C8.87375 1.61458 11.0873 1.62109 13.3008 1.64063C13.6555 1.70338 13.8834 1.9052 13.9844 2.24609C14.0104 3.18359 14.0104 4.12109 13.9844 5.05859C13.8645 5.45152 13.5976 5.65336 13.1836 5.66406C11.0482 5.69012 8.91277 5.69012 6.77734 5.66406C6.38172 5.65219 6.1148 5.4634 5.97656 5.09766C5.95051 4.1341 5.95051 3.17057 5.97656 2.20703C6.09258 1.87916 6.32043 1.68385 6.66016 1.62109Z"
                  fill="#67707B"
                />
                <path
                  opacity="0.868"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M9.27734 6.11329C9.73324 6.10676 10.189 6.11329 10.6445 6.13282C10.6823 6.30473 10.6953 6.48051 10.6836 6.66016C10.2148 6.66016 9.74609 6.66016 9.27734 6.66016C9.27734 6.47786 9.27734 6.29559 9.27734 6.11329Z"
                  fill="#67707B"
                />
                <path
                  opacity="0.986"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M5.37109 7.28516C8.37895 7.27864 11.3868 7.28516 14.3945 7.30469C15.4813 7.42836 16.23 7.99477 16.6406 9.00391C17.1997 11.0059 17.7466 13.0111 18.2812 15.0195C18.4587 16.4946 17.8793 17.5428 16.543 18.1641C14.9926 18.6029 13.8663 18.1016 13.1641 16.6602C13.0779 16.3282 12.9737 16.0027 12.8516 15.6836C12.6779 15.4574 12.45 15.3337 12.168 15.3125C10.7096 15.2865 9.25129 15.2865 7.79297 15.3125C7.43109 15.3363 7.17719 15.5121 7.03125 15.8398C6.90543 16.6061 6.56039 17.2506 5.99609 17.7734C4.79988 18.5659 3.64101 18.5138 2.51953 17.6172C1.70054 16.7827 1.44664 15.7997 1.75781 14.668C2.27257 12.7782 2.7934 10.8902 3.32031 9.00391C3.70116 8.06825 4.38477 7.49536 5.37109 7.28516ZM6.26953 9.51172C6.69426 9.44915 6.97422 9.6184 7.10937 10.0195C7.12887 10.2275 7.13539 10.4358 7.12891 10.6445C7.40934 10.6285 7.68277 10.6611 7.94922 10.7422C8.38242 11.0763 8.40848 11.4408 8.02734 11.8359C7.74145 11.958 7.44199 12.0036 7.12891 11.9727C7.13539 12.1814 7.12887 12.3897 7.10937 12.5977C6.98109 13.0167 6.70113 13.1795 6.26953 13.0859C6.06418 12.9978 5.92746 12.8481 5.85937 12.6367C5.83988 12.4157 5.83336 12.1944 5.83984 11.9727C5.52676 12.0036 5.2273 11.958 4.94141 11.8359C4.57684 11.4844 4.57684 11.1328 4.94141 10.7813C5.22789 10.6621 5.52738 10.6165 5.83984 10.6445C5.82512 10.3806 5.84465 10.1202 5.89844 9.86329C5.99242 9.71063 6.11609 9.59344 6.26953 9.51172ZM13.3008 9.51172C13.9319 9.49794 14.1858 9.79743 14.0625 10.4102C13.8723 10.749 13.5924 10.8597 13.2227 10.7422C12.8179 10.4914 12.7332 10.1593 12.9687 9.7461C13.0595 9.63301 13.1701 9.55489 13.3008 9.51172ZM12.0508 10.7617C12.6819 10.7479 12.9358 11.0474 12.8125 11.6602C12.6223 11.999 12.3424 12.1097 11.9727 11.9922C11.5679 11.7414 11.4832 11.4093 11.7187 10.9961C11.8095 10.883 11.9201 10.8049 12.0508 10.7617ZM14.5508 10.7617C15.1819 10.7479 15.4358 11.0474 15.3125 11.6602C15.1223 11.999 14.8424 12.1097 14.4727 11.9922C14.0679 11.7414 13.9832 11.4093 14.2187 10.9961C14.3095 10.883 14.4201 10.8049 14.5508 10.7617ZM13.3008 12.0117C13.931 11.9972 14.1849 12.2966 14.0625 12.9102C13.8423 13.2761 13.5364 13.3738 13.1445 13.2031C12.8075 12.9346 12.7489 12.6156 12.9687 12.2461C13.0595 12.133 13.1701 12.0549 13.3008 12.0117Z"
                  fill="#67707B"
                />
              </svg>
              <p class="nav-text text-gray font-medium text-base">
                {$LL.LIVE_SPORTS()}
              </p>
              <img
                class="navRadial absolute left-[-10px] opacity-0 group-hover:opacity-[1] transition-all"
                src="/imgs/navRadial.svg"
                alt="navRadial"
              />
            </a>
          </li>

          <li class="w-full">
            <a
              on:click={() => {
                isMobile && closeSidebar();
              }}
              href="/promotions"
              class="group navLink relative flex items-center justify-center"
            >
              <svg
                class="icon"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_62_8915)">
                  <path
                    opacity="0.991"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M9.58984 -0.0195312C9.85027 -0.0195312 10.1107 -0.0195312 10.3711 -0.0195312C10.6992 0.0664098 10.9987 0.21615 11.2695 0.429688C11.6193 0.849277 11.9643 1.27246 12.3047 1.69922C12.4769 1.89551 12.6918 1.96713 12.9492 1.91406C13.5379 1.72781 14.1368 1.59109 14.7461 1.50391C15.6754 1.56779 16.2939 2.03654 16.6016 2.91016C16.6673 3.53364 16.7194 4.15863 16.7578 4.78516C16.8284 5.01199 16.9781 5.16176 17.207 5.23438C17.6237 5.39062 18.0404 5.54688 18.457 5.70312C19.3216 6.16605 19.6927 6.88871 19.5703 7.87109C19.5391 8.00363 19.5001 8.13383 19.4531 8.26172C19.1691 8.74094 18.8696 9.20969 18.5547 9.66797C18.4245 9.87629 18.4245 10.0846 18.5547 10.293C18.8281 10.7096 19.1016 11.1263 19.375 11.543C19.798 12.5264 19.6092 13.3662 18.8086 14.0625C18.2893 14.3155 17.7555 14.5369 17.207 14.7266C16.9781 14.7992 16.8284 14.9489 16.7578 15.1758C16.7133 15.7352 16.6742 16.2951 16.6406 16.8555C16.4486 17.7376 15.9082 18.265 15.0195 18.4375C14.7572 18.4653 14.4968 18.4523 14.2383 18.3984C13.8086 18.2812 13.3789 18.1641 12.9492 18.0469C12.6918 17.9938 12.4769 18.0654 12.3047 18.2617C11.9643 18.6885 11.6193 19.1116 11.2695 19.5312C10.9987 19.7448 10.6992 19.8945 10.3711 19.9805C10.1107 19.9805 9.85027 19.9805 9.58984 19.9805C9.26172 19.8945 8.96223 19.7448 8.69141 19.5312C8.34168 19.1116 7.99664 18.6885 7.65625 18.2617C7.48402 18.0654 7.26918 17.9938 7.01172 18.0469C6.42336 18.233 5.82437 18.3698 5.21484 18.457C4.28559 18.3931 3.66708 17.9244 3.35937 17.0508C3.29174 16.4274 3.23965 15.8024 3.20312 15.1758C3.13253 14.9489 2.98279 14.7992 2.75391 14.7266C2.33724 14.5703 1.92057 14.4141 1.50391 14.2578C0.623039 13.8048 0.251944 13.0821 0.390625 12.0898C0.421785 11.9573 0.460848 11.8271 0.507812 11.6992C0.791875 11.22 1.09136 10.7513 1.40625 10.293C1.53646 10.0846 1.53646 9.87629 1.40625 9.66797C1.09136 9.20969 0.791875 8.74094 0.507812 8.26172C0.18029 7.31934 0.395133 6.5316 1.15234 5.89844C1.67161 5.64543 2.20546 5.42406 2.75391 5.23438C2.98279 5.16176 3.13253 5.01199 3.20312 4.78516C3.24608 4.22559 3.28514 3.6657 3.32031 3.10547C3.61177 1.99439 4.33441 1.46704 5.48828 1.52344C5.99809 1.64562 6.5059 1.77583 7.01172 1.91406C7.26918 1.96713 7.48402 1.89551 7.65625 1.69922C7.99664 1.27246 8.34168 0.849277 8.69141 0.429688C8.96223 0.21615 9.26172 0.0664098 9.58984 -0.0195312ZM7.28516 6.46484C8.08984 6.52738 8.53254 6.95707 8.61328 7.75391C8.55086 8.53898 8.1277 8.96867 7.34375 9.04297C6.55559 8.98398 6.13242 8.56082 6.07422 7.77344C6.13426 7.01687 6.53789 6.58066 7.28516 6.46484ZM12.7148 6.46484C13.1891 6.51562 13.417 6.77605 13.3984 7.24609C13.3636 7.38094 13.2985 7.49813 13.2031 7.59766C11.1914 9.60938 9.17969 11.6211 7.16797 13.6328C6.73137 13.9605 6.37332 13.8889 6.09375 13.418C6.04203 13.1897 6.08109 12.9814 6.21094 12.793C8.27473 10.7292 10.3386 8.66535 12.4023 6.60156C12.5062 6.54383 12.6104 6.49824 12.7148 6.46484ZM11.9336 11.2695C12.8073 11.2514 13.3021 11.6746 13.418 12.5391C13.349 13.3307 12.9193 13.7669 12.1289 13.8477C11.3475 13.7693 10.9178 13.3396 10.8398 12.5586C10.8976 11.8632 11.2622 11.4335 11.9336 11.2695Z"
                    fill="#67707B"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_62_8915">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <p class="nav-text text-gray font-medium text-base">
                {$LL.PROMOTIONS()}
              </p>
              <img
                class="navRadial absolute left-[-10px] opacity-0 group-hover:opacity-[1] transition-all"
                src="/imgs/navRadial.svg"
                alt="navRadial"
              />
            </a>
          </li>
        {/if}
        <NavItem
          classname={path.includes('/sports') ? 'border-t dark:border-white9 border-grayLight2 pt-8' : ''}
          onClick={() => {
            if (isMobile) closeSidebar();
            globalStore.toggleItem('supportChatOpen', !$globalStore.supportChatOpen);
          }}
          to="/"
          iconName="live-support"
          text={$LL.LIVE_SUPPORT()}
        />
      </ul>
    </nav>

    <div class="relative w-full px-[10px]">
      <div
        class="w-full flex flex-col gap-4 items-center justify-center pt-[25px] pb-[18px] border-t dark:border-t-white9 border-t-grayLight2"
      >
        {#if $globalStore.userDetail && $globalStore.userDetail.info && !$globalStore.userDetail.info.agentId}
          <button
            on:click={openAddAgentModal}
            class="{!sidebarOpen
              ? 'justify-center'
              : ''} w-full px-5 py-[14px] bg-blackLight dark:bg-white5 flex items-center gap-[6px] rounded-[7px] transition-all overflow-hidden"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 10H15" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M10 15V5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {#if sidebarOpen}
              <p class="text-sm mt-1 font-regular text-white min-w-max">Add Agent</p>
            {/if}
          </button>
        {/if}
        <LangSelect />
      </div>
    </div>
    <img
      src="/imgs/Ellipse.svg"
      alt="Ellipse"
      class="absolute {sidebarOpen ? 'bottom-[-150px] left-[-20px]' : 'bottom-[-50px] left-[0px]'} z-[-1]"
    />
  </div>
</aside>

{#if $globalStore.addAgentModal}
  <AddAgentModal closeAddAgentModal={closeAddAgentModal} />
{/if}
