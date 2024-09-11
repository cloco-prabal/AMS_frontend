<script>
import { RouterLink } from "vue-router";
</script>

<template>
  <div
    class="w-full min-h-screen flex flex-col gap-5 justify-center items-center"
  >
    <i class="pi pi-exclamation-triangle text-[100px] text-yellow-500"></i>

    <div class="text-center">
      <h1 class="text-3xl font-bold">404 page not found!</h1>
      <p>Sorry, the page does not exists.</p>
    </div>
    <RouterLink
      to="/"
      class="bg-blue-500 hover:bg-blue-600 text-white px-10 py-2 rounded-sm shadow-lg"
    >
      Go Back</RouterLink
    >
  </div>
</template>
