<script>
  import {deposit} from "../../../../apis/paymentGate"
  import {createDepositTransaction} from "../../../../apis/deposit"
  import globalStore from '@store/globalStore';
  import {createEventDispatcher} from "svelte"
  import toast from '@components/toast/toast';
  import {krBankList} from "../../../utils/bankList"

  export let paymentData

  const dispatch = createEventDispatcher()

  const selectPayment = (payment) => {
    dispatch("selectPayment", {
      "paymentData": payment,
      "type": "select" 
    })
  }

  const depositProcess = async (payment, name, amount, amountMin) => {
    if(amount == "" || amount == null) {
      toast.error("Please enter the amount.");
      return
    }
    if(amount < amountMin) {
      toast.error("Please enter the minimum amount.");
      return
    }
    
    const orderNumber = `${Date.now()}`
    await deposit(payment, name, amount, orderNumber)

    return orderNumber
  }


  if (!window.messageListenerAdded) {
    window.addEventListener('message', async (event) => {
      const info = event.data.data
      
      if (event.data && event.data.code === "0000" && event.data.message === "complete") {
        toast.success("Deposit request successful");        
        const paymentMethodId = paymentData._id
        const currencyId = paymentData.currencyId
        const customerId = $globalStore.userDetail._id
        const adminId = $globalStore.userDetail.adminId
        const agentId = $globalStore.userDetail.info.agentId
        const bank = krBankList.find(v => v.value === info.bank).name
        const accountNumber = info.account
        const name = info.clientNm
        
        await createDepositTransaction({adminId, agentId, customerId, paymentMethodId, orderNumber, amount, bank, accountNumber, name, currencyId})

        dispatch("selectPayment", {
          "paymentData": paymentData,
          "type": "request",
          "info": info
        })
      }
    }, false);
    window.messageListenerAdded = true;
  }
  
  let amount 
  let bonus = 0
  let orderNumber

  $: if(amount > paymentData.deposit.max) {
    amount = paymentData.deposit.max
  }
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

{#each paymentData.depositForm as data }
  {#if data.label === "Amount"}
  
  <div class="relative z-[99] w-full flex flex-col gap-[5px] max-w-[500px] mx-auto mt-5">
      <div class="text-base text-black dark:text-white font-medium">
        <span> {data.label} </span>
        <span class="float-right">{paymentData.deposit.min.toLocaleString()} ~ {paymentData.deposit.max.toLocaleString()}</span>
      </div>
    <div
      class="w-full grid grid-cols-[1fr,auto] items-center bg-grayLight4 dark:bg-white5 rounded-[7px] focus:bg-red"
    >
      <input
        type="number"
        placeholder="Min {paymentData.deposit.min.toLocaleString()}"
        class="w-full h-full bg-transparent py-[17px] outline-none text-black dark:text-white pl-[20px]"
        bind:value={amount}
      />
      <p class="border-l px-5 border-white11 text-gray">{paymentData.symbol}</p>
    </div>
  </div>
  
  <div class="w-full flex bg-white5 flex-col gap-5 rounded-[17px] border-2 border-white11 border-dashed p-4 mt-2">
    <div class="w-full justify-between flex items-center justify-center">
      <p class="text-gray text-sm">Amount:</p>
      <p class="text-white text-sm"> 
        {#if !amount}
          {0} {paymentData.symbol} 
        {:else}
          {amount.toLocaleString()} {paymentData.symbol} 
        {/if}

      </p>
    </div>
    <div class="w-full justify-between flex items-center justify-center">
      <p class="text-gray text-sm">Bonus:</p>
      <p class="text-white text-sm"> 
        {#if !bonus}
          {0} {paymentData.symbol} 
        {:else}
          {bonus.toLocaleString()} {paymentData.symbol} 
        {/if}
      </p>
    </div>
    <div class="w-full justify-between flex items-center justify-center">
      <p class="text-gray text-sm">Total Game money:</p>
      <p class="text-white text-sm">
        {#if !(amount+bonus) }
          {0}
        {:else}
          {(amount+bonus).toLocaleString()} 
        {/if}

      {paymentData.symbol}</p>
    </div>
  </div>
  {/if}  

  {/each}<button class="w-full py-4 bg-primary text-white rounded-[7px] mt-auto" on:click={ async () => {orderNumber = await depositProcess(paymentData.name, $globalStore.userDetail.info.name, amount, paymentData.deposit.min)}}>Deposit Now</button>
