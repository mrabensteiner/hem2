<script setup lang="ts">
import {ref} from "vue";
import Table from "@/components/Table.vue";

const data = ref([]);
fetch("http://localhost:3000/users")
  .then(response => response.json())
  .then(json => data.value = json.map(user => ({
    ...user,
    link: '/user/' + user.id
  })));

const tablehead = [
  { "key": "id", "title": "ID", "hidden": true },
  { "key": "username", "title": "Username", "locked": true },
  { "key": "firstname", "title": "Firstname" },
  { "key": "lastname", "title": "Lastname" },
  { "key": "role", "title": "Role" },
  { "key": "link", "title": "Open", "type": "link", "locked": true },
];
</script>

<template>
  <h1>Users</h1>
  <Table :head="tablehead" :data="data" sort="username" dir="asc"/>
  <RouterLink :to="{ path: '/user/new' }" class="button">New User</RouterLink>
</template>
