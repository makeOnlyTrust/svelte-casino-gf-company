<script>
  import { createEventDispatcher } from 'svelte';
  import ModalLayout from './modalLayout.svelte';
  import { agentCodeAdd } from '@apis/account';
  import globalStore from '@store/globalStore';
  import toast from '@components/toast/toast';
  import { signIn, getAccessToken, getRefreshToken, signupSocial } from '@apis/account';

  let agentCode = '';

  const addAgentSubmit = async () => {
    if ($globalStore.userDetail) {
      let res = await agentCodeAdd({
        email: $globalStore.userDetail.email,
        agentCode
      });
      if (res.success) {
        toast.success(res.data.message);
        handleTokens();
        globalStore.toggleItem('addAgentModal', false);
      } else {
        toast.error(res.data.message);
      }
    } else {
      toast.error('Please login');
    }
  };
  const handleTokens = async () => {
    const res = await getAccessToken();
    if (res.success) {
      globalStore.toggleItem('userDetail', res.data);
    } else if (res.data.code == 4001) {
      const res1 = await getRefreshToken();
      if (res1.success) {
        const res2 = await getAccessToken();
        if (res2.success) globalStore.toggleItem('userDetail', res2.data);
      } else {
        globalStore.toggleItem('userDetail', null);
      }
    } else {
      globalStore.toggleItem('userDetail', null);
    }
  };
</script>

<ModalLayout title="Add Agent Code" id="addAgentModal" className="!min-h-max">
  <p class="mt-10 font-medium text-gray">Please register your agent code! Your agent can make many gifts for you.</p>
  <div class="relative z-[99] w-full flex flex-col gap-[15px] mt-[10px]">
    <div class="relative z-[99] w-full flex flex-col gap-[15px] mt-[24px]">
      <p class="text-base text-black dark:text-white font-medium">Enter Code</p>
      <div class="w-full grid items-center bg-grayLight4 dark:bg-white5 rounded-[7px] focus:bg-red">
        <input
          type="text"
          bind:value={agentCode}
          placeholder="Please enter the agent's code."
          class="w-full h-full bg-transparent border border-white5 rounded-[7px] py-[17px] outline-none text-black dark:text-white pl-[20px] pr-[120px] sm:pr-[110px]"
        />
        <div
          class="absolute right-0 cursor-pointer flex items-center justify-center px-3 h-[52px] bg-primary px-6 rounded-[7px]"
        >
          <p on:click={addAgentSubmit} class="text-white text-base">Submit</p>
        </div>
      </div>
    </div>
  </div>
</ModalLayout>
