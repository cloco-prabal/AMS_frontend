<script setup>
const onBack = () => {
  window.history.back();
};
</script>

<template>
  <button
    @click="onBack"
    class="flex flex-row gap-2 bg-white px-6 rounded-sm max-w-[90px] justify-center items-center h-10 border-[2px] border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
  >
    <i class="pi pi-arrow-left"></i>
    <p class="font-semibold">Back</p>
  </button>
</template>
