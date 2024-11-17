<script>
  export let className = '';
</script>

<div class={`${className} relative w-full rounded-[16px] bg-darkBlue p-6`}>
  <slot />
</div>
