<script setup>
import { deleteMusic, getMusics, getMusicsByArtistId } from "@/api/Musics";
import BackBtn from "@/components/BackBtn.vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { message } from "ant-design-vue";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const artist = ref(route.query?.name);
const artistId = ref(route.params?.artistId);

const queryClient = useQueryClient();

const { data: response } = useQuery({
  queryFn: () => getMusicsByArtistId(1, 10, artistId.value),
  queryKey: ["musicsByArtistId", artistId.value],
});

const musics = computed(() => response?.value?.data || []);
const pagination = computed(() => response?.value?.pagination || {});

const { mutateAsync } = useMutation({
  mutationFn: (id) => deleteMusic(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["musics"] });
    message.success("Music deleted");
  },
  onError: (err) => {
    message.error(err.message ? err.message : "Error deleting artist");
  },
});

const onAdd = () => {
  router.push(`/musics/add/${artistId.value}`);
};
const onEdit = (record) => {
  router.push(`/musics/edit/${record.id}`);
};

const onDelete = async (record) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete the song ${record.name}?`
  );

  if (confirmed) {
    // Run your delete logic here
    mutateAsync(record.id);
  } else {
    // Handle cancellation here if needed
    console.log("Delete action was canceled");
  }
};

const columns = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Album",
    dataIndex: "album_name",
    key: "album_name",
  },
  {
    title: "Genre",
    dataIndex: "genre",
    key: "genre",
  },
  {
    title: "Action",
    key: "action",
  },
];
</script>

<template>
  <div class="flex flex-row justify-between mb-5">
    <h1 class="text-xl text-left font-semibold underline">
      <span class="text-green-500">{{ artist }}'s</span> Songs
    </h1>
    <div class="flex justify-end mb-5 mr-6">
      <button
        @click="onAdd"
        class="mr-5 bg-green-600 hover:bg-green-700 py-2 px-8 rounded-sm text-white font-semibold"
      >
        Add A Song
      </button>
      <div class="self-end">
        <BackBtn />
      </div>
    </div>
  </div>

  <a-table :columns="columns" :data-source="musics">
    <template #headerCell="{ column }"> </template>

    <template #bodyCell="{ column, record }">
      <template class="capitalize" v-if="column.key === 'action'">
        <div class="flex flex-row gap-3">
          <button
            @click="onEdit(record)"
            class="bg-blue-500 hover:bg-blue-600 text-white flex-1 text-center py-1 rounded-md font-md"
          >
            Edit
          </button>
          <a-divider type="vertical" />
          <button
            @click="onDelete(record)"
            class="bg-red-500 hover:bg-red-600 text-white flex-1 text-center py-1 rounded-md font-md"
          >
            Delete
          </button>
          <a-divider type="vertical" />
        </div>
      </template>
      <template v-else>
        <p class="capitalize">
          {{ record[column.key] }}
        </p>
      </template>
    </template>
  </a-table>
</template>
