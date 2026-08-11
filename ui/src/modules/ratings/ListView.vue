<script setup lang="ts">
import { onMounted } from 'vue';
import { useRating } from './useRating.ts';
import Table from "@/components/Table.vue";

const { ratingSets, loadRatingSets } = useRating();

onMounted(() => {
  loadRatingSets();
});

const tablehead = [
  { "key": "title", "title": "Title", "type": "link", "locked": true },
  { "key": "link", "title": "Open", "type": "link", "locked": true  },
];
</script>

<template>
  <h1>Rating Sets</h1>
  <Table :head="tablehead" :data="ratingSets" sort="title" />
  <RouterLink to="/ratings/new" class="button">New Set</RouterLink>
</template>
