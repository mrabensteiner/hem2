<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuth } from "@/composables/useAuth.ts";

const { isAuthenticated, user, logout } = useAuth();
</script>

<template>
  <header>
    <a class="logo" href="/">
      HEM2
    </a>

    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink v-if="isAuthenticated" to="/projects">Projects</RouterLink>
      <RouterLink v-if="isAuthenticated" to="/users">Users</RouterLink>
      <RouterLink v-if="isAuthenticated" to="/status">Status</RouterLink>
      <RouterLink v-if="isAuthenticated" to="/heuristics">Heuristics</RouterLink>
    </nav>
    <nav class="user">
      <RouterLink v-if="!isAuthenticated" to="/login">Login</RouterLink>
      <div v-if="user">
        Hello, {{user.firstname}} {{user.lastname}}!
      </div>
      <a v-if="isAuthenticated" @click="logout">Logout</a>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
  <footer>Martin Rabensteiner 2026</footer>
</template>
