<script>
    import globalStore from '@store/globalStore';
    import {createEventDispatcher} from "svelte"
    import toast from '@components/toast/toast';
    import {krBankList} from "../../../utils/bankList"
    import ProgressBar from '../../progress/progressBar.svelte';
    import SelectBank from "../../select/selectBank.svelte";
    import {withdrawal} from "../../../../apis/paymentGate"
    import {createWithdrawalTransaction} from "../../../../apis/withdrawal"

    export let paymentData
    export let withdrawalConditions = {}
    export let walletAmount = 0

    const dispatch = createEventDispatcher()
  
    const selectPayment = async (payment) => {

      dispatch("selectPayment", {
        "paymentData": payment,
        "type": "select",
      })
    }
  
    const withdrawalProcess = async (payment, bankCode, accountNumber, name, amount, amountMin) => {
      if(!bankCode) {
        toast.error("Please select a bank.");
        return
      }

      if(!accountNumber || accountNumber === "") {
        toast.error("Please enter the Account Number");
        return
      }

      if(bankCode === "select") {
        toast.error("Please select a bank.");
        return
      }

      if(amount == "" || amount == null) {
        toast.error("Please enter the amount.");
        return
      }

      if(amount < amountMin) {
        toast.error("Please enter the minimum amount.");
        return
      }
    
      const orderNumber = `${Date.now()}`
      const paymentMethodId = paymentData._id
      const customerId = $globalStore.userDetail._id
      const adminId = $globalStore.userDetail.adminId
      const agentId = $globalStore.userDetail.info.agentId
      const bank = krBankList.find(v => v.value === bankCode).name

      await withdrawal(payment, orderNumber, bankCode, accountNumber, name, amount)
      await createWithdrawalTransaction({adminId, agentId, customerId, paymentMethodId, orderNumber, amount, bank, accountNumber, name, currencyId})
      
      const info = {
        key: orderNumber,
        bank: bankCode,
        account: accountNumber,
        clientNm: name,
        amount: amount
      }
      
      dispatch("selectPayment", {
        "paymentData": paymentData,
        "type": "request",
        "info": info
      })
    }
  
    const selectBank = (event) => {
      bankCode = event.detail.value
    } 
  
    let amount 
    let bonus = 0
    let bankCode = null
    let accountNumber
    let max = paymentData.withdrawal.max
  
    $: if(amount > max) {
      amount = max
    }
    $: if(amount > walletAmount) {
      amount = walletAmount
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
        <div>Min: {paymentData.withdrawal.min.toLocaleString()}</div>
        <div>Max: {paymentData.withdrawal.max.toLocaleString()}</div>
      </div>
      <img src="../imgs/bracket.svg" alt="">
    </div>
  </button>
  
  {#each paymentData.withdrawalForm as data }

    {#if data.label === "Bank"}
      <div class="flex justify-between mt-4">
        <p class="text-base text-black dark:text-white font-medium">{data.label}</p>
      </div>
      <SelectBank
        class="!flex !gap-[8px] !py-[5px] !pl-[15px] lang-select custom-select max !max-w-full !rounded-[7px] !w-full !gap-[17px] !bg-white5 !backdrop-blur-[8px] !border-[1.5px] !border-grayLight dark:!border-white11 !pl-[10px]"
        items={data.list}
        clearable={false}
        label="label"
        showChevron
        searchable={false}
        on:handleChange={selectBank}
      >
        <div slot="prepend">
          <img class="min-w-[34px]" src="/imgs/global.svg" alt="" />
        </div>
        <div slot="item" let:item>{item.label}</div>
      </SelectBank>
    {/if}
    {#if data.label === "Account Number"}
      <div class="relative z-[99] w-full flex flex-col max-w-[500px] mx-auto">
        <div class="flex justify-between mt-4">
          <p class="text-base text-black dark:text-white font-medium">{data.label}</p>
        </div>
        <div class="w-full grid items-center bg-grayLight4 dark:bg-white5 rounded-[7px] focus:bg-red">
          <input
            type="text"
            placeholder=""
            class="w-full h-full bg-transparent py-[17px] outline-none text-black dark:text-white pl-[20px]"
            bind:value={accountNumber}
          />
        </div>
      </div>
    {/if}

    {#if data.label === "Amount"}
    
    <div class="relative z-[99] w-full flex flex-col gap-[5px] max-w-[500px] mx-auto mt-5 mb-3">
      <div class="flex justify-between">
        <p class="text-base text-black dark:text-white font-medium">Withdraw Amount</p>
        <p class="text-sm text-black dark:text-white font-medium ">Available Balance: {walletAmount.toLocaleString()} {paymentData.symbol} </p>
      </div>
      <div
        class="w-full grid grid-cols-[1fr,auto] items-center bg-grayLight4 dark:bg-white5 rounded-[7px] focus:bg-red"
      >
        <input
          type="number"
          placeholder="Min {paymentData.withdrawal.min.toLocaleString()}"
          class="w-full h-full bg-transparent py-[17px] outline-none text-black dark:text-white pl-[20px]"
          bind:value={amount}
        />
        <p class="border-l px-5 border-white11 text-gray">{paymentData.symbol}</p>
      </div>
    </div>

    <ProgressBar 
      percent={withdrawalConditions.percentage} 
      required={withdrawalConditions.requiredAdditionalBetting} 
      symbol={paymentData.symbol}
    />

    <div class="w-full flex bg-white5 flex-col gap-5 rounded-[17px] border-2 border-white11 border-dashed p-4 my-5">
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
  
  {/each}
  <button 
    class="w-full py-4 bg-primary text-white rounded-[7px] mt-auto" 
    on:click={ async () => {await withdrawalProcess(paymentData.name, bankCode, accountNumber, $globalStore.userDetail.info.name, amount, paymentData.withdrawal.min, paymentData.currencyId)}}
    disabled="{!withdrawalConditions.condition}"  
  >
    {#if withdrawalConditions.condition }
      Withdrawal Now
    {:else}
      More betting is needed.
    {/if}
  </button>
  