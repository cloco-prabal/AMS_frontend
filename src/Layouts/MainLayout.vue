<script setup>
import { RouterView } from "vue-router";
import { ref } from "vue";
const onCollapse = (collapsed, type) => {
  console.log(collapsed, type);
};
const onBreakpoint = (broken) => {
  console.log(broken);
};
const selectedKeys = ref(["4"]);
</script>

<template>
  <a-layout class="min-h-screen">
    <a-layout-sider
      breakpoint="lg"
      collapsed-width="0"
      @collapse="onCollapse"
      @breakpoint="onBreakpoint"
    >
      <div
        class="bg-gray-500 w-[100%] h-[63px] mb-5 text-white flex justify-center items-center"
      >
        <p class="text-xl font-bold mt-4">Artist Management</p>
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="1">
          <RouterLink to="/" class="nav-text"> Artist</RouterLink>
        </a-menu-item>
        <a-menu-item key="2">
          <RouterLink to="/users" class="nav-text"> Users</RouterLink>
        </a-menu-item>
      </a-menu>
      <RouterLink to="/login" class="pt-1 font-semibold text-lg">
        <div
          class="my-10 text-center bg-white hover:bg-gray-200 h-10 w-[95%] mx-auto py-1"
        >
          Logout
        </div>
      </RouterLink>
    </a-layout-sider>
    <a-layout>
      <a-layout-header
        class="flex justify-end"
        :style="{ background: '#fff', padding: 0 }"
      >
        <div class="flex flex-row gap-5 mr-5 items-center">
          <p class="self-start">Howdy! User</p>
          <a-avatar :size="30">
            <template #icon><i class="pi pi-user"></i></template>
          </a-avatar>
        </div>
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px 0' }">
        <div :style="{ padding: '24px', background: '#fff', minHeight: '95%' }">
          <RouterView />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
#components-layout-demo-responsive .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

.site-layout-sub-header-background {
  background: #fff;
}

.site-layout-background {
  background: #fff;
}

[data-theme="dark"] .site-layout-sub-header-background {
  background: #141414;
}
</style>
