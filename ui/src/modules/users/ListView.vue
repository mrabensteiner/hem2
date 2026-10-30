<script setup lang="ts">
import {onMounted} from 'vue';
import {useUser} from './useUser.ts';
import DynamicTable from "@/components/DynamicTable.vue";
import IconAdd from "@/components/icons/IconAdd.vue";

const {
  users,
  loadUsers
} = useUser();

onMounted(() => {
  loadUsers();
});

const tablehead = [
  { "key": "id", "title": "ID", "hidden": true },
  { "key": "image", "title": "Image", "type": "imagecircle" },
  { "key": "username", "title": "Username", "type": "link", "locked": true },
  { "key": "shortname", "title": "Short" },
  { "key": "lastname", "title": "Lastname" },
  { "key": "firstname", "title": "Firstname" },
  { "key": "roleTitle", "title": "Role" },
  { "key": "link", "title": "Open", "type": "link", "locked": true },
];
</script>

<template>
  <h1>Users</h1>
  <DynamicTable :head="tablehead" :data="users" sort="username" dir="asc"/>
  <RouterLink :to="{ path: '/users/new/edit' }" class="button"><IconAdd class="icon"/> New User</RouterLink>
</template>
