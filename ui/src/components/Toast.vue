<script setup lang="ts">
import {useToast} from "@/composables/useToast.ts";
const { toasts } = useToast();
</script>


<template>
<div class="toast-container" aria-live="assertive">
  <div class="toast" v-for="t in toasts" :key="t.id" :data-type="t.type">
    {{ t.message }}
  </div>
</div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  flex-direction: column;
  gap: .5rem;
  z-index: 1;

  .toast {
    padding: .75rem;
    border: 2px solid var(--box-color);
    background-color: color-mix(in srgb, var(--box-color) 30%, white 70%);
    animation: 2s fade 3s ease forwards;

    &::before {
      color: var(--box-color);
      font-size: 1.5rem;
      line-height: 1rem;
      margin-right: .5rem;
    }

    &[data-type="error"] {
      --box-color: red;

      &::before {
        content: '🗙';
      }
    }

    &[data-type="success"] {
      --box-color: green;

      &::before {
        content: '✓';
      }
    }
  }
}

@keyframes fade {
  from {
    opacity: 1
  }
  to {
    opacity: 0;
  }
}
</style>
