<script>
  import Message from './message.svelte';
  export let messages;
  export let messagesElement;
</script>

<section
  class="w-full max-h-full overflow-auto scrollbar-hidden"
  style="position: absolute;bottom: 0; margin-bottom: 120px; left:0; width: calc(100% - 30px);"
  bind:this={messagesElement}
>
  {#each messages as message}
    <Message message={message} />
  {/each}
</section>
