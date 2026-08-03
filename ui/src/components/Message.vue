<script setup lang="ts">
defineProps<{
  success?: string | null;
  error?: string | null;
  info?: string | null;
}>();
</script>


<template>
<div class="messagebox error" v-if="error">
  {{ error }}
</div>
<div class="messagebox success" v-if="success">
  {{ success }}
</div>
<div class="messagebox info" v-if="info">
  {{ info }}
</div>
</template>

<style scoped>
.messagebox {
  width: fit-content;
  padding: .75rem;
  border: 2px solid black;

  &::before {
    font-size: 1.5rem;
    line-height: 1rem;
    margin-right: .5rem;
  }
}

.error {
  background-color: #f003;
  border-color: red;

  &::before {
    color: red;
    content: '🗙';
  }
}

.success {
  background-color: #0f03;
  border-color: green;

  &::before {
    color: green;
    content: '✓';
  }
}
</style>
