<script>
  import { createEventDispatcher } from 'svelte';
  import ModalLayout from '../modalLayout.svelte';
  import FilterBtn from '../../filter/filterBtn.svelte';
  import FiatTabList from './fiatTabPaymentList.svelte';
  import CryptoTabContent from './cryptoTabContent.svelte';

  const dispathEvent = createEventDispatcher();

  const closeProfileModal = () => {
    dispathEvent('closeProfileModal');
  };

  const withdrawFilterTabs = [
    {
      label: 'Crypto',
      value: 'crypto'
    },
    {
      label: 'Fiat',
      value: 'fiat'
    }
  ];
  
  let activeTab = withdrawFilterTabs[0].value;
  const handleFilter = (activeValue) => {
    activeTab = activeValue;
    return activeValue;
  };

  let chooseWithdrawalMethod = false;
  const handleWithdrawMethod = (val) => {
    chooseWithdrawalMethod = false;
    return val;
  };
</script>

<ModalLayout on:closeProfileModal={closeProfileModal} title="Withdraw" id="newWithdrawModal">
  <div class="mt-4">
    <FilterBtn filters={withdrawFilterTabs} active={withdrawFilterTabs[0].value} onFilter={handleFilter} />
  </div>

  <div class="relative z-[99] w-full flex flex-col justify-between mt-[24px]">
    {#if activeTab === 'crypto'}
      <CryptoTabContent />
    {:else if activeTab === 'fiat'}
      <FiatTabList chooseWithdrawalMethod={chooseWithdrawalMethod} onWithdrawMethod={handleWithdrawMethod} />
    {/if}
  </div>
</ModalLayout>
