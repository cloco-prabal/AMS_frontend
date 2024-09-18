<script setup>
import { reactive, ref, toRaw } from "vue";
import BackBtn from "@/components/BackBtn.vue";
import { message } from "ant-design-vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import moment from "moment";
import { addArtist } from "@/api/Artists";
import { useRouter } from "vue-router";

const formRef = ref();
const queryClient = useQueryClient();

const router = useRouter();

const { mutateAsync } = useMutation({
  mutationFn: (data) => addArtist(data),
  onSuccess: () => {
    queryClient.invalidateQueries(["artists"]);
    router.push("/");
    message.success("New artist has been added");
  },
  onError: () => {
    message.error("Failed to add artist");
  },
});

const formState = reactive({
  name: "",
  dob: undefined,
  gender: undefined,
  address: "",
  first_release_year: "",
  no_of_albums_released: "",
});

const rules = {
  name: [
    {
      required: true,
      message: "Please input name",
      trigger: "change",
    },
    {
      min: 3,
      message: "Length should be greater than 2 characters",
      trigger: "blur",
    },
  ],

  address: [
    {
      required: true,
      message: "Please input address",
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

      const finalFormData = {
        ...formData,
        dob: moment(formData.dob).format("YYYY-MM-DD"),
      };

      await mutateAsync(finalFormData);
      // message.success("New Artist Added!");
      // window.history.back();
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
        <h1 class="text-xl text-left font-semibold">ADD A NEW ARTIST</h1>
      </div>

      <a-form-item ref="name" label="Name" required name="name">
        <a-input v-model:value="formState.name" />
      </a-form-item>

      <a-form-item class="flex-1" label="Gender" name="gender">
        <a-select
          class="w-full"
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
          class="w-full"
          v-model:value="formState.dob"
          type="date"
          placeholder="Pick your DOB"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item ref="address" label="Address" required name="address">
        <a-input v-model:value="formState.address" />
      </a-form-item>

      <div class="flex flex-row gap-5">
        <a-form-item
          ref="first_release_year"
          label="First Release Year"
          required
          name="first_release_year"
          class="flex-1"
        >
          <a-input-number
            class="w-full"
            v-model:value="formState.first_release_year"
          />
        </a-form-item>
        <a-form-item
          ref="no_of_albums_released"
          label="Total Albums"
          required
          name="no_of_albums_released"
          class="flex-1"
        >
          <a-input-number
            class="w-full"
            v-model:value="formState.no_of_albums_released"
          />
        </a-form-item>
      </div>

      <a-form-item>
        <a-button type="primary" @click="onSubmit" class="w-full h-[30px]"
          >ADD</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>
