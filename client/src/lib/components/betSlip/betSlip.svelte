<script>
  import { createEventDispatcher, onMount } from 'svelte';

  import globalStore from '@store/globalStore';

  import SportsApi from '@apis/sport.js';

  import BetSlipCard from './betSlipCard.svelte';
  import MyBetSlipCard from './bettedSlipCard.svelte';
  import MyMultipleBetSlipCard from './bettedMultipleSlipCard.svelte';

  const dispathEvent = createEventDispatcher();

  const closeBetSlip = () => {
    dispathEvent('closeBetSlip');
  };

  const signInWithGoogle = () => {
    dispathEvent('signInWithGoogle');
  };

  $: bettingMode = $globalStore.sportsbetSlipMode;
  $: singleBettingCards = $globalStore.sportsSingleBettingCards;
  $: multipleBetttingCards = $globalStore.sportsMultipleBettingCards;

  let betSlipArr = [];
  let bettingTab = 'pending';

  let multipleBetAmount = 0;
  let multipleWinAmount = 0;
  let totalBetAmount = 0;
  let totalWinAmount = 0;
  let isDataLoading = false;

  const updateBettingAmount = (index, value) => {
    const bettingCards = [...singleBettingCards];
    bettingCards[index].bettingAmount = value;

    totalBetAmount = 0;
    totalWinAmount = 0;

    bettingCards.map((item) => {
      totalBetAmount += Number(item.bettingAmount);
      totalWinAmount += Number(item.oddValue) * Number(item.bettingAmount);
    });

    globalStore.toggleItem('sportsSingleBettingCards', bettingCards);
  };

  const removeBettingCard = (index) => {
    let bettingCards = [];

    if (bettingMode === 'single') {
      bettingCards = [...singleBettingCards];

      bettingCards.splice(index, 1);
      globalStore.toggleItem('sportsSingleBettingCards', bettingCards);
    } else {
      bettingCards = [...multipleBetttingCards];

      bettingCards.splice(index, 1);
      globalStore.toggleItem('sportsMultipleBettingCards', bettingCards);
    }
  };

  const removeAll = () => {
    if (bettingMode === 'single') {
      totalBetAmount = 0;
      globalStore.toggleItem('sportsSingleBettingCards', []);
    } else {
      multipleBetAmount = 0;
      globalStore.toggleItem('sportsMultipleBettingCards', []);
    }
  };

  const validateBettingCards = () => {
    if (bettingMode === 'single') {
      if (singleBettingCards.length === 0) return false;

      for (let i = 0; i < singleBettingCards.length; i++) {
        if (!singleBettingCards[i].bettingAmount || singleBettingCards[i].bettingAmount === 0) {
          return false;
        }
      }
    } else if (multipleBetttingCards.length === 0 || multipleBetAmount === 0) {
      return false;
    }

    return true;
  };

  const saveBettingCards = async () => {
    if (!validateBettingCards()) return;

    if ($globalStore.userDetail) {
      if (bettingMode === 'single') {
        const res = await SportsApi.addSingleBetting($globalStore.userDetail._id, singleBettingCards);

        if (res.data === 'success') {
          totalBetAmount = 0;
          globalStore.toggleItem('sportsSingleBettingCards', []);
        }
      } else if (bettingMode === 'multiple') {
        const res = await SportsApi.addMultipleBetting(
          $globalStore.userDetail._id,
          multipleBetttingCards,
          multipleBetAmount
        );

        if (res.data === 'success') {
          multipleBetAmount = 0;
          globalStore.toggleItem('sportsMultipleBettingCards', []);
        }
      }
    } else {
      signInWithGoogle();
    }
  };

  const switchBettingMode = async (mode) => {
    if (mode === 'single') {
      if (bettingTab === 'pending') {
        betSlipArr = [...singleBettingCards];
      } else {
        const myBets = await fetchBettingCards(mode);
        betSlipArr = myBets;
      }
    } else if (mode === 'multiple') {
      if (bettingTab === 'pending') {
        betSlipArr = [...multipleBetttingCards];
      } else {
        const myBets = await fetchBettingCards(mode);
        betSlipArr = myBets;
      }
    }

    globalStore.toggleItem('sportsbetSlipMode', mode);
  };

  const switchBettingTab = async (tab) => {
    if (tab === 'pending') {
      if (bettingMode === 'single') {
        betSlipArr = [...singleBettingCards];
      } else {
        betSlipArr = [...multipleBetttingCards];
      }
    } else if (tab === 'betted') {
      const myBets = await fetchBettingCards(bettingMode);
      betSlipArr = myBets;
    }

    bettingTab = tab;
  };

  const updateTotalValues = (data, mode) => {
    totalBetAmount = 0;
    totalWinAmount = 0;

    data.map((ele) => {
      totalBetAmount += ele.bettingAmount;

      if (mode === 'single') {
        totalWinAmount += Number(ele.bettingAmount) * Number(ele.bet[0].oddValue);
      } else {
        let totalOdd = 1;

        for (let i = 0; i < ele.bet.length; i++) {
          totalOdd *= Number(ele.bet[i].oddValue);
        }

        totalWinAmount += totalOdd * Number(ele.bettingAmount);
      }
    });
  };

  const fetchBettingCards = async (mode) => {
    isDataLoading = true;
    try {
      if ($globalStore.userDetail) {
        const res = await SportsApi.fetchBettingCardByType($globalStore.userDetail._id, mode);
        updateTotalValues(res.data, mode);

        return res.data;
      }
    } catch (err) {
      return [];
    }

    isDataLoading = false;
  };

  const updateBettingCards = () => {
    if (bettingTab === 'pending') {
      if (bettingMode === 'single') {
        betSlipArr = [...singleBettingCards];
      } else {
        betSlipArr = [...multipleBetttingCards];
      }
    }
  };

  $: if (multipleBetAmount) {
    let totalOddValue = 1;

    multipleBetttingCards.map((ele) => {
      totalOddValue *= Number(ele.oddValue);
    });

    multipleWinAmount = Number(multipleBetAmount) * totalOddValue;
  }

  $: if (singleBettingCards) {
    updateBettingCards();
  }

  onMount(() => {
    updateBettingCards();
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
  class="betslip-modal fixed md:right-[25px] bottom-[70px] md:bottom-[0px] w-full md:max-w-[340px] z-[999999996] md:z-[999999996] rounded-t-[12px] md:rounded-t-[7px] overflow-hidden"
>
  <div
    class="w-full flex flex-col bg-white dark:bg-blueDark h-auto max-h-[calc(100vh-70px)] md:max-h-[calc(100vh-115px)]"
  >
    <div class="sticky flex flex-col top-0 w-full">
      <div class="w-full flex items-center justify-between bg-linear px-[17px] py-[10px]">
        <div class="flex items-center gap-[4px]">
          <label class="cursor-pointer">
            <input checked={bettingTab === 'pending'} type="radio" name="betSlip" id="" class="sr-only peer" />
            <div
              on:click={() => {
                switchBettingTab('pending');
              }}
              class="px-[19px] py-[14px] text-sm md:text-base rounded-[7px] bg-transparent dark:text-white50 peer-checked:bg-white5 peer-checked:text-white"
            >
              Bet Slip
            </div>
          </label>
          <label class="cursor-pointer">
            <input checked={bettingTab === 'betted'} type="radio" name="betSlip" id="" class="sr-only peer" />
            <div
              on:click={() => {
                switchBettingTab('betted');
              }}
              class="px-[19px] py-[14px] text-sm md:text-base rounded-[7px] bg-transparent text-white50 peer-checked:bg-white5 peer-checked:text-white"
            >
              My Bets
            </div>
          </label>
        </div>

        <div
          on:click={closeBetSlip}
          class="cursor-pointer opacity-80 hover:opacity-100 transition-all w-[31px] h-[31px] rounded-full bg-white11 flex items-center justify-center"
        >
          <svg class="w-[16px] h-[16px]">
            <use class="fill-white" href="/imgs/icons/icons.svg#close" />
          </svg>
        </div>
      </div>
      <div class="w-full flex items-center justify-around">
        <div
          on:click={() => {
            switchBettingMode('single');
          }}
          class="relative cursor-pointer w-full flex items-center justify-center py-[15px] border-b border-b-grayLight dark:border-b-blueDark2"
        >
          <input checked={bettingMode === 'single'} type="radio" value="single" name="quantity" class="sr-only peer" />
          <p
            class="font-medium text-sm md:text-base text-black50 dark:text-white32 peer-checked:text-black dark:peer-checked:text-white"
          >
            Single
          </p>
          <img
            class="absolute bottom-0 w-full opacity-0 peer-checked:left-0 peer-checked:opacity-100 left-[100px] transition-all"
            src="/imgs/borderGradient.svg"
            alt=""
          />
        </div>
        <div
          on:click={() => {
            switchBettingMode('multiple');
          }}
          class="relative cursor-pointer w-full flex items-center justify-center py-[15px] border-b border-b-grayLight dark:border-b-blueDark2"
        >
          <input
            checked={bettingMode === 'multiple'}
            type="radio"
            value="multiple"
            name="quantity"
            class="sr-only peer"
          />
          <p
            class="font-medium text-sm md:text-base text-black50 dark:text-white32 peer-checked:text-black dark:peer-checked:text-white"
          >
            Multiples
          </p>
          <img
            class="absolute bottom-0 w-full opacity-0 peer-checked:right-0 peer-checked:opacity-100 right-[100px] transition-all"
            src="/imgs/borderGradient.svg"
            alt=""
          />
        </div>
      </div>
    </div>
    <div class="w-full flex flex-col py-1 overflow-auto custom-scrollbar">
      {#if bettingTab === 'betted'}
        {#each betSlipArr as betSlip}
          {#if bettingMode === 'single'}
            {#each betSlip.bet as item}
              <MyBetSlipCard 
                bettingMode={bettingMode} 
                bettingAmount={betSlip.bettingAmount} 
                item={item} 
              />
            {/each}
          {:else if bettingMode === 'multiple'}
            <MyMultipleBetSlipCard 
              bettingMode={bettingMode} 
              betSlip={betSlip} 
            />
          {/if}
        {/each}
      {:else}
        {#each betSlipArr as item, index}
          <BetSlipCard
            bettingMode={bettingMode}
            item={item}
            index={index}
            removeBettingCard={removeBettingCard}
            updateBettingAmount={updateBettingAmount}
          />
        {/each}
      {/if}
    </div>
    <div
      class="sticky flex flex-col bottom-0 w-full px-[19px] py-[15px] bg-grayLight2 dark:bg-white5 border-t border-grayLight dark:border-t-white11"
    >
      {#if bettingTab === 'pending' && bettingMode === 'multiple'}
        <div class="w-full grid grid-cols-2 gap-[16px] mb-2">
          <div
            class="w-full grid items-center grid-cols-[auto,50px] bg-grayLight4 dark:bg-white5 rounded-[7px] focus:bg-red"
          >
            <input
              bind:value={multipleBetAmount}
              type="text"
              name="betamount"
              class="w-full h-full bg-transparent py-[9px] outline-none text-black dark:text-white text-sm pl-[13px]"
            />
            <div class="pl-[13px] border-l border-l-grayDark text-black50 dark:text-grayDark">Bet</div>
          </div>
          <div
            class="w-full grid items-center grid-cols-[auto,50px] bg-grayLight4 dark:bg-white5 rounded-[7px] focus:bg-red"
          >
            <p
              class="w-full h-full bg-transparent py-[9px] outline-none text-black dark:text-white text-sm pl-[13px] overflow-hidden"
            >
              {multipleWinAmount.toFixed(2)}
            </p>
            <div class="pl-[13px] border-l border-l-grayDark text-black50 dark:text-grayDark">Win</div>
          </div>
        </div>
      {:else}
        <div class="w-full flex items-center justify-between">
          <div class="flex flex-col gap-[10px]">
            <p class="text-xs font-medium text-black50 dark:text-white50">Total Bet</p>
            <p class="text-base font-semibold text-black dark:text-white">Possible Win</p>
          </div>
          <div class="flex flex-col gap-[10px]">
            <p class="text-xs font-medium text-black50 dark:text-white50">
              {totalBetAmount} <span class="font-bold" />
            </p>
            <p class="text-base font-semibold text-black dark:text-white">
              {totalWinAmount.toFixed(2)} <span class="font-bold" />
            </p>
          </div>
        </div>
      {/if}
      {#if bettingTab === 'pending'}
        <button
          on:click={saveBettingCards}
          class="relative z-[99] w-full py-[12px] bg-linear rounded-[7px] mt-[17px] text-white font-medium opacity-80 hover:opacity-100 transition-all"
          >Place Bet</button
        >
        <div class="w-full flex justify-center mt-[15px]">
          <div class="flex items-center gap-[8px] cursor-pointer group opacity-70 hover:opacity-100 transition-all">
            <svg class="w-[18px] h-[18px]">
              <use class="stroke-red fill-transparent" href="/imgs/icons/icons.svg#trash" />
            </svg>
            <p on:click={removeAll} class="text-red font-medium text-sm">Remove All</p>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
