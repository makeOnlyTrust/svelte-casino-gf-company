<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import ModalLayout from '../modalLayout.svelte';
  import globalStore from '@store/globalStore';
  import { getTop, getTotalBet, getTotalWagered, getTotalWin } from "@apis/info.js";
  import { getAccessToken, getRefreshToken } from "@apis/account.js";
  import toast from "@components/toast/toast.js";

  const dispathEvent = createEventDispatcher();

  const closeProfileModal = () => {
    dispathEvent('closeProfileModal');
  };
  const editMyProfile = () => {
    dispathEvent('editMyProfile');
  };
  let totalWin = 0;
  let totalBet = 0;
  let totalWagered = 0;
  let top = [];
  onMount(async () => {
    await handleTokens();
    totalWin = (await getTotalWin()).count;
    totalBet = (await getTotalBet()).count;
    totalWagered = (await getTotalWagered()).total;
    top = (await getTop()).top;
  });

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
      toast.error('Bad Network Connection');
    }
  };
</script>

<ModalLayout on:closeProfileModal={closeProfileModal} title="My Profile">
  <div class="w-full flex flex-col items-center gap-[10px] my-[30px]">
    <div class="relative flex items-center justify-center w-[97px] h-[97px] rounded-full border border-blue bg-linear3">
      <div class="w-[87px] h-[87px] rounded-full">
        <img src={$globalStore.userDetail.profileImage} class="rounded-full w-full h-full object-cover" alt="profile" />
      </div>
    </div>
    <div class="relative w-full flex flex-col items-center gap-[4px]">
      <p class="text-mxl gradient-text-white2 main font-medium">
        {$globalStore.userDetail.nickname}
      </p>
      <p class="text-md text-black50 dark:text-white50 font-normal">
        User ID: {$globalStore.userDetail.email}
      </p>
      <div
        on:click={editMyProfile}
        class="absolute z-[9] right-[0px] top-[50%] translate-y-[-50%] group w-[39px] h-[39px] rounded-[10px] bg-grayLight4 dark:bg-white11 flex items-center justify-center cursor-pointer"
      >
        <svg class="w-[16x] h-[16px] opacity-70 group-hover:opacity-100 transition-all">
          <use class="fill-black dark:fill-white" href="/imgs/icons/icons.svg#edit" />
        </svg>
      </div>
    </div>
  </div>

  <div class="relative z-[9] w-full flex flex-col gap-[16px]">
    <div class="flex items-start gap-[8px]">
      <svg class="opacity-10 w-[20px] h-[20px]">
        <use class="fill-black dark:fill-white" href="/imgs/icons/icons.svg#statistics" />
      </svg>
      <p class="text-base font-normal text-black dark:text-white">Statistics</p>
    </div>
    <div class="w-full grid grid-cols-3 gap-[15px]">
      <div
        class="flex flex-col items-center gap-[10px] py-[19px] bg-grayLight4 dark:bg-white5 border border-white11 rounded-[7px]"
      >
        <img class="w-[37px]" src="/imgs/Icon_medal.svg" alt="medal_icon" />
        <p class="text-xs text-black50 dark:text-white50 font-medium">Total wins</p>
        <p class="text-base text-black dark:text-white font-semibold">{totalWin}</p>
      </div>
      <div
        class="flex flex-col items-center gap-[10px] py-[19px] bg-grayLight4 dark:bg-white5 border border-white11 rounded-[7px]"
      >
        <img class="w-[37px]" src="/imgs/Total_bets.svg" alt="bets_icon" />
        <p class="text-xs text-black50 dark:text-white50 font-medium">Total Bets</p>
        <p class="text-base text-black dark:text-white font-semibold">{totalBet}</p>
      </div>
      <div
        class="flex flex-col items-center gap-[10px] py-[19px] bg-grayLight4 dark:bg-white5 border border-white11 rounded-[7px]"
      >
        <img class="w-[37px]" src="/imgs/casino_chips.svg" alt="casino_chips_icon" />
        <p class="text-xs text-black50 dark:text-white50 font-medium">Total Wagered</p>
        <p class="text-base text-black dark:text-white font-semibold">₩ {Number((totalWagered).toFixed(0)).toLocaleString()}</p>
      </div>
    </div>
  </div>

  <div class="relative z-[9] w-full flex flex-col gap-[16px] mt-[27px]">
    <div class="flex items-center gap-[8px]">
      <svg class="opacity-10 w-[18px] h-[18px]">
        <use class="fill-black dark:fill-white" href="/imgs/icons/icons.svg#bookmark" />
      </svg>
      <p class="text-base font-normal text-black dark:text-white">Top 3 Favorite Games</p>
    </div>
    <div class="w-full grid grid-cols-3 gap-[15px]">
      {#each top as item, i}
        {#if i < 3}
          {#if item.cate === 'minigame'}
            <a on:click={closeProfileModal}
                    href={`/minigame/play/${item.type}/${item._id}/${item.gameId}`} class="w-full rounded-[12px] overflow-hidden transition-all">
              <img class="transition-all" src={item.thumbnail} alt="" />
            </a>
          {:else if item.cate === 'casino'}
            <a on:click={closeProfileModal}
                href={`/play/${item.type}/${item.gameId}`} class="w-full rounded-[12px] overflow-hidden transition-all">
              <img class="transition-all" src={item.thumbnail} alt="" />
            </a>
          {/if}
        {/if}
      {/each}
    </div>
  </div>
</ModalLayout>
