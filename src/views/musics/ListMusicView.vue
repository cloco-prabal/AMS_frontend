<script setup>
import { deleteMusic, getMusicsByArtistId } from "@/api/Musics";
import BackBtn from "@/components/BackBtn.vue";
import { getRoleName } from "@/utils/getRoleName";
import { permissionsByRoleName } from "@/utils/permissionsByRoleName";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { message } from "ant-design-vue";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const artist = ref(route.query?.name);
const artistId = ref(route.params?.artistId);

const queryClient = useQueryClient();

const permissions = ref(permissionsByRoleName());
const roleName = ref(getRoleName());

const pageSize = ref(5);
const currentPage = ref(1);

const handlePageChange = (page, size) => {
  pageSize.value = size;
  currentPage.value = page;
};

const { data: response } = useQuery({
  queryFn: () =>
    getMusicsByArtistId(currentPage.value, pageSize.value, artistId.value),
  queryKey: ["musicsByArtistId", artistId, pageSize, currentPage],
});

const musics = computed(() => response?.value?.data || []);
const pagination = computed(() => response?.value?.pagination || {});

const { mutateAsync } = useMutation({
  mutationFn: (id) => deleteMusic(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["musicsByArtistId"] });
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
    title: "S.N.",
    dataIndex: "sn",
    key: "sn",
  },
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
    title: "Actions",
    key: "action",
  },
];
</script>

<template>
  <div v-if="roleName !== 'artist'" class="flex w-full justify-end mb-5">
    <BackBtn />
  </div>
  <div class="flex sm:flex-row xsm:flex-col gap-10 justify-between mb-5">
    <h1 class="text-lg text-left sm:self-end font-semibold">
      <span class="text-green-500">{{ artist }}'s</span> songs list
    </h1>

    <button
      v-if="permissions?.song?.create"
      @click="onAdd"
      class="bg-green-600 hover:bg-green-700 py-2 px-8 rounded-sm text-white font-semibold"
    >
      Add A Song
    </button>
  </div>

  <a-table
    :columns="columns"
    :data-source="musics"
    :scroll="{ x: 1000 }"
    :pagination="false"
  >
    <template #headerCell="{ column }"> </template>

    <template #bodyCell="{ column, record, index }">
      <template class="capitalize" v-if="column.key === 'action'">
        <div class="flex flex-row gap-3">
          <button
            v-if="permissions?.song?.update"
            @click="onEdit(record)"
            class="bg-blue-500 hover:bg-blue-600 text-white flex-1 text-center py-1 rounded-md font-md"
          >
            Edit
          </button>
          <a-divider type="vertical" />
          <button
            v-if="permissions?.song?.delete"
            @click="onDelete(record)"
            class="bg-red-500 hover:bg-red-600 text-white flex-1 text-center py-1 rounded-md font-md"
          >
            Delete
          </button>
          <a-divider type="vertical" />
        </div>
      </template>
      <template v-else-if="column.key === 'sn'">
        <p class="capitalize">
          {{ index + 1 }}
        </p>
      </template>
      <template v-else>
        <p class="capitalize">
          {{ record[column.key] }}
        </p>
      </template>
    </template>
  </a-table>
  <div class="my-10 flex justify-end">
    <a-pagination
      v-model:current="pagination.current_page"
      defaultPageSize="10"
      :page-size="pageSize"
      @change="handlePageChange"
      :pageSizeOptions="['1', '5', '10', '20', '50']"
      :showSizeChanger="true"
      :total="pagination.total_count"
      :show-total="(total) => `Total ${total} items`"
    />
  </div>
</template>
