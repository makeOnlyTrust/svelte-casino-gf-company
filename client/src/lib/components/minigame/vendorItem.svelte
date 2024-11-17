<script>
    export let item;
</script>
<a
        href="/minigame/vendors/{item.replaceAll(' ', '-')}"
        class="slider-main border-b-4 border-b-transparent px-2 group flex bg-white dark:bg-white5 relative w-full rounded-[20px] items-center gap-2 py-[18px] overflow-hidden hover:border-b-blue transition-all cursor-pointer"
>
    <p
            class="text-sm text-grayDark2 mt-1 text-center w-full font-semibold text-ellipsis overflow-hidden whitespace-nowrap"
    >
        {item}
    </p>
</a>
