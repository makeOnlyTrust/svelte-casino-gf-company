<script>
    import Select from '../../select/select.svelte';
    import { createEventDispatcher } from 'svelte';
    export let currencyList, selectCurrency, paymentList
    
    const dispatch = createEventDispatcher();

    const selectPayment = (data) => {
        dispatch("selectPayment", data)
    }
</script>


<div>
    {#await currencyList }
        ...
    {:then list }
        <div class="w-full flex flex-col gap-[15px] ">
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

    <div class="w-full flex flex-col gap-[15px] mt-[15px]">
        <p class="text-base text-black dark:text-white font-medium">Deposit From</p>

        {#await paymentList }
            ...
        {:then list }
            {#each list as data, index }
                <div class="border-white rounded-lg h-full py-3 px-4 bg-[#27273a] shadow-lg cursor-pointer" on:click={() => {selectPayment(list[index])}}>
                    <div class="flex justify-between">
                        <div class="flex gap-2 items-center">
                            <img src="{data.logo}" alt="" class="max-h-8">
                            <span class="text-base text-stone-100">{data.name}</span>
                        </div>
                        <span class="flex align-middle justify-center"><img src="../imgs/bracket.svg" alt=""></span>
                    </div>
                </div>
            {/each}
        {/await}
    </div>  
</div>