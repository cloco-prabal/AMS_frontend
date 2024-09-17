<script setup>
import { deleteUser, getUsers } from "@/api/Users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { message } from "ant-design-vue";
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const queryClient = useQueryClient();

const { mutateAsync } = useMutation({
  mutationFn: (id) => deleteUser(id),
  onSuccess: () => {
    queryClient.invalidateQueries(["artists"]);
    message.success("User deleted successfully");
  },
  onError: () => {
    message.error("Error deleting user");
  },
});

const { data: response } = useQuery({
  queryKey: ["users"],
  queryFn: () => getUsers(),
});
const users = computed(() => response?.value?.data || []);
const pagination = computed(() => response?.value?.pagination || {});
const onAdd = () => {
  router.push("/users/add");
};

const onEdit = async (record) => {
  router.push(`/users/edit/${record.id}`);
};

const onDelete = async (record) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete user ${record.name}?`
  );

  if (confirmed) {
    // Run your delete logic here
    try {
      await mutateAsync(record.id);
    } catch (error) {
      console.log(error);
    }
  } else {
    // Handle cancellation here if needed
    console.log("Delete action was canceled");
  }
};

const columns = [
  {
    title: "First Name",
    dataIndex: "first_name",
    key: "first_name",
  },
  {
    title: "Last Name",
    dataIndex: "last_name",
    key: "last_name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Gender",
    key: "gender",
    dataIndex: "gender",
  },
  {
    title: "Action",
    key: "action",
  },
];
</script>

<template>
  <div class="flex flex-row justify-between mb-5">
    <h1 class="text-xl text-left font-semibold">Users List</h1>
    <button
      @click="onAdd"
      class="mr-5 bg-green-600 hover:bg-green-700 py-2 px-8 rounded-sm text-white font-semibold"
    >
      Add User
    </button>
  </div>
  <a-table :columns="columns" :data-source="users">
    <template #headerCell="{ column }"> </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'gender'">
        <p v-if="record.gender === 'm'">Male</p>
        <p v-else-if="record.gender === 'f'">Female</p>
        <p v-else>Others</p>
      </template>
      <template v-else-if="column.key === 'dob'">
        <p>{{ record.dob.split("T")[0] }}</p>
      </template>
      <template v-else-if="column.key === 'action'">
        <div class="flex flex-row gap-3 min-w-[200px]">
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
        </div>
      </template>
    </template>
  </a-table>
</template>
