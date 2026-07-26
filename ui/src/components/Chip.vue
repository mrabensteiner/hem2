<script setup lang="ts">
const { chip } = defineProps<{
  chip?: {
    title: string;
    color?: string;
    textcolor?: string;
    icon?: string;
  };
}>();
</script>

<template>
  <span v-if="chip?.title" class="chip">
    {{ chip.title }}
  </span>
</template>

<style scoped>
.chip {
  color: v-bind("chip?.textcolor || 'inherit'");
  background-color: v-bind("chip?.color || 'none'");

  font-size: .75rem;
  padding: .5rem;
  border-radius: .5rem;
  white-space: pre;
  display: inline-block;

  &::before {
    background-color: v-bind("chip?.textcolor || 'inherit'");
    display: inline-block;
    height: .5rem;
    width: .5rem;
    content: '';
  }
}
</style>
