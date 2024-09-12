<script setup>
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";

const router = useRouter();

const onAdd = () => {
  router.push("/artists/add");
};
const onEdit = (record) => {
  router.push(`/artists/edit/${record.key}`);
};

const onDelete = (record) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete artist ${record.name}?`
  );

  if (confirmed) {
    // Run your delete logic here
    console.log(`Artist ${record.name} deleted`);
    message.success("Artist deleted!");
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
  <div class="flex flex-row justify-between mb-5">
    <h1 class="text-xl text-left font-semibold">Artists List</h1>
    <button
      @click="onAdd"
      class="mr-5 bg-green-600 hover:bg-green-700 py-2 px-8 rounded-sm text-white font-semibold"
    >
      Add Artist
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
