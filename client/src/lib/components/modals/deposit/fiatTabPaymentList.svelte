<script>

    import FiatTabPaymentSelect from './fiatTabPaymentSelect.svelte';
    import FiatTabPaymentDeposit from "./fiatTabPaymentDeposit.svelte"
    import FiatTabPaymentRequest from "./fiatTapPaymentRequest.svelte"

    const selectPayment = (event) => {
      paymentData = event.detail.paymentData
      type = event.detail.type
      info = event.detail.info
    }

    let paymentData
    let type = "select"
    let info

</script>
 


{#if type === "select"}
<FiatTabPaymentSelect 
  on:selectPayment={selectPayment}
/>
{:else if type === "deposit"}
<FiatTabPaymentDeposit 
  paymentData={paymentData}
  on:selectPayment={selectPayment}
/>
{:else if type === "request"}
<FiatTabPaymentRequest 
  paymentData={paymentData}
  info={info}
  on:selectPayment={selectPayment}
/>
{/if}



  