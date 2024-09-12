<script setup>
const onBack = () => {
  window.history.back();
};
</script>

<template>
  <button
    @click="onBack"
    class="flex flex-row gap-4 bg-white px-6 rounded-lg max-w-[90px] justify-center items-center text-black h-7 border-[2px] border-black hover:border-green-500 hover:text-green-500"
  >
    <i class="pi pi-arrow-left font-extrabold"></i>
    <p>Back</p>
  </button>
</template>
