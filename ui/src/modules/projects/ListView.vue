<script setup lang="ts">
import { onMounted } from 'vue';
import { useProjectsList } from './useProjectList.ts';
import Table from "@/components/Table.vue";

const { projects, loadProjects } = useProjectsList();

onMounted(() => {
  loadProjects();
});

const tablehead = [
  { "key": "id", "title": "ID", "hidden": true },
  { "key": "title", "title": "Title", "type": "link", "locked": true, sortable: true },
  { "key": "description", "title": "Description", "hidden": true },
  { "key": "status", "title": "Status", "type": "chip" },
  { "key": "manager", "title": "Manager", "type": "multi" },
  { "key": "updatedat", "title": "Last Change", "type": "time" },
  { "key": "link", "title": "Open", "type": "link", "locked": true  },
];
</script>

<template>
  <h1>Projects</h1>
  <Table :head="tablehead" :data="projects" sort="updatedat" />
  <RouterLink to="/project/new" class="button">New Project</RouterLink>
</template>
