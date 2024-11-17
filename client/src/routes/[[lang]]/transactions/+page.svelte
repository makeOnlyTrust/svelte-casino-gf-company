<script>
  import {getTransactions} from "../../../apis/deposit"
  import globalStore from '@store/globalStore';
  import { formatIsoDateToCustomFormat, capitalizeFirstLetter } from "../../../../src/lib/utils/common"
  import { LL} from '@src/i18n/i18n-svelte';

  const tabs = [
    {
      title: 'Deposit',
      image: '/imgs/live-sports/ball.svg'
    },
    {
      title: 'Withdrawal',
      image: '/imgs/live-sports/headphone.svg'
    }
  ];


  const handleFilter = (title) => {
    return title.toLowerCase();
  };

  const getTransactionsByType = async (type, customerIdx) => {
    if(type === "deposit") {
      const data = await getTransactions(customerIdx)
      maxPage = Math.ceil(data?.length/limitMax)
      return data
    }
    
  }

  const pageHandler = (type) => {
      if(type === "previous") {
        if(currentPage !== 1) --currentPage 
      }

      if(type === "next") {
        if(currentPage < maxPage) ++currentPage 
      }
  }

  let currentTab = 'deposit';
  let transactionsData

  $: if(currentTab == "deposit") {
    transactionsData = getTransactionsByType(currentTab, $globalStore.userDetail._id)
  }

  let currentPage = 1
  let limitMax = 10
  let maxPage
  
  let sliceStart
  let sliceEnd
  $: {
    sliceStart = (currentPage-1)*limitMax
    sliceEnd = currentPage*limitMax
  }
  

</script>

<main class="w-full py-[27px] pl-[15px] pr-[15px] md:pl-[30px] md:pr-[30px]" id="main">
  <div class="container-main">
    <div class="flex items-center justify-between mb-[35px]">
      <h6 class="text-mxl gradient-text-white2 main font-semibold">Transactions</h6>
    </div>
    <div class="w-full">
      <div class="md:flex-wrap dragable overflow-auto scrollbar-hidden w-full flex items-center gap-[15px]">
        {#each tabs as tab}
          <div
            on:click={() => currentTab = handleFilter(tab.title)}
            class={`${currentTab.toLowerCase() === tab.title.toLowerCase() ? 'bg-linear active-p-white' : ''} ${
              tab.hide ? 'hidden sm:flex' : 'flex'
            } min-w-max group items-center gap-[8px] pl-[12px] pr-[8px] py-[9px] bg-black5 dark:bg-white5 border border-black5 dark:border-white11 rounded-[7px] cursor-pointer hover:bg-linear`}
          >
            <p class="translate-y-[1px] group-hover:text-white text-black dark:text-white text-xs sm:text-sm font-normal">{tab.title}</p>
            <svg class="w-[16px] h-[16px] rotate-[180deg]">
              <use class="fill-black dark:fill-white" href="/imgs/icons/icons.svg#chevron-left" />
            </svg>
          </div>
        {/each}
      </div>

      <div class="relative w-full mt-[25px]">
        <div class="w-full grid grid-cols-5 gap-[15px] bg-white dark:bg-white5 rounded-t-[14px] px-[28px] py-[20px] border-b border-grayLight3 dark:border-white11">
          <p class="text-sm md:text-base font-medium text-black dark:text-white">{$LL.TYPE()}</p>
          <p class="text-sm md:text-base font-medium text-black dark:text-white">{$LL.MERRCHANT_ID()}</p>
          <p class="text-sm md:text-base font-medium text-black dark:text-white">{$LL.AMOUNT()}</p>
          <p class="text-sm md:text-base font-medium text-black dark:text-white">{$LL.TIME()}</p>
          <p class="text-sm md:text-base font-medium text-black dark:text-white">{$LL.STATUS()}</p>
        </div>
        <div class="w-full flex flex-col">
          {#await transactionsData }
            ...
          {:then list }

            {#each list.slice(sliceStart, sliceEnd) as data }
              <!-- Success -->
              <div class="w-full grid grid-cols-5 gap-[15px] bg-transparent px-[28px] py-[15px] border-b border-grayLight3 dark:border-white11 hover:bg-grayLight2 dark:hover:bg-white11">
                <p class="flex items-center text-sm md:text-base text-grayDark font-medium">{currentTab.replace(/\b[a-z]/g, char => char.toUpperCase())}</p>
                <p class="flex items-center text-sm md:text-base text-black dark:text-white font-medium ">{data.paymentMethodId.name}</p>
                <div class="flex items-center gap-[4px]">
                  <p class="text-sm md:text-base text-black dark:text-white font-medium">{data.amount.toLocaleString()}</p>
                  <img class="w-[24px] rounded-full" src="{data.paymentMethodId.currencyId.image}" />
                </div>
                <p class="flex items-center text-sm md:text-base text-grayDark font-medium">{formatIsoDateToCustomFormat(data.requestsAt)}</p>
                <div class="flex items-center px-[10px] py-[7px] gap-[6px] max-w-max rounded-full bg-white dark:bg-white5">
                  
                  {#if data.status === "success"}
                  <div class="w-[10px] h-[10px] bg-green rounded-full" />
                  {:else if data.status === "cancel"}
                  <div class="w-[10px] h-[10px] bg-red rounded-full" />
                  {:else if data.status === "pending"}
                  <div class="w-[10px] h-[10px] bg-orange-400 rounded-full" />
                  {/if}


                  <p class="text-sm md:text-base text-black dark:text-white font-medium">{capitalizeFirstLetter(data.status)}</p>
                </div>
              </div>
            {/each}

          {/await}
        

        </div>
      </div>
    </div>
    
    <div class="flex justify-end items-center gap-4 mt-5">
      <div>
        <span class="text-slate-400">Showing results</span> 
        <span class="text-white">{currentPage} to {maxPage}</span>
      </div>
      <button 
        class="w-full py-3 bg-slate-800 text-slate-400 rounded-[7px] mt-auto max-w-[7rem]" 
        on:click={()=> {pageHandler("previous")}}
      >
      Previous
      </button>
      <button 
        class="w-full py-3 bg-primary text-white rounded-[7px] mt-auto max-w-[10rem]" 
        on:click={()=> {pageHandler("next")}}
      >
      Next
      </button>
    </div>
  </div>
</main>