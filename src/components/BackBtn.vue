<script setup>
const onBack = () => {
  window.history.back();
};
</script>

<template>
  <button
    @click="onBack"
    class="flex flex-row bg-white px-6 rounded-md max-w-[70px] justify-center items-center text-black h-7 border-[1px] border-black hover:border-red-500 hover:text-red-500"
  >
    <i class="pi pi-arrow-left font-extrabold"></i>
  </button>
</template>
