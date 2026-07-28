<script setup lang="ts">
import { onMounted } from 'vue';
import { useSeverityList } from '../composables/useSeverityList.ts';
import Table from "@/components/Table.vue";

const { severitySets, loadSeveritySets } = useSeverityList();

onMounted(() => {
  loadSeveritySets();
});

const tablehead = [
  { "key": "title", "title": "Title", "locked": true },
  { "key": "link", "title": "Open", "type": "link", "locked": true  },
];
</script>

<template>
  <h1>Severity Sets</h1>
  <Table :head="tablehead" :data="severitySets" sort="title" />
  <RouterLink to="/severities/new" class="button">New Set</RouterLink>
</template>
