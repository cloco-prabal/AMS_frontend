<script setup>
import { reactive, ref, toRaw, watch } from "vue";
import BackBtn from "@/components/BackBtn.vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import moment from "moment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { getMusicById, updateMusic } from "@/api/Musics";

const formRef = ref();

const router = useRouter();
const route = useRoute();

const musicId = ref(route.params.id);

const { data: music } = useQuery({
  queryKey: ["music", musicId.value],
  queryFn: () => getMusicById(musicId.value),
});

const queryClient = useQueryClient();

const { mutateAsync } = useMutation({
  mutationFn: (data) => updateMusic(musicId.value, data),
  onSuccess: () => {
    queryClient.invalidateQueries(["musics"]);
    history.back();
    message.success("Music updated successfully!");
  },
  onError: (err) => {
    console.log(err.message);
    message.error("Failed to update music!");
  },
});

const formState = reactive({
  title: "",
  album_name: "",
  genre: undefined,
  artist_id: "",
});
// Watch for changes in the `music` data and update the form state accordingly
watch(
  () => music.value,
  (newMusic) => {
    if (newMusic) {
      formState.title = newMusic.title || "";
      formState.album_name = newMusic.album_name || "";
      formState.genre = newMusic.genre || "";
      formState.artist_id = newMusic.artist_id || "";
    }
  },
  { immediate: true } // Ensures that it runs immediately after `music` is fetched
);

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

      await mutateAsync(data);
      // message.success("Song created successfully!");
      // window.history.back();
    })
    .catch((error) => {
      console.log("error", error);
    });
};
</script>

<template>
  <div class="w-[100%] min-h-screen">
    <a-form
      ref="formRef"
      :model="formState"
      class="w-[60%] mx-auto"
      :rules="rules"
      layout="vertical"
    >
      <div class="flex flex-row justify-between my-5">
        <h1 class="text-xl text-left font-semibold">ADD A NEW SONG</h1>
        <BackBtn />
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
