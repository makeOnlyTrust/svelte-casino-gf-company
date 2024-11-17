<script>
    import {createEventDispatcher} from "svelte"
    import {krBankList} from "../../../utils/bankList"

    export let paymentData, info
  
    const dispatch = createEventDispatcher()
    const selectPayment = (payment) => {
      dispatch("selectPayment", {
        "paymentData": payment,
        "type": "select" 
      })
    }
    
    const depositAgain = async (payment) => {
      dispatch("selectPayment", {
        "paymentData": payment,
        "type": "deposit" 
      })
    }

    const bank = krBankList.find(v => v.value === info.bank).name
  
  </script>
   
  <p class="text-base text-black dark:text-white font-medium">Choose a Payment Method</p>
  
  <button 
    class="flex borderrounded-lg py-3 px-5 align-middle items-center justify-between bg-[#1d1f2b] shadow-xl rounded-lg"
    on:click={() => {selectPayment(paymentData)}}
  >
    <div class="flex items-center">
      <img src="{paymentData.logo}" alt="" class="max-h-[30px]">
      <span class="text-stone-50 ml-2">{paymentData.name}</span>
    </div>
  
    <div class="flex">
      <div class="text-left text-sm mr-4 text-stone-300">
        <div>Min: {paymentData.deposit.min.toLocaleString()}</div>
        <div>Max: {paymentData.deposit.max.toLocaleString()}</div>
      </div>
      <img src="../imgs/bracket.svg" alt="">
    </div>
  </button>
  
    

    <div class="w-full flex bg-white5 flex-col gap-5 rounded-[17px] border-2 border-white11 border-dashed p-4 mt-2">

      <div class="w-full justify-between flex items-center justify-center">
        <p class="text-gray text-sm">Order Number:</p>
        <p class="text-yellow text-sm"> 
            {info.key} 
        </p>
      </div>

      <div class="w-full justify-between flex items-center justify-center">
        <p class="text-gray text-sm">Name:</p>
        <p class="text-stone-300 text-sm"> 
            {info.clientNm} 
        </p>
      </div>

      <div class="w-full justify-between flex items-center justify-center">
        <p class="text-gray text-sm">Deposit Account:</p>
        <p class="text-stone-300 text-sm"> 
            {bank} {info.account} 
        </p>
      </div>

      <div class="w-full justify-between flex items-center justify-center">
        <p class="text-gray text-sm">Amount:</p>
        <p class="text-stone-300 text-sm"> 
          {#if !info.amount}
            {0} {paymentData.symbol} 
          {:else}
            {Number(info.amount).toLocaleString()} {paymentData.symbol} 
          {/if}
        </p>
      </div>

      <div class="w-full justify-between flex items-center justify-center">
        <p class="text-gray text-sm">Bonus:</p>
        <p class="text-stone-300 text-sm"> 
            {Number(0).toLocaleString()} {paymentData.symbol} 
        </p>
      </div>
  
      <div class="w-full justify-between flex items-center justify-center">
        <p class="text-gray text-sm">Total Game money:</p>
        <p class="text-stone-300 text-sm">
          {#if !(info.amount) }
            {0}
          {:else}
            {(Number(info.amount)).toLocaleString()} 
          {/if}
  
        {paymentData.symbol}</p>
      </div>
    </div>

  <button class="w-full py-4 bg-primary text-white rounded-[7px] mt-auto" on:click={depositAgain(paymentData)}>Deposit Again</button>
  