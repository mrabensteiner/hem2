<script setup lang="ts">
const {chip} = defineProps<{
  chip: Object
}>()
</script>

<template>
  <span class="chip">
    {{chip.title}}
  </span>
</template>

<style scoped>
.chip {
  color: v-bind(chip.textcolor);
  background-color: v-bind(chip.color);
  font-size: .75rem;
  text-transform: uppercase;
  padding: .5rem;
  border-radius: .5rem;
  white-space: pre;
  display: inline-block;

  &::before {
    background-color: v-bind(chip.textcolor);
    display: inline-block;
    //mask: v-bind(chip.icon);
    height: .5rem;
    width: .5rem;
    content: '';
  }
}
</style>
