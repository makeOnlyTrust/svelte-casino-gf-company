<script>
    import BreadCrumb from '$lib/components/breadCrumb/breadCrumb.svelte';
    import globalStore from '@store/globalStore';

    $: chatOpen = $globalStore.chatOpen;
    import PromotionModal from '../../../lib/components/modals/promotion/promotionModal.svelte';
    import { getPromotionList, getPromotionCloseList } from "@apis/promotion.js";
    import { onMount } from "svelte";
    import toast from "@components/toast/toast.js";

    $: activeRoutePath = 'all'

    const casinoTabs = [
        {
            title: 'All',
            href: 'all'
        },
        {
            title: 'Past Promotions',
            href: 'close'
        }
    ];

    const breadCrumbPages = [
        {
            name: 'promotions',
            route: '/promotions'
        }
    ];
    let detailItem = {};
    const openPromotionModal = (item) => {
        detailItem=item;
        globalStore.toggleItem('promotionModal', true);
    };

    let promotionList = [];
    onMount(async () => {
        const _data = await getPromotionList();
        if (_data?.success) {
            promotionList = _data.data;
        } else {
            promotionList = [];
            toast.error(_data.data.message);
        }
    })
    const mutateList = async () => {
        switch (activeRoutePath) {
            case 'all':
                const _data = await getPromotionList();
                if (_data?.success) {
                    promotionList = _data.data;
                } else {
                    promotionList = [];
                    toast.error(_data.data.message);
                }
                break;
            case 'close':
                const __data = await getPromotionCloseList();
                if (__data?.success) {
                    promotionList = __data.data;
                } else {
                    promotionList = [];
                    toast.error(__data.data.message);
                }
                break;
            default:
                break;
        }
    }
</script>

<main class="w-full py-[27px] pl-[15px] pr-[15px] md:pl-[30px] md:pr-[30px]" id="main">
    <div class="container-main">
        <div class="pl-[15px] pr-[15px] md:pl-[0px] md:pr-[0px] mt-[15px]">
            <BreadCrumb pages={breadCrumbPages}/>
        </div>

        <h6 class="font-semibold text-2xl gradient-text-white2 main mt-8">Promotions</h6>

        <div
                class="select-none flex sm:flex-wrap items-center gap-[15px] mt-[15px] dragable overflow-auto scrollbar-hidden"
        >
            {#each casinoTabs as tab}
                <a
                        href="#"
                        on:click={async ()=>{
                            activeRoutePath = tab.href;
                            await mutateList();
                        }}
                        class={`${activeRoutePath === tab.href ? 'bg-linear active-p-white' : ''} group items-center gap-[8px] p-[12px] min-w-max bg-black5 dark:bg-white5 border border-black5 dark:border-white11 rounded-[7px] cursor-pointer hover:bg-linear`}
                >
                    <p
                            class="{activeRoutePath === tab.href
              ? '!text-white'
              : ''} group-hover:text-white text-black dark:text-gray text-xs sm:text-sm font-normal"
                    >
                        {tab.title}
                    </p>
                </a>
            {/each}
        </div>

<!--        <div class="w-full grid {chatOpen ? 'grid-cols-3 md:grid-cols-2' : 'grid-cols-4 md:grid-cols-2'} gap-3 mt-6">-->
        <div class="w-full grid grid-cols-2 xs:grid-cols-3 msm:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 mt-6">
            {#each promotionList as item}
                <a on:click={()=>openPromotionModal(item)} href="#"
                   class="w-full p-[8px] flex flex-col gap-[15px] bg-white5 border border-white-11 rounded-[7px]">
                    <img src={item.thumbnail} class="w-full rounded-[7px]" alt=""/>
                    <p class="text-xs font-medium text-gray px-1">{item.startAt} - {item.endAt}</p>
                    <h6 class="text-md font-semibold text-white px-1">{item.title}</h6>
                </a>
            {/each}
        </div>
    </div>
</main>


{#if $globalStore.promotionModal}
    <PromotionModal item={detailItem}/>
{/if}

