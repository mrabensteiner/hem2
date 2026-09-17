<script setup lang="ts">
import {onMounted} from 'vue';
import {useUser} from './useUser.ts';
import Table from "@/components/Table.vue";

const {
  users,
  loadUsers
} = useUser();

onMounted(() => {
  loadUsers();
});

const tablehead = [
  { "key": "id", "title": "ID", "hidden": true },
  { "key": "username", "title": "Username", "type": "link", "locked": true },
  { "key": "lastname", "title": "Lastname" },
  { "key": "firstname", "title": "Firstname" },
  { "key": "roleTitle", "title": "Role" },
  { "key": "link", "title": "Open", "type": "link", "locked": true },
];
</script>

<template>
  <h1>Users</h1>
  <Table :head="tablehead" :data="users" sort="username" dir="asc"/>
  <RouterLink :to="{ path: '/user/new' }" class="button">New User</RouterLink>
</template>
