<script setup>
import { addArtist, deleteArtist, getArtists } from "@/api/Artists";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { message, Upload } from "ant-design-vue";
import { useRouter } from "vue-router";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { computed, toRaw } from "vue";
import Papa from "papaparse";
import moment from "moment";

const router = useRouter();

//Query

const queryClient = useQueryClient();

const { data: response } = useQuery({
  queryKey: ["artists"],
  queryFn: () => getArtists(),
});

const artists = computed(() => response?.value?.data || []);
const pagination = computed(() => response?.value?.pagination || {});

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

const { mutateAsync: importMutate } = useMutation({
  mutationFn: (artists) => addArtist(artists),
  onSuccess: () => {},
  onError: (err) => {
    message.error(err.message ? err.message : "Error importing artists");
  },
});

const csvExport = (filename = "Artists") => {
  // mkConfig merges your options with the defaults
  // and returns WithDefaults<ConfigOptions>

  const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: filename });
  const csv = generateCsv(csvConfig)(toRaw(data.value));
  download(csvConfig)(csv);
};

const csvImport = (info) => {
  if (info.file.status === "done") {
    Papa.parse(info.file.originFileObj, {
      header: true,
      complete: async (result) => {
        const artists = result.data.map((artist) => {
          const { id, created_at, updated_at, ...rest } = artist;
          return {
            ...rest,
            dob: rest.dob ? moment(rest.dob).format("YYYY-MM-DD") : null,
          };
        });

        for (const artist of artists) {
          try {
            await importMutate(artist);
          } catch (error) {
            message.error(
              `Error importing artist: ${artist.name}. ${error.message}`
            );
          }
        }

        message.success("CSV file processed and artists imported.");
        queryClient.invalidateQueries(["artists"]);
      },
      error: () => {
        message.error("Error parsing CSV file.");
      },
    });
  }
};

const onAdd = () => {
  router.push("/artists/add");
};
const onEdit = (record) => {
  router.push(`/artists/edit/${record.id}`);
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

const customRequest = ({ file, onSuccess }) => {
  setTimeout(() => onSuccess("ok"), 0); // To simulate successful upload
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

    <div class="flex">
      <button
        @click="csvExport()"
        class="mr-5 border-green-400 hover:border-green-400 border-2 py-2 px-8 rounded-sm hover:text-green-600 font-semibold"
      >
        <i class="pi pi-file-export mr-2"></i>
        Export CSV
      </button>
      <a-upload
        accept=".csv"
        @change="csvImport"
        :showUploadList="false"
        :customRequest="customRequest"
      >
        <button
          class="mr-5 border-blue-400 hover:border-blue-400 border-2 py-2 px-8 rounded-sm hover:text-blue-600 font-semibold"
        >
          <i class="pi pi-file-import mr-2"></i>

          Import CSV
        </button>
      </a-upload>

      <button
        @click="onAdd"
        class="mr-5 bg-green-600 hover:bg-green-700 py-2 px-8 rounded-sm text-white font-semibold"
      >
        Add Artist
      </button>
    </div>
  </div>

  <a-table :columns="columns" :data-source="artists">
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
