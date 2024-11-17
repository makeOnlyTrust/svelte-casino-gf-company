<script>
    import Select from '../../select/select.svelte';
    import SelectNetwork from '../../select/selectNetwork.svelte';
    import { getNetwork, getAddress } from '../../../../apis/crypto';
    import globalStore from '@store/globalStore';
    import ProgressBar from '../../progress/progressBar.svelte';
    import { getWallet } from '@apis/account';
    import { getWithdrawalConditions } from "../../../../apis/withdrawal"

    const getCurrencyList = async () => {
        const res = await getWallet();
        let list = []
        res.data.wallet.map((item) => {
            if (item.wallets.currencies.type == 'crypto') {
                list = [
                    ...list,
                    {
                        value: item.wallets.currencies.currencySymbol,
                        labelHTML: `<div class="flex items-center w-full justify-between">
                          <div class="flex items-center gap-2">
                            <img src="${ item.wallets.currencies.image }" class="w-5 h-5" alt="${ item.wallets.currencies.currencySymbol }"/>
                            <p class="font-medium text-base text-white uppercase">${ item.wallets.currencies.currencySymbol }</p>
                          </div>
                          <p class="text-white font-medium text-base dark:text-white">
                            <span class="text-grayLight">Balance:</span>
                            ${ item.wallets.wallet.balance.toLocaleString() }
                          </p>
                        </div>`,
                        image: item.wallets.currencies.image,
                        label: `${ item.wallets.currencies.currencySymbol } ${ item.wallets.wallet.balance.toLocaleString() }`,
                        labelSelected: `${ item.wallets.currencies.currencySymbol } ${ item.wallets.wallet.balance.toLocaleString() }`,
                        _id: item.wallets.currencies._id
                    }
                ];
            }
        });

        withdrawalConditions = await getWithdrawalConditions($globalStore.userDetail._id, list[0]._id)

        walletAmount = $globalStore.userDetail.wallets.wallet.find(v => v.currencyId === list[0]._id).balance
        symbol = list[0].value
        networkList = getNetworkList(list[0].value)
        return list
    }

    const getNetworkList = async (symbol) => {
        const res = await getNetwork(symbol);

        let list = []
        res.data.map((item) => {
            list = [
                ...list,
                {
                    value: item,
                    label: item,
                }
            ];
        });

        network = list[0].value
        userWalletData = getCryptoAddress(list[0].value)
        return list
    }

    const getCryptoAddress = async (network) => {
        const res = await getAddress(network)
        return res.data
    }


    const selectCurrency = async (item) => {
        symbol = item.detail.value.toUpperCase()
        networkList = await getNetworkList(symbol)
        walletAmount = $globalStore.userDetail.wallets.wallet.find(v => v.currencyId === item.detail._id).balance
        withdrawalConditions = await getWithdrawalConditions($globalStore.userDetail._id, item.detail._id)
    }

    const selectNetwork = async (item) => {
        network = item.detail.value
        userWalletData = await getCryptoAddress(network)
    }

    const currencyList = getCurrencyList()
    let networkList = [ { value: "", label: "" } ]
    let userWalletData = { address: "", svg: "" }
    let symbol
    let network
    let walletAmount = 0
    let withdrawalAmount
    let withdrawalConditions = {}

    $: if (withdrawalAmount > walletAmount) {
        withdrawalAmount = walletAmount
    }

</script>


{#await currencyList }
    ...
{:then list }
    <div class="w-full flex flex-col gap-[15px]">
        <p class="text-base text-black dark:text-white font-medium">Withdrawal Currency </p>
        <Select
                items={list}
                searchable={false}
                type="crypto"
                customSearch={true}
                classname="select-lg w-full h-[55px] gap-0"
                textClassname="mt-1"
                listClassName="max-h-[200px] overflow-auto custom-scrollbar"
                on:handleChange={selectCurrency}
        />
    </div>
{/await}

<div class="flex flex-col gap-7">
    {#await networkList }
        ...
    {:then list }
        <div class="w-full flex flex-col gap-[15px] mt-[24px]">
            <div class="flex justify-between">
                <p class="text-base text-black dark:text-white font-medium">Choose Network</p>
            </div>
            <SelectNetwork
                    items={list}
                    customSearch={false}
                    searchable={false}
                    listClassName="max-h-[200px] overflow-auto custom-scrollbar"
                    on:handleChange={selectNetwork}
            />
        </div>
    {/await}


    <div class="relative z-[99] w-full flex flex-col gap-[15px] max-w-[500px] mx-auto">
        <div class="flex justify-between">
            <p class="text-base text-black dark:text-white font-medium">Withdrawal Address (Only {symbol})</p>
        </div>
        <div class="w-full grid items-center bg-grayLight4 dark:bg-white5 rounded-[7px] focus:bg-red">
            <input
                    type="text"
                    placeholder=""
                    class="w-full h-full bg-transparent py-[17px] outline-none text-black dark:text-white pl-[20px]"
            />
        </div>
    </div>

    <div class="relative z-[99] w-full flex flex-col gap-[15px] max-w-[500px] mx-auto">
        <div class="flex justify-between">
            <p class="text-base text-black dark:text-white font-medium">Withdraw Amount</p>
            <p class="text-sm text-black dark:text-white font-medium ">Available
                Balance: {walletAmount.toLocaleString()} {symbol} </p>
        </div>
        <div class="w-full grid items-center bg-grayLight4 dark:bg-white5 rounded-[7px] focus:bg-red">
            <input
                    type="number"
                    placeholder=""
                    class="w-full h-full bg-transparent py-[17px] outline-none text-black dark:text-white pl-[20px]"
                    bind:value={withdrawalAmount}
            />
        </div>
    </div>


    <ProgressBar percent={withdrawalConditions.percentage} required={withdrawalConditions.requiredAdditionalBetting}
                 symbol={symbol}/>
    <div class="w-full flex bg-white5 flex-col gap-5 rounded-[17px] border-2 border-white11 border-dashed p-4">
        <!-- <div class="w-full justify-between flex items-center justify-center">
          <p class="text-gray text-sm">Available:</p>
          <p class="text-white text-sm">

          </p>
        </div> -->
        <!-- <div class="w-full justify-between flex items-center justify-center">
          <p class="text-gray text-sm">Fee:</p>
          <p class="text-primary text-sm">5%</p>
        </div> -->
        <div class="w-full justify-between flex items-center justify-center">
            <p class="text-gray text-sm">Total withdrawal amount:</p>
            <p class="text-white text-sm">
                {#if withdrawalAmount}
                    {withdrawalAmount.toLocaleString('ko-KR', { maximumFractionDigits: 10 })}
                {:else}
                    {0}
                {/if}

                {symbol}</p>
        </div>
    </div>


    <button class="w-full py-4 bg-primary text-white rounded-[7px] mt-auto">Withdraw Now</button>
</div>
