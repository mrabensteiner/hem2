<script setup lang="ts">
import { onMounted } from 'vue';
import { useHeuristic } from './useHeuristic.ts';
import Table from "@/components/Table.vue";

const { heuristicSets, loadHeuristicSets } = useHeuristic();

onMounted(() => {
  loadHeuristicSets();
});

const tablehead = [
  { "key": "title", "title": "Title", "type": "link", "locked": true },
  { "key": "link", "title": "Open", "type": "link", "locked": true  },
];
</script>

<template>
  <h1>Heuristic Sets</h1>
  <Table :head="tablehead" :data="heuristicSets" sort="title" />
  <RouterLink to="/heuristics/new" class="button">New Set</RouterLink>
</template>
