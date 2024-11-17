<script>
    import Select from '../../select/select.svelte';
    import SelectNetwork from '../../select/selectNetwork.svelte';
    import { getNetwork, getAddress } from '../../../../apis/crypto';
    import { getWallet } from '@apis/account';

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

    let keyCopied = false;

    const copySecretKey = (address) => {
        navigator.clipboard.writeText(address);
        keyCopied = true;
        setTimeout(() => {
            keyCopied = false;
        }, 1000);
    };
</script>


{#await currencyList }
    ...
{:then list }
    <div class="w-full flex flex-col gap-[15px]">
        <p class="text-base text-black dark:text-white font-medium">Deposit Currency</p>
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
            <p class="text-base text-black dark:text-white font-medium">Choose Network</p>
            <SelectNetwork
                    items={list}
                    customSearch={false}
                    searchable={false}
                    listClassName="max-h-[200px] overflow-auto custom-scrollbar"
                    on:handleChange={selectNetwork}
            />
        </div>
    {/await}


    {#await userWalletData }
        ...
    {:then data }
        <div class="flex items-center gap-3">
            <div class="w-full max-w-[150px]">
                <!-- <canvas class="block" id="qr-canvas" /> -->
                {@html data.svg}
            </div>
            <div class="relative z-[99] w-full flex flex-col gap-[15px] max-w-[500px] mx-auto">
                <p class="text-base text-black dark:text-white font-medium">Your Deposit Address</p>
                <div
                        class="w-full grid grid-cols-[auto,50px] items-center bg-grayLight4 dark:bg-white5 rounded-[7px] focus:bg-red"
                >
                    <input
                            type="text"
                            disabled
                            value={data.address}
                            class="w-full h-full bg-transparent py-[17px] outline-none text-black21 dark:text-white50 pl-[20px] pr-[20px]"
                    />
                    {#if !keyCopied}
                        <svg on:click={() => copySecretKey(data.address)}
                             class="w-[22px] h-[22px] group cursor-pointer">
                            <use
                                    class="group-hover:fill-black dark:group-hover:fill-white fill-black21 dark:fill-white11 transition-all"
                                    href="/imgs/icons/icons.svg#copy"
                            />
                        </svg>
                    {:else}
                        <p class="absolute right-[20px] text-sm text-green font-medium">Copied</p>
                    {/if}
                </div>
            </div>
        </div>

    {/await}
    <div class="block p-4 border border-white5 bg-white5 rounded-[7px]">
        <p class="text-gray font-regular text-base">
            <span class="text-white">Note:</span> Send only
            <span class="text-amber-400"> {symbol}({network}) </span> to this address. Coins will be deposited after 2
            network confirmations.
        </p>
    </div>
</div>
