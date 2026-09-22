<script setup lang="ts">
import {formatTimeAgo} from "@vueuse/core";
import {computed} from "vue";

const { date } = defineProps<{
  date: string
}>();

const dateObj = computed(() => {
  return new Date(date);
})
</script>

<template>
  <time :title="dateObj.toLocaleDateString('en-UK') + ' ' + dateObj.toLocaleTimeString('en-UK')">
    {{ formatTimeAgo(dateObj) }}
  </time>
</template>
