<script>
    import { createEventDispatcher } from 'svelte';
    export let paymentData
    
    const dispatch = createEventDispatcher();
    
    const selectPayment = () => {
        dispatch("selectPayment", undefined)
    }
</script>


<div>
    <div class="w-full flex flex-col gap-[15px]">
        <p class="text-base text-black dark:text-white font-medium">Choose a Payment Method</p>
        <div class="border-white rounded-lg h-full py-3 px-4 bg-[#27273a] shadow-lg cursor-pointer" on:click={() => {selectPayment()}}>
            <div class="flex justify-between">
                <div class="flex gap-2 items-center">
                    <img src="{paymentData.logo}" alt="{paymentData.name}" class="max-h-8">
                    <span class="text-base text-stone-100">{paymentData.name}</span>
                </div>
                
                <span class="flex align-middle justify-center">
                    <div class="mr-6">
                        <div class="text-xs text-stone-100">Min: {paymentData.deposit.min.toLocaleString()}</div>
                        <div class="text-xs text-stone-100">Max: {paymentData.deposit.max.toLocaleString()}</div>
                    </div>

                    <img src="../imgs/bracket.svg" alt="">
                </span>
            </div>
        </div>
    </div>
    
    {#each paymentData.depositForm as data }
        {#if data.type === "number"}

        <div class="relative z-[99] w-full flex flex-col gap-[15px] max-w-[500px] mx-auto mt-4">
            <div>
                <span class="text-base text-black dark:text-white font-medium"> {data.label}  </span>
                <span class="text-sm dark:text-white float-right"> Balance:  </span>
            </div>

            <div class="w-full grid grid-cols-[auto,auto] items-center bg-grayLight4 dark:bg-white5 rounded-[7px] focus:bg-red">
            <input
                type="{data.type}"
                class="w-full h-full bg-transparent py-[17px] outline-none text-black21 dark:text-white50 pl-[20px] pr-[20px]"
            />
            </div>
        </div>
        {/if}
        
        {#if data.type === "text"}
            <div class="relative z-[99] w-full flex flex-col gap-[15px] max-w-[500px] mx-auto mt-4">
                <p class="text-base text-black dark:text-white font-medium"> {data.label}</p>
                <div class="w-full grid grid-cols-[auto,auto] items-center bg-grayLight4 dark:bg-white5 rounded-[7px] focus:bg-red">
                <input
                    type="{data.type}"
                    class="w-full h-full bg-transparent py-[17px] outline-none text-black21 dark:text-white50 pl-[20px] pr-[20px]"
                />
                </div>
            </div>
        {/if}
    {/each}
</div>
