<script setup>
import BackBtn from "@/components/BackBtn.vue";
import { message } from "ant-design-vue";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const artist = ref(route.params.artistId);

const onAdd = () => {
  router.push("/musics/add");
};
const onEdit = (record) => {
  router.push(`/musics/edit/${record.key}`);
};

const onDelete = (record) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete the song ${record.name}?`
  );

  if (confirmed) {
    // Run your delete logic here
    console.log(`Music ${record.name} deleted`);
    message.success("Song deleted!");
  } else {
    // Handle cancellation here if needed
    console.log("Delete action was canceled");
  }
};

const onSongView = (record) => {
  router.push(`/musics/${record.key}`);
};

const columns = [
  {
    name: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
  },
  {
    title: "Action",
    key: "action",
  },
];
const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];
</script>

<template>
  <div class="flex justify-end mb-5 mr-6">
    <BackBtn />
  </div>
  <div class="flex flex-row justify-between mb-5">
    <h1 class="text-xl text-left font-semibold">
      Songs List for Artist {{ artist }}
    </h1>

    <button
      @click="onAdd"
      class="mr-5 bg-green-600 hover:bg-green-700 py-2 px-8 rounded-sm text-white font-semibold"
    >
      Add A Song
    </button>
  </div>

  <a-table :columns="columns" :data-source="data">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span>
          <smile-outlined />
          Name
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <a>
          {{ record.name }}
        </a>
      </template>
      <template v-else-if="column.key === 'tags'">
        <span>
          <a-tag
            v-for="tag in record.tags"
            :key="tag"
            :color="
              tag === 'loser'
                ? 'volcano'
                : tag.length > 5
                ? 'geekblue'
                : 'green'
            "
          >
            {{ tag.toUpperCase() }}
          </a-tag>
        </span>
      </template>
      <template v-else-if="column.key === 'action'">
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
    </template>
  </a-table>
</template>
