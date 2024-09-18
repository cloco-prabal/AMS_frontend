<script setup>
import { reactive, ref, toRaw, watch } from "vue";
import BackBtn from "@/components/BackBtn.vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import moment from "moment";
import { getRoles } from "@/api/Roles";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { getUserById, updateUser } from "@/api/Users";

const formRef = ref();

const router = useRouter();
const route = useRoute();

const userId = ref(route.params.id);

const { data: user } = useQuery({
  queryKey: ["user", userId.value],
  queryFn: () => getUserById(userId.value),
});

const queryClient = useQueryClient();

const { mutateAsync } = useMutation({
  mutationFn: (data) => updateUser(userId.value, data),
  onSuccess: () => {
    queryClient.invalidateQueries(["users"]);
    router.push("/users");
    message.success("User updated successfully!");
  },
  onError: (err) => {
    console.log(err.message);
    message.error("Failed to update user!");
  },
});

const formState = reactive({
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  dob: null,
  gender: null,
  password: "",
  confirmPassword: "",
  address: "",
  role_id: null,
});

// Watch for changes in the `user` data and update the form state accordingly
watch(
  () => user.value,
  (newUser) => {
    if (newUser) {
      formState.first_name = newUser.first_name || "";
      formState.last_name = newUser.last_name || "";
      formState.email = newUser.email || "";
      formState.phone = newUser.phone || "";
      formState.dob = moment(newUser.dob) || null;
      formState.gender = newUser.gender || "m";
      formState.address = newUser.address || "";
      formState.role_id = newUser.role_id || null;
    }
  },
  { immediate: true } // Ensures that it runs immediately after `user` is fetched
);

const { data: rolesData } = useQuery({
  queryKey: ["roles"],
  queryFn: () => getRoles(),
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
      delete formData.confirmPassword;
      const finalFormData = {
        ...formData,
        dob: moment(formData.dob).format("YYYY-MM-DD"),
        password_digest: formData.password,
      };
      delete finalFormData.password;
      await mutateAsync(finalFormData);
      window.history.back();
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
  <div class="w-[100%] min-h-screen">
    <a-form
      ref="formRef"
      :model="formState"
      class="w-[100%] mx-auto"
      :rules="rules"
      layout="vertical"
    >
      <div class="flex w-full justify-end mb-5">
        <BackBtn />
      </div>
      <div class="flex flex-row justify-between my-5">
        <h1 class="text-xl text-left font-semibold">UPDATE USER</h1>
      </div>

      <a-form-item
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
      <a-form-item ref="address" label="Address" required name="address">
        <a-input v-model:value="formState.address" />
      </a-form-item>

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
      <a-form-item class="flex-1" label="Role" name="role_id" required>
        <a-select
          v-model:value="formState.role_id"
          placeholder="please select a role "
        >
          <a-select-option
            v-for="role in rolesData"
            :key="role.id"
            :value="role.id"
            class="capitalize"
          >
            {{ role.title }}
          </a-select-option>
          <!-- <a-select-option value="m">Male</a-select-option>
          <a-select-option value="f">Female</a-select-option>
          <a-select-option value="o">Others</a-select-option> -->
        </a-select>
      </a-form-item>

      <a-form-item>
        <a-button type="primary" @click="onSubmit" class="w-full h-[30px]"
          >UPDATE</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>
