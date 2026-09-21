<script setup lang="ts">
import {ref} from "vue";
import {RouterLink, RouterView} from 'vue-router'
import { useAuth } from "@/composables/useAuth.ts";
import Toast from "@/components/Toast.vue";
import Sidebar from "@/components/Sidebar.vue";
import IconSidebar from "@/components/icons/IconSidebar.vue";

const { isAuthenticated, user } = useAuth();
const sidebar = ref<boolean>(true);
</script>

<template>
  <header>
    <a class="logo" href="/">
      HEM2
    </a>
    <nav>
      <label class="sidebar-toggle" title="Toggle Sidebar">
        <IconSidebar class="icon"/>
        <input type="checkbox" v-model="sidebar"/>
      </label>
    </nav>
    <nav class="user">
      <RouterLink v-if="!isAuthenticated" to="/login">Login</RouterLink>
      <div v-if="user" class="hello">
        Hello, {{user.firstname}} {{user.lastname}}!
      </div>
    </nav>
  </header>
  <div class="container">
    <Sidebar v-if="isAuthenticated" :active="sidebar"/>
    <main>
      <RouterView />
      <Toast/>
    </main>
  </div>
  <footer>Martin Rabensteiner 2026</footer>
</template>

<style scoped>
.sidebar-toggle {
  transition: .2s all ease;
  cursor: pointer;

  .icon {
    display: block;
  }

  &:has(input:checked) {
    transform: rotate(180deg);
  }

  input {
    display: none;
  }
}
</style>
