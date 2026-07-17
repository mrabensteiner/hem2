<script setup lang="ts">
import {ref} from "vue";
import Table from "@/components/Table.vue";

const data = ref([]);
fetch("http://localhost:3000/projects")
  .then(response => response.json())
  .then(json => prepareForTable(json))
  .then(json => data.value = json);

function prepareForTable(data) {
  data = data.map((project) => {
    project.link = "/project/" + project.id;
    project.manager = project.UserInProject.map(uip => uip.user.firstname + " " + uip.user.lastname);
    return project;
  });

  data.title = "blabla";

  return data;
}

const tablehead = [
  { "key": "id", "title": "ID", "hidden": true },
  { "key": "title", "title": "Title", "locked": true },
  { "key": "description", "title": "Description", "hidden": true },
  { "key": "status", "title": "Status", "type": "chip" },
  { "key": "manager", "title": "Manager", "type": "multi" },
  { "key": "updatedat", "title": "Last Change", "type": "time" },
  { "key": "link", "title": "Open", "type": "link", "locked": true  },
];
</script>

<template>
  <main>
    <Table :head="tablehead" :data="data" sort="updatedat" dir="asc"></Table>
    <RouterLink :to="{ path: '/project/new' }">New Project</RouterLink>
  </main>
</template>
