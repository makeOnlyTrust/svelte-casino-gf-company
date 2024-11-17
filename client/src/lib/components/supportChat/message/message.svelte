<script>
  import { fade } from 'svelte/transition';
  import calert from 'calerts';
  export let username = '',
    message = '',
    image = '',
    role = '',
    time = '',
    isSelf,
    imageName = '';

  const handleModal = async () => {
    const res = await calert({
      image: {
        src: image,
        alt: 'sent image by user'
      },
      confirmButton: 'Download',
      cancelButton: 'Cancel'
    });
    if (res.isConfirmed) {
      calert.utils.tag('a', { href: image, download: imageName || 'image.png' }).click();
    }
  };
</script>

<div in:fade class={`rounded-lg max-w-full mb-2`}>
  <div class={`flex items-center  ${isSelf ? 'justify-start flex-row-reverse' : 'flex-row'}`}>
    <div
      style="word-break:break-word;"
      class={`${
        isSelf ? 'bg-[#7E2CFF] rounded-br-none' : 'bg-[#FFFFFF1A] rounded-bl-none'
      } relative mr-3 text-sm py-4 px-4 shadow rounded-xl max-w-full`}
    >
      <!-- <div class="flex">
				<span class="font-bold text-blue-600 mr-2">{username}</span>
				<span class="text-blue-500 mr-2">{time}</span>
			</div> -->
      <div class="text-white">{@html message}</div>
      {#if image}
        <img
          src={image}
          on:click={handleModal}
          class="max-w-full max-h-60 cursor-pointer"
          alt={`sent by ${username}`}
        />
      {/if}
    </div>
  </div>
</div>
