<script setup>
import { deleteArtist, getArtists } from "@/api/Artists";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { toRaw } from "vue";

const router = useRouter();

//Query

const queryClient = useQueryClient();

const { isPending, isError, data, error } = useQuery({
  queryKey: ["artists"],
  queryFn: getArtists,
});

const { mutateAsync } = useMutation({
  mutationFn: (id) => deleteArtist(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["artists"] });
    message.success("Artist and their songs deleted successfully.");
  },
  onError: (err) => {
    message.error(err.message ? err.message : "Error deleting artist");
  },
});

const csvExport = (filename = "Artists") => {
  // mkConfig merges your options with the defaults
  // and returns WithDefaults<ConfigOptions>

  const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: filename });
  const csv = generateCsv(csvConfig)(toRaw(data.value));
  download(csvConfig)(csv);
};

const onAdd = () => {
  router.push("/artists/add");
};
const onEdit = (record) => {
  router.push(`/artists/edit/${record.key}`);
};

const onDelete = async (record) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete artist ${record.name}?`
  );

  if (confirmed) {
    // Run your delete logic here
    console.log(`Artist ${record.name} deleted`);
    await mutateAsync(record.id);
  } else {
    // Handle cancellation here if needed
    console.log("Delete action was canceled");
  }
};

const onSongView = (record) => {
  router.push(`/musics/${record.id}?name=${record.name}`);
};

const columns = [
  {
    name: "Name",
    dataIndex: "name",
    key: "Name",
  },
  {
    title: "Date of birth",
    dataIndex: "dob",
    key: "dob",
  },
  {
    title: "Gender",
    dataIndex: "gender",
    key: "gender",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "First Release Year",
    dataIndex: "first_release_year",
    key: "First Released Year",
  },
  {
    title: "No of Albums",
    dataIndex: "no_of_albums_released",
    key: "Albums Released",
  },
  {
    title: "Action",
    key: "action",
  },
];
</script>

<template>
  <div class="flex flex-row justify-between mb-5">
    <h1 class="text-xl text-left font-semibold">Artists List</h1>

    <div>
      <button
        @click="csvExport()"
        class="mr-5 border-green-600 hover:border-green-400 border-2 py-2 px-8 rounded-sm text-green-600 font-semibold"
      >
        <i class="pi pi-file-export mr-2"></i>
        Export CSV
      </button>
      <button
        @click="console.log('hello')"
        class="mr-5 border-blue-600 hover:border-blue-400 border-2 py-2 px-8 rounded-sm text-blue-600 font-semibold"
      >
        <i class="pi pi-file-import mr-2"></i>

        Import CSV
      </button>
      <button
        @click="onAdd"
        class="mr-5 bg-green-600 hover:bg-green-700 py-2 px-8 rounded-sm text-white font-semibold"
      >
        Add Artist
      </button>
    </div>
  </div>

  <a-table :columns="columns" :data-source="data">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span class="uppercase"> Name </span>
      </template>
      <template v-else>
        <span class="capitalize">{{ column.key }} </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <a>
          {{ record.name }}
        </a>
      </template>

      <template v-if="column.key === 'gender'">
        <p v-if="record.gender === 'm'">Male</p>
        <p v-else-if="record.gender === 'f'">Female</p>
        <p v-else>Others</p>
      </template>
      <template v-else-if="column.key === 'dob'">
        <p>{{ record.dob.split("T")[0] }}</p>
      </template>

      <template v-else-if="column.key === 'action'">
        <div class="flex flex-row gap-3 min-w-[300px]">
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

          <button
            @click="onSongView(record)"
            class="text-black flex-1 text-center py-1 rounded-md font-md border-2 border-black"
          >
            View Songs
          </button>
        </div>
      </template>
    </template>
  </a-table>
</template>
