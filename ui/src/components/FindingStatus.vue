<script setup lang="ts">
const { finding } = defineProps<{
  finding: any
}>();
</script>

<template>
  <template v-if="finding.mergedFrom?.length">
    <span class="chip chip-merged">Merged finding</span>
  </template>
  <template v-else-if="finding.mergedTo">
    <span class="chip chip-merged-into">Merged into other finding</span>
  </template>
  <template v-else-if="finding.reviewed">
    <span class="chip chip-reviewed">Manager reviewed</span>
  </template>
  <template v-else>
    <span class="chip chip-not-reviewed">Not reviewed</span>
  </template>
</template>

<style scoped>
.chip {
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

  &.chip-merged {
    background-color: dodgerblue;
    color: white;
  }

  &.chip-merged-into {
    background-color: darkturquoise;
    color: white;
  }

  &.chip-reviewed {
    background-color: green;
    color: white;
  }

  &.chip-not-reviewed {
    background-color: grey;
    color: white;
  }
}
</style>
