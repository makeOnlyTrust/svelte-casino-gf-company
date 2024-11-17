<script>
  import ModalLayout from '../modalLayout.svelte';
  export let item;
  console.log(item);
</script>

<ModalLayout title="Promotion" id="promotionModal" className="!min-h-max !max-w-[582px]">
  <div class="relative z-[99] w-full flex flex-col gap-[15px] mt-[10px]">
    <div class="w-full h-[163px]">
      <img src={item.thumbnail} class="h-full mx-auto object-cover" alt="" />
    </div>
    <p class="text-xs font-medium text-gray px-1">{item.startAt} - {item.endAt}</p>
    {@html item.html}
  </div>
</ModalLayout>
