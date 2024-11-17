<script>
    import FiatTabEmailVerify from './fiatTabEmailVerify.svelte';
    import FiatTabPhoneVerify from './fiatTabPhoneVerify.svelte';

    export let verify
</script>


<div class="w-full rounded-[7px] bg-white5 p-5 flex flex-col gap-5">
  <p class="text-base text-black dark:text-white font-medium">Verification</p>
  <div class="relative flex flex-col gap-[52px]">
    <div class="border-l border-dashed absolute h-[calc(100%-60px)] top-[50%] translate-y-[-50%] left-[9.5px] w-[1px] border-white11"/>
    <div class="flex items-centeer gap-3 z-[9] {verify.email ? `opacity-50` : ``}">

        <div class="mt-[1px] w-[21px] h-[21px] rounded-full flex items-center justify-center {verify.email ? `bg-green` : `bg-red`}  ">
          {#if !verify.email}
          <svg class="w-[10px] h-[10px] mt-[1px] ">
            <use class="dark:fill-white fill-black" href="/imgs/icons/icons.svg#close" />
          </svg>
          {:else}
          <svg class="w-[10px] h-[10px] mt-[1px]">
            <use class="dark:fill-white fill-black" href="/imgs/icons/icons.svg#check" />
          </svg>
          {/if}
        </div>

      <p class="text-white font-medium  {verify.email ? `opacity-50` : ``} ">
        Step 1: <span class="text-white">Email Verification</span>
      </p>
    </div>
    <div class="flex items-centeer gap-3 z-[9]">
      <div class="mt-[1px] w-[21px] h-[21px] rounded-full flex items-center justify-center {!verify.email ? `bg-gray opacity-50`: `bg-red`} ">
        <svg class="w-[10px] h-[10px] mt-[1px]">
          <use class="dark:fill-white fill-black" href="/imgs/icons/icons.svg#close" />
        </svg>
      </div>
      <p class="text-white font-medium {!verify.email ? `opacity-50` : ``}">
        Step 2: <span class="text-white">Phone Verification</span>
      </p>
    </div>
  </div>
</div>



{#if !verify.email}
  <FiatTabEmailVerify />
{:else if !verify.phoneNumber}
  <FiatTabPhoneVerify />
{/if}