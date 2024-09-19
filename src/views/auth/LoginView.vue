<script setup>
import { login } from "@/api/Auth";
import { useMutation } from "@tanstack/vue-query";
import { message } from "ant-design-vue";
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const formState = reactive({
  email: "",
  password: "",
});

const { mutateAsync } = useMutation({
  mutationFn: (data) => login(data),
  onSuccess: (values) => {
    message.success("Login successfull!");
    if (values.user.artist_id) {
      router.push(
        `/musics/${values.user.artist_id}?name=${
          values.user.first_name + " " + values.user.last_name
        }`
      );
    } else {
      router.push("/");
    }
  },
  onError: (err) => {
    console.log(err);
    message.error(err.message || "Failed to login!");
  },
});

const onFinish = async (values) => {
  const response = await mutateAsync(values);
  localStorage.setItem("token", response.token);
  localStorage.setItem("user", JSON.stringify(response.user));
  localStorage.setItem("role", JSON.stringify(response.role));
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
</script>

<template>
  <div class="w-screen min-h-screen flex justify-center items-center bg-cover">
    <a-form
      :model="formState"
      name="basic"
      class="lg:w-[32%] md:w-[70%] xsm:w-[90%]"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
      layout="vertical"
    >
      <h1 class="text-3xl my-[60px] text-left text-black">ARM Login</h1>
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
      <div class="mb-[20px] flex justify-end text-black font-semibold">
        Don't have an account?
        <span class="ml-2 underline text-green-400 hover:text-green-500">
          <RouterLink to="/register">Signup</RouterLink></span
        >
      </div>

      <a-form-item>
        <a-button type="primary" class="w-full h-[30px]" html-type="submit"
          >Login</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>
