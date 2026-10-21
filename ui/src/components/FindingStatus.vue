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

