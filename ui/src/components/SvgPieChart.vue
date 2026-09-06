<script setup lang="ts">
import {computed} from "vue";

const pi = 3.14159;

const { data } = defineProps<{
  data: any[];
}>();

const rotation = computed(() => {
  let cumulative = 0;
  return data.map(segment => {
    const rotation = cumulative;
    cumulative += segment.percentage;
    return rotation;
  })
});
</script>

<template>
  <svg viewBox="0 0 600 200">
  <g class="entry" v-for="(d, k) in data">
    <circle r="50" cx="100" cy="100" fill="none"
        stroke-width="100"
        :stroke="d.color"
        :stroke-dashoffset="(rotation[k] ?? 0) * -pi"
        :stroke-dasharray="(d.percentage * pi) + ' ' + pi*100"
      >
        <title>{{d.title}} ({{d.count}})</title>
      </circle>

      <rect x="230" :y="25*k + 10" width="10" height="10"
          :fill="d.color" rx="1" ry="1" stroke="var(--color-border)" stroke-width="2" paint-order="stroke"/>

      <text x="247" :y="25*k + 20" fill="currentColor">
        {{d.title}} ({{d.count}})
      </text>
    </g>
  </svg>
</template>

<style scoped>
svg {
  color: var(--color-text);
  overflow: visible;

  &:has(.entry:hover) .entry:not(:hover) {
    opacity: .6;
  }

  .entry {
    --animation: all .2s ease-out;
    transition: var(--animation);

    &:hover {
      circle {
        scale: 1.05;
        filter: drop-shadow(0 0 5px var(--color-border));
      }
    }

    circle {
      transition: var(--animation);
      rotate: -90deg;
      transform-origin: 100px 100px;
    }
  }
}
</style>
