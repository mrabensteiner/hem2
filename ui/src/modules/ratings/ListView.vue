<script setup lang="ts">
import { onMounted } from 'vue';
import { useRating } from './useRating.ts';
import DynamicTable from "@/components/DynamicTable.vue";
import IconAdd from "@/components/icons/IconAdd.vue";

const { ratingSets, loadRatingSets } = useRating();

onMounted(() => {
  loadRatingSets();
});

const tablehead = [
  { "key": "title", "title": "Title", "type": "link", "locked": true },
  { "key": "owner", "title": "Owner" },
  { "key": "link", "title": "Open", "type": "link", "locked": true  },
];
</script>

<template>
  <h1>Rating Sets</h1>
  <DynamicTable :head="tablehead" :data="ratingSets" sort="title" />
  <RouterLink to="/ratings/new" class="button"><IconAdd class="icon"/> New Set</RouterLink>
</template>
