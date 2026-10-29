<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
import { useAuth } from "@/composables/useAuth.ts";
import Toast from "@/components/Toast.vue";
import Sidebar from "@/components/Sidebar.vue";
import Version from "@/components/Version.vue";
import UserMenu from "@/components/UserMenu.vue";

const { isAuthenticated, user } = useAuth();
</script>

<template>
  <header>
    <a class="logo" href="/">
      HEM2
    </a>
    <nav class="user">
      <!-- TODO: user menu -->
      <RouterLink v-if="!isAuthenticated" to="/login">Login</RouterLink>
      <UserMenu v-if="user"/>
    </nav>
  </header>
  <div class="container">
    <Sidebar v-if="isAuthenticated"/>
    <main>
      <RouterView />
      <Toast/>
    </main>
  </div>
  <footer>Martin Rabensteiner 2026 <Version/></footer>
</template>
