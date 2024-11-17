<script>
  import globalStore from '@store/globalStore';
  import FiatTabVerify from './fiatTabVerify.svelte';
  import FiatTabPaymentList from './fiatTabPaymentList.svelte';

  let verify
  
  globalStore.subscribe((v) => {
    verify = v.userDetail.info.verify
  })
</script>

<div class="relative w-full z-[9] flex flex-col gap-2 mt-4">
  {#if !verify.phoneNumber}
    <FiatTabVerify verify={verify}/>
  {:else}
    <FiatTabPaymentList />
  {/if}
</div>
