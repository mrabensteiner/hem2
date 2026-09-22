<script setup lang="ts">
import TimeAgo from "@/components/TimeAgo.vue";

let version = __VERSION__;
let repository = __REPOSITORY__;
let commit = __COMMIT__;
</script>


<template>
  <template v-if="version">
    – HEM2 Version: {{version}}
  </template>
  <template v-if="commit">
    – Commit: <a target="_blank" :href="repository + '/commit/' + commit.hash">{{ commit.hash }}</a>
    (<TimeAgo :date="commit.timestamp" />)
  </template>
</template>


<style scoped>
a {
  color: var(--vt-c-white-mute);
  border-bottom: 1px solid var(--vt-c-white-mute);

  &:hover {
    color: var(--app-primary);
  }
}
abbr {
  text-decoration: none;
}
</style>
