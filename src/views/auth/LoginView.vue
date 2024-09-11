<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const formState = reactive({
  email: "",
  password: "",
});
const onFinish = (values) => {
  console.log("Success:", values);
  router.push("/");
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
</script>

<template>
  <div class="w-screen min-h-screen flex justify-center items-center">
    <a-form
      :model="formState"
      name="basic"
      class="lg:w-[32%] md:w-[70%]"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
      layout="vertical"
    >
      <h1 class="text-3xl my-[60px] text-left">ARM Login</h1>
      <a-form-item
        label="Email"
        name="email"
        :rules="[{ required: true, message: 'Please input your email!' }]"
      >
        <a-input v-model:value="formState.email" />
      </a-form-item>

      <a-form-item
        label="Password"
        name="password"
        :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <a-input-password v-model:value="formState.password" />
      </a-form-item>
      <!-- 
      <a-form-item name="remember" class="flex justify-end">
        <a-checkbox class="self-end" v-model:checked="formState.remember"
          >Remember me</a-checkbox
        >
      </a-form-item> -->
      <div class="mb-[20px] flex justify-end">
        <RouterLink to="/register"> Don't have an account? Signup </RouterLink>
      </div>

      <a-form-item>
        <a-button type="primary" class="w-full h-[30px]" html-type="submit"
          >Submit</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>
