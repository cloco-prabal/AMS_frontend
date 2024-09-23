<script setup>
import { RouterView, useRouter } from "vue-router";
import { ref } from "vue";
import { useQueryClient } from "@tanstack/vue-query";
import { permissionsByRoleName } from "@/utils/permissionsByRoleName";

const permissions = ref(permissionsByRoleName());

const hitBreakpoint = ref(false);

const onCollapse = (collapsed, type) => {};
const onBreakpoint = (broken) => {
  hitBreakpoint.value = broken;
};
const selectedKeys = ref(["1"]);

const router = useRouter();

const queryClient = useQueryClient();

const onClick = () => {
  localStorage.clear();
  queryClient.invalidateQueries();
  queryClient.resetQueries();
  router.push("/login");
};

const user = ref(
  JSON.parse(localStorage?.getItem("user") ? localStorage.getItem("user") : "")
    ?.first_name +
    " " +
    JSON.parse(localStorage.getItem("user") ? localStorage.getItem("user") : "")
      ?.last_name
);

const role = ref(
  JSON.parse(localStorage.getItem("role") ? localStorage.getItem("role") : "")
    ?.title
);
</script>

<template>
  <a-layout class="min-h-screen">
    <a-layout-sider
      breakpoint="lg"
      collapsed-width="0"
      :class="[
        hitBreakpoint ? '!absolute !top-0 !bottom-0 !z-[999] min-h-screen' : '',
      ]"
      @collapse="onCollapse"
      @breakpoint="onBreakpoint"
    >
      <div
        class="bg-gray-500 w-[100%] h-[63px] mb-5 text-white flex justify-center items-center"
      >
        <p class="text-xl font-bold">Artist Management</p>
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item v-if="permissions?.artist?.list" key="1">
          <RouterLink to="/" class="nav-text"> Artists</RouterLink>
        </a-menu-item>
        <a-menu-item v-if="permissions?.user?.list" key="2">
          <RouterLink to="/users" class="nav-text"> Users</RouterLink>
        </a-menu-item>
      </a-menu>

      <button
        @click="onClick"
        class="text-center bg-white hover:bg-gray-200 h-10 w-[95%] mx-auto rounded-lg font-semibold text-md mt-10 flex flex-row gap-5 justify-center items-center"
      >
        <p>Logout</p>
        <i class="pi pi-sign-out"></i>
      </button>
    </a-layout-sider>
    <a-layout>
      <a-layout-header
        class="flex justify-end md:flex-row gap-10 xsm:flex-col"
        :style="{ background: '#fff', padding: 0 }"
      >
        <div class="flex flex-row gap-5 items-center">
          <p class="self-start capitalize">Howdy! {{ user }}</p>
          <a-avatar :size="30">
            <template #icon><i class="pi pi-user"></i></template>
          </a-avatar>
        </div>
        <p class="mr-10">
          Role: <span class="uppercase"> {{ role }}</span>
        </p>
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
