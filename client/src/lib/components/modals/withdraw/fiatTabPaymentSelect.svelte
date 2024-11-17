<script>
    import Select from '../../select/select.svelte';
    import globalStore from '@store/globalStore';
    import { getWallet } from '@apis/account';
    import { getPaymentList } from "../../../../apis/payment"
    import { createEventDispatcher } from "svelte"
    import { getWithdrawalConditions } from "../../../../apis/withdrawal"

    const getCurrencyList = async () => {
        const res = await getWallet();
        let list = []
        res.data.wallet.map((item) => {
            if (item.wallets.currencies.type == 'fiat') {
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

        walletAmount = $globalStore.userDetail.wallets.wallet.find(v => v.currencyId === list[0]._id).balance
        withdrawalConditions = await getWithdrawalConditions($globalStore.userDetail._id, list[0]._id)
        paymentList = await getPaymentList(list[0].value)
        return list
    }

    const dispatch = createEventDispatcher()

    const selectPayment = (payment) => {
        dispatch("selectPayment", {
            "paymentData": payment,
            "withdrawalConditions": withdrawalConditions,
            "walletAmount": walletAmount,
            "type": "withdrawal"
        })
    }

    const currencyList = getCurrencyList()
    let paymentList = []
    let withdrawalConditions = {}
    let walletAmount = 0
</script>


{#await currencyList }
    ...
{:then list }
    <div class="w-full flex flex-col gap-[15px]">
        <p class="text-base text-black dark:text-white font-medium">Withdrawal Currency</p>
        <Select
                items={list}
                searchable={false}
                type="fiat"
                customSearch={true}
                classname="select-lg w-full h-[55px] gap-0"
                textClassname="mt-1"
                listClassName="max-h-[200px] overflow-auto custom-scrollbar"
        />
    </div>
{/await}

{#await paymentList }
    ...
{:then list }
    <p class="text-base text-black dark:text-white font-medium mt-4">Withdrawal From</p>
    {#each list as data, length }
        <button
                class="flex borderrounded-lg py-3 px-5 align-middle items-center justify-between bg-[#1d1f2b] shadow-xl rounded-lg"
                on:click={() => {selectPayment(list[length])}}
        >
            <div class="flex items-center">
                <img src="{data.logo}" alt="" class="max-h-[30px]">
                <span class="text-stone-50 ml-2">{data.name}</span>
            </div>
            <div>
                <img src="../imgs/bracket.svg" alt="">
            </div>
        </button>
    {/each}
{/await}

