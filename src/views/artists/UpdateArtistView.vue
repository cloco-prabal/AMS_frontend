<script setup>
import { reactive, ref, toRaw, watch } from "vue";
import BackBtn from "@/components/BackBtn.vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import moment from "moment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { getArtistById, updateArtist } from "@/api/Artists";

const formRef = ref();

const router = useRouter();
const route = useRoute();

const artistId = ref(route.params.id);

const { data: artist } = useQuery({
  queryKey: ["artist", artistId.value],
  queryFn: () => getArtistById(artistId.value),
});

const queryClient = useQueryClient();

const { mutateAsync } = useMutation({
  mutationFn: (data) => updateArtist(artistId.value, data),
  onSuccess: () => {
    queryClient.invalidateQueries(["artists"]);
    router.push("/");
    message.success("Artist updated successfully!");
  },
  onError: (err) => {
    console.log(err.message);
    message.error("Failed to update artist!");
  },
});

const formState = reactive({
  name: "",
  dob: null,
  gender: null,
  address: "",
  first_release_year: "",
  no_of_albums_released: "",
});

// Watch for changes in the `artist` data and update the form state accordingly
watch(
  () => artist.value,
  (newArtist) => {
    if (newArtist) {
      formState.name = newArtist.name || "";
      formState.address = newArtist.address || "";
      formState.dob = moment(newArtist.dob) || null;
      formState.gender = newArtist.gender || "m";
      formState.first_release_year = newArtist.first_release_year || "";
      formState.no_of_albums_released = newArtist.no_of_albums_released || null;
    }
  },
  { immediate: true } // Ensures that it runs immediately after `artist` is fetched
);

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
        <h1 class="text-xl text-left font-semibold">UPDATE ARTIST</h1>
        <BackBtn />
      </div>

      <a-form-item ref="name" label="Name" required name="name">
        <a-input v-model:value="formState.name" />
      </a-form-item>

      <div class="flex flex-row gap-4">
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
      </div>
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
          >Update</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>
