<script setup lang="ts">
import { onMounted } from 'vue';
import { useProjects } from './useProjects.ts';
import DynamicTable from "@/components/DynamicTable.vue";
import IconAdd from "@/components/icons/IconAdd.vue";

const { projects, loadProjects } = useProjects();

onMounted(() => {
  loadProjects();
});

const tablehead = [
  { "key": "id", "title": "ID", "hidden": true },
  { "key": "logo", "title": "Logo", "type": "imagelink" },
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
  <DynamicTable :head="tablehead" :data="projects" sort="updatedat" />
  <RouterLink to="/project/new" class="button"><IconAdd class="icon"/> New Project</RouterLink>
</template>
