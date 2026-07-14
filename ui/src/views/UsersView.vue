<script setup lang="ts">
import {ref} from "vue";

const data = ref({});
fetch("http://localhost:3000/users")
  .then(response => response.json())
  .then(json => data.value = json);
</script>

<template>
  <main>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Firstname</th>
          <th>Lastname</th>
          <th>Role</th>
          <th>Open</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in data" :key="user.id">
          <td><abbr :title="user.id">{{ user.id.slice(30) }}</abbr></td>
          <td>{{ user.username }}</td>
          <td>{{ user.firstname }}</td>
          <td>{{ user.lastname }}</td>
          <td>{{ user.role }}</td>
          <td><RouterLink :to="{ path: '/user/' + user.id}">Open</RouterLink></td>
        </tr>
      </tbody>
    </table>
    <RouterLink :to="{ path: '/user/new' }">New User</RouterLink>
  </main>
</template>
