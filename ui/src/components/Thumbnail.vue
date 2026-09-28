<script setup lang="ts">
const baseurl = 'http://localhost:3000/';

defineProps<{
  image: any;
  index: number;
  prev: any | null;
  next: any | null;
}>();
</script>


<template>
  <div>
    <img :src="baseurl + image.path" :data-index="index" :data-prev="prev ? baseurl + prev.path : null" :data-next="next ? baseurl + next.path : null"/>
  </div>
</template>


<style scoped>
div {
  overflow: hidden;
  background-color: var(--color-background-mute);
  border: 2px solid var(--color-border);
  border-radius: 2px;
  height: 5rem;
  width: 8rem;

  img {
    height: 100%;
    width: 100%;
    object-fit: contain;

    cursor: pointer;
    transition: .2s all ease;

    &:hover {
      scale: 1.1;
    }
  }
}
</style>


<style>
dialog.thumbnail-full {
  margin: auto;
  display: flex;

  .close {
    position: fixed;
    right: 1rem;
    top: 1rem;
    background: var(--color-background);
  }
}
</style>
