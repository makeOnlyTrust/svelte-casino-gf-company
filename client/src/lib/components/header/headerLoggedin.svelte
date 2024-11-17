<script>
  import globalStore from '@store/globalStore';
  import Select from '@components/select/select.svelte';
  import { createEventDispatcher } from 'svelte';
  import { getWallet } from '@apis/account';
  import { updateBalance } from '@apis/casino';
  import { socket } from '$lib/utils/socketConnection';

  const dispatch = createEventDispatcher();

  $: chatOpen = $globalStore.chatOpen;

  const chatToggle = (e) => {
    chatOpen ? document.body.classList.remove('chat-active') : document.body.classList.add('chat-active');
    globalStore.toggleItem('chatOpen', !$globalStore.chatOpen);
  };

  const openProfileMenu = () => {
    dispatch('openProfileMenu');
  };

  const openNewDepositModal = () => {
    globalStore.toggleItem('newDepositModal', true);
  };

  const createLabel = (value, label, imageSrc) => {
    return `
			<div class="flex items-center w-full justify-between">

				<div class="flex items-center gap-2">
					<img class="w-full w-[30px] h-[30px] rounded-full" src="${imageSrc}" alt="${value}"/>
					<p class="font-medium text-base text-black dark:text-white uppercase">${value}</p>
				</div>
				<p class="font-medium text-base text-black dark:text-white">
					${label}
				</p>
			</div>
		`;
  };

  let isLoad = '',
    currencyList = [];

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
        label: `${item.wallets.currencies.currencySymbol} ${item.wallets.wallet.balance}`,
        labelSelected: `${item.wallets.currencies.currencySymbol} ${item.wallets.wallet.balance.toLocaleString()}`,
        _id: item.wallets.currencies._id
      };
    });
  };

  const onCurrencyChange = async (item) => {
    const res = await updateBalance($globalStore.userDetail._id, item.detail._id);
  };
</script>

<div class="flex items-center md:gap-[25px] lg:gap-[50px]">
  <!-- <div class="flex items-center gap-[23px]">
		<div
			class="hidden md:flex cursor-pointer flex items-center opacity-70 hover:opacity-100 transition-all"
		>
			<svg class="w-[24px] h-[24px]">
				<use class="dark:fill-white fill-black" href="/imgs/icons/icons.svg#bell" />
			</svg>
		</div>
	</div> -->
  <div class="flex items-center gap-[15px] lg:gap-[20px]">
    <div class="relative flex items-center">
      {#if currencyList.length > 0}
        <Select
          items={currencyList}
          searchable={false}
          customSearch={true}
          classname="!max-w-max min-w-[250px] h-[47px] !rounded-tr-[0px] !rounded-br-[0px] gap-0"
          textClassname="mt-1"
          listClassName="!min-w-max max-h-[200px] overflow-auto custom-scrollbar"
          on:handleChange={onCurrencyChange}
        />
      {/if}

      <div
        on:click={openNewDepositModal}
        class="cursor-pointer flex items-center justify-center px-3 h-[47px] bg-primary rounded-tr-[7px] rounded-br-[7px]"
      >
        <p class="text-white text-base">Wallet</p>
      </div>
    </div>

    <button
      on:click={chatToggle}
      class="hidden md:flex w-[49px] h-[44px] gradient-border rounded-[7px] before:rounded-[7px] bg-purpleLight2 dark:bg-blueDark items-center justify-center"
    >
      <img class="w-[24px]" src="/imgs/chatLinear.svg" alt="" />
    </button>

    <div on:click={openProfileMenu} id="headerProfile" class="flex items-center gap-[9px] cursor-pointer">
      <div class="relative w-[48px] h-[48px] rounded-full border border-grayLight dark:border-white50">
        <img
          class="absolute w-full h-full object-cover rounded-full"
          src={$globalStore.userDetail.profileImage}
          alt="profile image"
        />
      </div>

      <svg class="w-[20px] h-[20px] hidden lg:block">
        <use class="fill-black dark:fill-white" href="/imgs/icons/icons.svg#chevron-down" />
      </svg>
    </div>
  </div>
</div>
