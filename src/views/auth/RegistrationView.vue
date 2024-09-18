<script setup>
import { reactive, ref, toRaw } from "vue";
import BackBtn from "@/components/BackBtn.vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { useMutation } from "@tanstack/vue-query";
import { addUser } from "@/api/Users";
import moment from "moment";

const formRef = ref();

const router = useRouter();

const formState = reactive({
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  dob: undefined,
  gender: undefined,
  address: "",
});

const { mutateAsync } = useMutation({
  mutationFn: (data) => addUser(data),
  onSuccess: () => {
    message.success("Registration successfull!");
    router.push("/login");
  },
  onError: (err) => {
    console.log(err);
    message.error("Failed to register!");
  },
});

const validatePass = async (_rule, value) => {
  if (value === "") {
    return Promise.reject("Please input the password");
  } else {
    if (formState.confirmPassword !== "") {
      formRef.value.validateFields("checkPass");
    }
    return Promise.resolve();
  }
};
const validatePass2 = async (_rule, value) => {
  if (value === "") {
    return Promise.reject("Please input the password again");
  } else if (value !== formState.password) {
    return Promise.reject("Two inputs don't match!");
  } else {
    return Promise.resolve();
  }
};
const rules = {
  first_name: [
    {
      required: true,
      message: "Please input first name",
      trigger: "change",
    },
    {
      min: 3,
      message: "Length should be greater than 2 characters",
      trigger: "blur",
    },
  ],
  last_name: [
    {
      required: true,
      message: "Please input last name",
      trigger: "change",
    },
    {
      min: 3,
      message: "Length should be greater than 2 characters",
      trigger: "blur",
    },
  ],
  phone: [
    {
      required: true,
      message: "Please input phone",
      trigger: "change",
    },
  ],
  address: [
    {
      required: true,
      message: "Please input address",
      trigger: "change",
    },
  ],
  password: [
    {
      required: true,
      validator: validatePass,
      trigger: "change",
    },
  ],
  confirmPassword: [
    {
      validator: validatePass2,
      trigger: "change",
    },
  ],
  email: [
    {
      required: true,
      message: "Please input email",
      trigger: "change",
    },
  ],
  dob: [
    {
      required: true,
      message: "Please pick a date",
      trigger: "change",
      type: "object",
    },
  ],
  gender: [
    {
      // type: "array",
      required: true,
      message: "Please select at least one gender ",
      trigger: "change",
    },
  ],
};
const onSubmit = () => {
  formRef.value
    .validate()
    .then(async () => {
      const formData = toRaw(formState);
      const dataToPost = {
        ...formData,
        dob: moment(formData?.dob).format("YYYY-MM-DD"),
        password_digest: formData?.password,
      };
      delete dataToPost.password;
      await mutateAsync(dataToPost);
      router.push("/login");
    })
    .catch((error) => {
      console.log("error", error);
    });
};
const resetForm = () => {
  formRef.value.resetFields();
};
</script>

<template>
  <div
    class="w-screen min-h-screen flex justify-center items-center -img bg-cover"
  >
    <a-form
      ref="formRef"
      :model="formState"
      class="lg:w-[38%] md:w-[70%] xsm:w-[90%]"
      :rules="rules"
      layout="vertical"
    >
      <div class="flex flex-row justify-between my-[60px]">
        <h1 class="text-2xl text-left text-black">ARM Registration</h1>
        <BackBtn />
      </div>

      <div class="flex flex-row gap-4">
        <a-form-item
          class="flex-1"
          ref="first_name"
          label="First name"
          required
          name="first_name"
        >
          <a-input v-model:value="formState.first_name" />
        </a-form-item>
        <a-form-item
          class="flex-1"
          ref="last_name"
          label="Last name"
          required
          name="last_name"
        >
          <a-input v-model:value="formState.last_name" />
        </a-form-item>
      </div>
      <div class="flex flex-row gap-4">
        <a-form-item
          class="flex-1"
          has-feedback
          label="Password"
          name="password"
        >
          <a-input
            v-model:value="formState.password"
            type="password"
            autocomplete="off"
          />
        </a-form-item>
        <a-form-item
          class="flex-1"
          has-feedback
          label="Confirm Password"
          name="confirmPassword"
        >
          <a-input
            v-model:value="formState.confirmPassword"
            type="password"
            autocomplete="off"
          />
        </a-form-item>
      </div>
      <div class="flex flex-row gap-4">
        <a-form-item
          class="flex-1"
          ref="email"
          label="Email"
          required
          name="email"
        >
          <a-input v-model:value="formState.email" />
        </a-form-item>
        <a-form-item
          class="flex-1"
          ref="phone"
          label="Phone"
          required
          name="phone"
        >
          <a-input v-model:value="formState.phone" />
        </a-form-item>
      </div>
      <a-form-item ref="address" label="Address" required name="address">
        <a-input v-model:value="formState.address" />
      </a-form-item>

      <div class="flex flex-row gap-4">
        <a-form-item class="flex-1" label="Gender" name="gender">
          <a-select
            v-model:value="formState.gender"
            placeholder="please select your gender"
          >
            <a-select-option value="m">Male</a-select-option>
            <a-select-option value="f">Female</a-select-option>
            <a-select-option value="o">Others</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item class="flex-1" label="DOB" required name="dob">
          <a-date-picker
            v-model:value="formState.dob"
            type="date"
            placeholder="Pick your DOB"
            style="width: 100%"
          />
        </a-form-item>
      </div>

      <a-form-item>
        <a-button type="primary" @click="onSubmit" class="w-full h-[30px]"
          >Register</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>
