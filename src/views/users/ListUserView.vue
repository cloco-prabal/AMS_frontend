<script setup>
import { deleteUser, getUsers } from "@/api/Users";
import { permissionsByRoleName } from "@/utils/permissionsByRoleName";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { message } from "ant-design-vue";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const queryClient = useQueryClient();

const permissions = ref(permissionsByRoleName());

const pageSize = ref(5);
const currentPage = ref(1);

const handlePageChange = (page, size) => {
  pageSize.value = size;
  currentPage.value = page;
};

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
  queryKey: ["users", currentPage, pageSize],
  queryFn: () => getUsers(currentPage.value, pageSize.value),
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
    title: "S.N.",
    dataIndex: "id",
    key: "sn",
  },
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
    title: "Role",
    key: "role",
    dataIndex: "role",
  },
  {
    title: "Actions",
    key: "action",
  },
];
</script>

<template>
  <div class="flex sm:flex-row xsm:flex-col gap-10 justify-between mb-5">
    <h1 class="text-xl text-left font-semibold">Users List</h1>
    <button
      v-if="permissions?.user?.create"
      @click="onAdd"
      class="bg-green-600 hover:bg-green-700 py-2 px-8 rounded-sm text-white font-semibold"
    >
      Add User
    </button>
  </div>
  <a-table
    :columns="columns"
    :data-source="users"
    :scroll="{ x: 1000 }"
    :pagination="false"
  >
    <template #headerCell="{ column }"> </template>

    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'gender'">
        <p v-if="record.gender === 'm'">Male</p>
        <p v-else-if="record.gender === 'f'">Female</p>
        <p v-else>Others</p>
      </template>
      <template v-else-if="column.key === 'sn'">
        <p>{{ index + 1 }}</p>
      </template>
      <template v-else-if="column.key === 'dob'">
        <p>{{ record.dob.split("T")[0] }}</p>
      </template>
      <template v-else-if="column.key === 'role'">
        <p class="uppercase">{{ record.role.title }}</p>
      </template>
      <template v-else-if="column.key === 'action'">
        <div class="flex flex-row gap-3 min-w-[200px]">
          <button
            v-if="permissions?.user?.update"
            @click="onEdit(record)"
            class="bg-blue-500 hover:bg-blue-600 text-white flex-1 text-center py-1 rounded-md font-md"
          >
            Edit
          </button>
          <a-divider type="vertical" />
          <button
            v-if="permissions?.user?.delete"
            @click="onDelete(record)"
            class="bg-red-500 hover:bg-red-600 text-white flex-1 text-center py-1 rounded-md font-md"
          >
            Delete
          </button>
        </div>
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
