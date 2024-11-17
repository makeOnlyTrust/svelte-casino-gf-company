<script>

    import FiatTabPaymentSelect from './fiatTabPaymentSelect.svelte';
    import FiatTabPaymentWithdrawal from "./fiatTapWithdrawal.svelte"
    import FiatTapPaymentRequest from './fiatTapPaymentRequest.svelte';


    const selectPayment = (event) => {
      paymentData = event.detail.paymentData
      type = event.detail.type
      info = event.detail.info
      withdrawalConditions = event.detail.withdrawalConditions
      walletAmount = event.detail.walletAmount
    }

    let paymentData
    let type = "select"
    let info
    let withdrawalConditions
    let walletAmount
</script>
 


{#if type === "select"}
<FiatTabPaymentSelect 
  on:selectPayment={selectPayment}
/>
{:else if type === "withdrawal"}
<FiatTabPaymentWithdrawal 
  paymentData={paymentData}
  withdrawalConditions={withdrawalConditions}
  walletAmount={walletAmount}
  on:selectPayment={selectPayment}
/>
{:else if type === "request"}
<FiatTapPaymentRequest 
  paymentData={paymentData}
  info={info}
  on:selectPayment={selectPayment}
/>
{/if}



  