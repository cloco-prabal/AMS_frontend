<script setup>
const onBack = () => {
  window.history.back();
};
</script>

<template>
  <button
    @click="onBack"
    class="flex flex-row gap-2 bg-white px-6 rounded-sm max-w-[90px] justify-center items-center h-10 border-[2px] border-green-400 text-green-400 hover:border-green-600 hover:text-green-600"
  >
    <i class="pi pi-arrow-left"></i>
    <p class="font-semibold">Back</p>
  </button>
</template>
