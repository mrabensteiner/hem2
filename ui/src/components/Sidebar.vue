<script setup lang="ts">
import {RouterLink, useRoute} from "vue-router";
import {useAuth} from "@/composables/useAuth.ts";
import {useProjects} from "@/modules/projects/useProjects.ts";

const route = useRoute();
const { active } = defineProps<{
  active: boolean;
}>();

const { user, isAuthenticated, hasPrivilege, logout } = useAuth();
const { project } = useProjects();
</script>


<template>
  <aside class="sidebar" :class="active ? '' : 'hidden'">
    <details v-if="route.meta.context == 'project'" class="project" open>
      <summary>
        Project: {{project.title}}
      </summary>
      <section>
        <img v-if="project.logo" :alt="project.logo.title" :src="'http://localhost:3000/'+project.logo.path"/>
        <ul>
          <li><RouterLink :to="'/project/' + project.id">Project Overview</RouterLink></li>
          <li><RouterLink :to="'/project/' + project.id + '/edit'">Edit Project</RouterLink></li>
          <li><RouterLink :to="'/project/' + project.id + '/findings/new'">New Finding</RouterLink></li>
          <li><RouterLink :to="'/project/' + project.id + '/findings/rate'">Rate</RouterLink></li>
          <li><RouterLink :to="'/project/' + project.id + '/ratings'">Rating Overview</RouterLink></li>
          <li><RouterLink :to="'/project/' + project.id + '/findings/merge'">Merge</RouterLink></li>
        </ul>
      </section>
    </details>
    <details>
      <summary>System Settings</summary>
      <section>
        <ul>
          <li><RouterLink v-if="isAuthenticated" to="/projects">All Projects</RouterLink></li>
          <li><RouterLink v-if="hasPrivilege('userEdit')" to="/users">Users</RouterLink></li>
          <li><RouterLink v-if="hasPrivilege('roleEdit')" to="/roles">Roles</RouterLink></li>
          <li><RouterLink v-if="hasPrivilege('statusEdit')" to="/statuses">Statuses</RouterLink></li>
          <li><RouterLink v-if="hasPrivilege('heuristicSetEdit')" to="/heuristics">Heuristics</RouterLink></li>
          <li><RouterLink v-if="hasPrivilege('ratingSetEdit')" to="/ratings">Ratings</RouterLink></li>
        </ul>
      </section>
    </details>
    <details v-if="isAuthenticated && user">
      <summary>{{ user.firstname }} {{ user.lastname }}</summary>
      <section>
        <ul>
          <li><RouterLink :to="'/users/' + user.id">My Acount</RouterLink></li>
          <li><RouterLink to="/projects">My Projects</RouterLink></li>
          <li><a @click="logout">Logout</a></li>
        </ul>
      </section>
    </details>
  </aside>
</template>


<style scoped>
a.router-link-active {
  text-decoration: underline;
}

aside {
  transition: all .3s ease;

  &.hidden {
    padding: 1rem 0;
    flex: 0;
    translate: -100%;
  }
}

details {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1rem;
  transition: all .3s ease;

  summary {
    background-color: var(--color-background-mute);
    margin: -1rem;
    padding: 1rem;
    border-radius: 1rem;
    outline: 1px solid var(--color-border);
    cursor: pointer;
  }

  &[open] summary {
    margin-bottom: 1rem;
  }
}
</style>
