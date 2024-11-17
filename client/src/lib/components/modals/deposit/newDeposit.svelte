<script>
    import { createEventDispatcher } from 'svelte';
    import Select from '../../select/select.svelte';
    import ModalLayout from '../modalLayout.svelte';
    import FilterBtn from '../../filter/filterBtn.svelte';
    import Withdraw from '../withdraw/withdraw.svelte';
    import FiatTabContent from './fiatTabContent.svelte';
    import CryptoTabContent from './cryptoTabContent.svelte';
    import globalStore from '@store/globalStore';
    import { getWallet } from '@apis/account';

    const dispathEvent = createEventDispatcher();

    const createLabel = (value, label, imageSrc) => {
        return `<div class="flex items-center w-full justify-between">

      <div class="flex items-center gap-2">
        <img class="w-full min-w-[30px] h-[30px] rounded-full" src="${ imageSrc }" alt="${ value }"/>
        <p class="font-medium text-base text-white uppercase">${ value }</p>
      </div>
      <p class="text-white font-medium text-base dark:text-white">
				${ label }
			</p>
    </div>`;
    };

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

    let chooseWithdrawalMethod = true;
    const handleWithdrawMethod = (val) => {
        chooseWithdrawalMethod = false;
        return val;
    };

    let isLoad = '',
        currencyList = [];

    $: {
        if ($globalStore.userDetail && $globalStore.userDetail != isLoad) {
            isLoad = $globalStore.userDetail;
            onGetCurrencyList();
        }
    }

    const onGetCurrencyList = async () => {
        const res = await getWallet();

        currencyList = res.data.wallet.map((item) => {
            return {
                value: item.wallets.currencies.currencySymbol,
                labelHTML: createLabel(item.wallets.currencies.currencySymbol, '', item.wallets.currencies.image),
                image: item.wallets.currencies.image,
                label: `${ item.wallets.currencies.currencySymbol }`,
                labelSelected: `${ item.wallets.currencies.currencySymbol } `,
                _id: item.wallets.currencies._id
            };
        });
    };
</script>

<ModalLayout on:closeProfileModal={closeProfileModal} title="Deposit" id="newDepositModal">
    <div class="mt-4">
        <FilterBtn filters={withdrawFilterTabs} active={withdrawFilterTabs[0].value} onFilter={handleFilter}/>
    </div>

    <div class="relative z-[99] w-full flex flex-col justify-between mt-[24px]">
        <!-- {#if activeTab === 'crypto'}
                <div class="w-full flex flex-col gap-[15px]">
                    <p class="text-base text-black dark:text-white font-medium">Deposit Currency</p>
                    {#if currencyList.length > 0}
                        <Select
                            items={currencyList}
                            searchable={false}
                            customSearch={true}
                            classname="gap-0"
                            textClassname="mt-1"
                            listClassName="max-h-[200px] overflow-auto custom-scrollbar"
                            type="list"
                        />
                    {/if}
                </div>
            {/if} -->
        {#if activeTab === 'crypto'}
            <CryptoTabContent/>
        {:else if activeTab === 'fiat'}
            <FiatTabContent chooseWithdrawalMethod={chooseWithdrawalMethod} onWithdrawMethod={handleWithdrawMethod}/>
        {/if}
    </div>
</ModalLayout>
