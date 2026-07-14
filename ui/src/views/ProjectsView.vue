<script setup lang="ts">
import {ref} from "vue";

const data = ref({});
fetch("http://localhost:3000/projects")
  .then(response => response.json())
  .then(json => data.value = json);
</script>

<template>
  <main>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Description</th>
          <th>Status</th>
          <th>Manager</th>
          <th>Last Change</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="project in data" :key="project.id">
          <td><abbr :title="project.id">{{ project.id.slice(20) }}</abbr></td>
          <td>{{ project.title }}</td>
          <td>{{ project.description }}</td>
          <td>{{ project.status.title }}</td>
          <td>{{ project.manager }}</td>
          <td>{{ project.updatedat }}</td>
          <td><RouterLink :to="{ path: '/project/' + project.id}">Open</RouterLink></td>
        </tr>
      </tbody>
    </table>
    <RouterLink :to="{ path: '/project/new' }">New Project</RouterLink>
  </main>
</template>
