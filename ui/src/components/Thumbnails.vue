<script setup lang="ts">
import Thumbnail from "@/components/Thumbnail.vue";

defineProps<{
  images: any[];
}>();
</script>


<template>
  <div>
    <Thumbnail v-for="(img, i) in images" :image="img" :prev="images[i-1]" :next="images[i+1]"/>
  </div>
</template>

<style scoped>
div {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;

  > div {
    &:first-child {
      width: 20rem;
      height: 100%;
    }
  }
}
</style>
