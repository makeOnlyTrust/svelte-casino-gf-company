<script>
  import globalStore from '@store/globalStore';
  import toast from '@components/toast/toast';
  import Timer from "../../timer/Timer.svelte"
  import Spinner from "../../../components/spinner/spinner.svelte"
  import {sendPhone, phoneCheck} from "../../../../apis/account"
  import PhoneInput from '../../phoneInput/phoneInput.svelte';
    
  let sendStatus = false
  let timerRef
  let authCode
  let name = ""
  let phone = ""
  const email = $globalStore.userDetail.email
  

  const sendAuth = async (phone) => {
    if(name === "") {
      toast.error("Please input your name.");
      return
    }

    if(phone === "") {
      toast.error("Please input your phone");
      return
    }

    globalStore.updateNestedProperty("spinner", true)
    const res = await sendPhone(phone)

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

  const codeCheck = async (timerRef, authCode, email, name, phone ) => {
    const res = await phoneCheck(authCode, email, name, phone)

    if (res.success == true) {
      toast.success(res.data.message)
      timerRef.stopTimer()
      globalStore.updateNestedProperty("userDetail.info.verify.phoneNumber", true)
    } else {
      toast.error(res.data.message);
    }
  }

  const onPhoneChange = (e) => {
    phone = e.detail.value;
  };
</script>

<div class="relative z-[1] w-full flex flex-col gap-[15px] max-w-[500px] mx-auto mt-4">
  <p class="text-base text-black dark:text-white font-medium">Name</p>
    <div class="w-full grid grid-cols-[auto,auto] items-center bg-grayLight4 dark:bg-white5 rounded-[7px] focus:bg-red {sendStatus ? `opacity-50` : ``} ">
      <input
        type="text"
        class="w-full h-full bg-transparent py-[17px] outline-none text-black21 dark:text-white50 pl-[20px] pr-[20px]"
        bind:value={name}
        disabled={sendStatus}
      />
    </div>
</div>

<div class="relative z-[99] w-full flex flex-col gap-[15px] max-w-[500px] mx-auto mt-4">
  <p class="text-base text-black dark:text-white font-medium">Phone Number</p>
  <div class="w-full grid grid-cols-[auto,auto] items-center bg-grayLight4 dark:bg-white5 rounded-[7px] focus:bg-red {sendStatus ? `opacity-50` : ``}">
    <PhoneInput
      options={{
        autoPlaceholder: true,
        spaces: true,
        invalidateOnCountryChange: false,
        format: 'national'
      }}
      bind:value={phone}
      on:phoneChange={onPhoneChange}
    />
    {#if !sendStatus}
      {#if $globalStore.spinner}
      <button class="w-[120px] {$globalStore.spinner ? ``: `py-4`}  bg-primary text-white rounded-[7px] ml-auto">
        <Spinner /> 
      </button>
        
      {:else}
      <button 
        class="w-[120px] {$globalStore.spinner ? ``: `py-4`}  bg-primary text-white rounded-[7px] ml-auto" 
        on:click={ async () =>{sendStatus = await sendAuth(phone)}}
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

<div class="relative z-[1] w-full flex flex-col gap-[15px] max-w-[500px] mx-auto mt-4">
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
        on:click={codeCheck(timerRef, authCode, email, name, phone)}>
        Verify
      </button>
    </div>
</div>

<!-- <button class="w-full py-4 bg-primary text-white rounded-[7px] mt-6 opacity-50"> Next Step </button> -->