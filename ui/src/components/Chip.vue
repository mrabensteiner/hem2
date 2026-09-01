<script setup lang="ts">
const { chip } = defineProps<{
  chip?: {
    title: string;
    description?: string;
    color?: string;
    textcolor?: string;
    icon?: string;
  };
}>();
</script>

<template>
  <span v-if="chip?.title" class="chip" :title="chip?.description">
    {{ chip.title }}
  </span>
</template>

<style scoped>
.chip {
  color: v-bind("chip?.textcolor || 'inherit'");
  background-color: v-bind("chip?.color || 'none'");

  font-size: .75rem;
  padding: .25rem .5rem;
  border-radius: .5rem;
  margin: .1rem;
  white-space: pre;
  display: inline-block;

  vertical-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;

  &[title]:not([title=""]) {
    cursor: help;
  }

  &::before {
    background-color: v-bind("chip?.textcolor || 'inherit'");
    display: inline-block;
    height: .5rem;
    content: '';
  }
}
</style>
