<script setup>
import { reactive, ref, toRaw } from "vue";
import BackBtn from "@/components/BackBtn.vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { useMutation } from "@tanstack/vue-query";
import { addMusic } from "@/api/Musics";

const formRef = ref();

const router = useRouter();
const route = useRoute();

const formState = reactive({
  title: "",
  album_name: "",
  genre: undefined,
});

const artistId = ref(route.params?.artistId);

const { mutateAsync } = useMutation({
  mutationFn: (data) => addMusic(data),
  onSuccess: () => {
    message.success("Music added");
    history.back();
  },
  onError: () => {
    message.error("Error adding music");
  },
});

const rules = {
  title: [
    {
      required: true,
      message: "Please input music title",
      trigger: "change",
    },
    {
      min: 3,
      message: "Length should be greater than 2 characters",
      trigger: "blur",
    },
  ],
  album_name: [
    {
      required: true,
      message: "Please input album name",
      trigger: "change",
    },
    {
      min: 3,
      message: "Length should be greater than 2 characters",
      trigger: "blur",
    },
  ],

  genre: [
    {
      // type: "array",
      required: true,
      message: "Please select at least one genre ",
      trigger: "change",
    },
  ],
};
const onSubmit = () => {
  formRef.value
    .validate()
    .then(async () => {
      const data = toRaw(formState);
      const finalData = { ...data, artist_id: artistId.value };

      await mutateAsync(finalData);
      // message.success("Song created successfully!");
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
        <h1 class="text-xl text-left font-semibold">ADD A NEW SONG</h1>
      </div>

      <a-form-item ref="title" label="Title" required name="title">
        <a-input v-model:value="formState.title" />
      </a-form-item>
      <a-form-item
        ref="album_name"
        label="Album Name"
        required
        name="album_name"
      >
        <a-input v-model:value="formState.album_name" />
      </a-form-item>

      <a-form-item class="flex-1" label="Genre" name="genre">
        <a-select
          v-model:value="formState.genre"
          placeholder="Please select genre"
        >
          <a-select-option value="rnb">R&B</a-select-option>
          <a-select-option value="country">Country</a-select-option>
          <a-select-option value="classic">Classic</a-select-option>
          <a-select-option value="rock">Rock</a-select-option>
          <a-select-option value="jazz">Jazz</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item>
        <a-button type="primary" @click="onSubmit" class="w-full h-[35px]"
          >ADD</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>
