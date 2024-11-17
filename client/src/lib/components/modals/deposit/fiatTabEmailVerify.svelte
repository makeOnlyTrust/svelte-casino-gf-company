<script>
  import globalStore from '@store/globalStore';
  import toast from '@components/toast/toast';
  import Spinner from "../../../components/spinner/spinner.svelte"
  import Timer from "../../../components/timer/Timer.svelte"
  import {sendEmail, emailCheck} from "../../../../apis/account"
  
  let sendStatus = false
  let timerRef
  let authCode
  const email = $globalStore.userDetail.email

  const sendAuth = async (email) => {
    globalStore.updateNestedProperty("spinner", true)
    const res = await sendEmail(email)

    if (res.success == true) {
      toast.success(res.data.message);
    } else {
      toast.error(res.data.message);
    }

    globalStore.updateNestedProperty("spinner", false)
    return true
  }

  const onTimerEnd = (event) => {
    if(event.detail.finished){
      sendStatus = false
    } 
  }

  const codeCheck = async (timerRef, authCode, email ) => {
    const res = await emailCheck(authCode, email)

    if (res.success == true) {
      toast.success(res.data.message)
      timerRef.stopTimer()
      globalStore.updateNestedProperty("userDetail.info.verify.email", true)
    } else {
      toast.error(res.data.message);
    }

  }
</script>
<div class="relative z-[99] w-full flex flex-col gap-[15px] max-w-[500px] mx-auto mt-4">
  <p class="text-base text-black dark:text-white font-medium">Email Address </p>
  <div class="w-full grid grid-cols-[auto,auto] items-center bg-grayLight4 dark:bg-white5 rounded-[7px] focus:bg-red {sendStatus ? `opacity-50` : ``}">
    <input
      type="email"
      value={email}
      class="w-full h-full bg-transparent py-[17px] outline-none text-black21 dark:text-white50 pl-[20px] pr-[20px]"
      readonly
    />
    {#if !sendStatus}

      {#if $globalStore.spinner}
      <button class="w-[120px] {$globalStore.spinner ? ``: `py-4`}  bg-primary text-white rounded-[7px] ml-auto">
        <Spinner /> 
      </button>
        
      {:else}
      <button 
        class="w-[120px] {$globalStore.spinner ? ``: `py-4`}  bg-primary text-white rounded-[7px] ml-auto" 
        on:click={ async () =>{sendStatus = await sendAuth(email)}}
      >
        Send
      </button>
      {/if}

    {:else}
    <button disabled={true} class="w-[120px] py-4 bg-primary text-white rounded-[7px] ml-auto opacity-50">
      <Timer bind:this={timerRef} m={10} s={0} on:timerEnd={onTimerEnd}/>
    </button>
    {/if}
  </div>
</div>

<div class="relative z-[99] w-full flex flex-col gap-[15px] max-w-[500px] mx-auto mt-4">
  <p class="text-base text-black dark:text-white font-medium">Enter Code</p>
    <div class="w-full grid grid-cols-[auto,auto] items-center bg-grayLight4 dark:bg-white5 rounded-[7px] focus:bg-red {!sendStatus ? `opacity-50` : ``} ">
      <input
        type="text"
        maxlength="5"
        disabled={!sendStatus}
        class="w-full h-full bg-transparent py-[17px] outline-none text-black21 dark:text-white50 pl-[20px] pr-[20px]"
        bind:value={authCode}
      />
      <button 
        class="w-full py-4 bg-primary text-white rounded-[7px] ml-auto {!sendStatus ? `opacity-50`: ``}" disabled={!sendStatus}
        on:click={codeCheck(timerRef, authCode, email)}>
        Verify
      </button>
    </div>
</div>

<!-- <button class="w-full py-4 bg-primary text-white rounded-[7px] mt-6 opacity-50"> Next Step </button> -->