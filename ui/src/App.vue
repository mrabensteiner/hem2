<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuth } from "@/composables/useAuth.ts";

const { isAuthenticated, hasPrivilege, user, logout } = useAuth();
</script>

<template>
  <header>
    <a class="logo" href="/">
      HEM2
    </a>

    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink v-if="isAuthenticated" to="/projects">Projects</RouterLink>
      <RouterLink v-if="hasPrivilege('userEdit')" to="/users">Users</RouterLink>
      <RouterLink v-if="hasPrivilege('roleEdit')" to="/roles">Roles</RouterLink>
      <RouterLink v-if="hasPrivilege('statusEdit')" to="/statuses">Statuses</RouterLink>
      <RouterLink v-if="hasPrivilege('heuristicSetEdit')" to="/heuristics">Heuristics</RouterLink>
      <RouterLink v-if="hasPrivilege('ratingSetEdit')" to="/ratings">Ratings</RouterLink>
    </nav>
    <nav class="user">
      <RouterLink v-if="!isAuthenticated" to="/login">Login</RouterLink>
      <div v-if="user" class="hello">
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
