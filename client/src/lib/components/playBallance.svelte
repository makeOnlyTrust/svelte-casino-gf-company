<script>
    import Select from './select/select.svelte';
    import globalStore from '@store/globalStore';
    import { getWallet } from '@apis/account';
    import { createEventDispatcher } from "svelte"
    import { updateBalance } from '@apis/casino';
    import { socket } from '$lib/utils/socketConnection';

    const dispatchEvent = createEventDispatcher();

    const createLabel = (value, label, imageSrc) => {
        return `<div class="flex items-center w-full justify-between">
      <div class="flex items-center gap-2">
        <img class="w-full h-[30px] rounded-full" src="${ imageSrc }" alt="${ value }"/>
        <p class="font-medium text-base text-white uppercase">${ value }</p>
      </div>
      <p class="text-white font-medium text-base dark:text-white">
				${ label }
			</p>
    </div>`;
    };

    let isLoad = '',
        currencyList = [],
        currencyId = '';

    $: {
        if ($globalStore.userDetail && $globalStore.userDetail != isLoad) {
            isLoad = $globalStore.userDetail;
            onGetCurrencyList();
        }
    }

    socket.on('gf-wallet-change', async (data) => {
        try {
            if (data && $globalStore.userDetail) {
                await onGetCurrencyList();
            }
        } catch (error) {
            console.log(error);
        }
    });

    const onGetCurrencyList = async () => {
        const res = await getWallet();

        currencyList = res.data.wallet.map((item) => {
            return {
                value: item.wallets.currencies.currencySymbol,
                labelHTML: createLabel(
                    item.wallets.currencies.currencySymbol,
                    item.wallets.wallet.balance.toLocaleString(),
                    item.wallets.currencies.image
                ),
                image: item.wallets.currencies.image,
                label: `${ item.wallets.currencies.currencySymbol } ${ item.wallets.wallet.balance }`,
                labelSelected: `${ item.wallets.currencies.currencySymbol } ${ item.wallets.wallet.balance.toLocaleString() }`,
                _id: item.wallets.currencies._id
            };
        });

        if (currencyList.length > 0) currencyId = currencyList[0]._id;
    };

    const onPlay = () => {
        dispatchEvent('play');
    };

    const onCurrencyChange = async (item) => {
        currencyId = item.detail._id;
        await updateBalance($globalStore.userDetail._id, currencyId);
    };
</script>

<div class="w-full h-full flex overflow-auto absolute top-[55%] translate-y-[-50%]">
    <div
            id="modalInner"
            class="relative w-full h-full overflow-auto md:h-auto md:max-w-[460px] m-auto rounded-[14px] rounded-tl-[14px] bg-white dark:bg-black md:overflow-hidden"
    >
        <img src="/imgs/elipse.svg" class="dark:flex hidden radialImg absolute top-0 right-[0] z-[1]" alt=""/>
        <div class="h-full w-full py-[24px]">
            <div class="h-full flex flex-col w-full">
                <div class="w-full flex justify-between px-[26px]">
                    <div class="flex items-center gap-[15px]">
                        <p class="text-xl font-semibold gradient-text-white2 main">Play with ballance in</p>
                    </div>
                </div>
                <div class="relative z-[9999] flex flex-col h-full w-full px-[26px] mt-6">
                    {#if currencyList.length > 0}
                        <Select
                                items={currencyList}
                                searchable={false}
                                customSearch={true}
                                classname="gap-0"
                                on:handleChange={onCurrencyChange}
                                listClassName="max-h-[200px] overflow-auto custom-scrollbar"
                        />
                    {/if}
                    <p class="mt-4 font-medium text-gray">
                        The selected currency will be displayed in KRW, and if you change currency while playing, the
                        game will
                        refresh and restart.
                    </p>

                    <button
                            on:click={onPlay}
                            class="mt-16 flex items-center justify-center px-3 h-[52px] bg-primary px-6 rounded-[7px]"
                    >
                        <p class="text-white text-base">Play Game</p>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
