<script setup lang="ts">
import {RouterLink, useRoute} from "vue-router";
import {useAuth} from "@/composables/useAuth.ts";
import {useProjects} from "@/modules/projects/useProjects.ts";
import IconAdd from "@/components/icons/IconAdd.vue";
import IconEdit from "@/components/icons/IconEdit.vue";
import IconRate from "@/components/icons/IconRate.vue";
import IconTable from "@/components/icons/IconTable.vue";
import IconMerge from "@/components/icons/IconMerge.vue";
import IconProject from "@/components/icons/IconProject.vue";
import IconSettings from "@/components/icons/IconSettings.vue";
import IconLogout from "@/components/icons/IconLogout.vue";
import IconUser from "@/components/icons/IconUser.vue";

const route = useRoute();
const { active } = defineProps<{
  active: boolean;
}>();

const { user, isAuthenticated, hasPrivilege, logout } = useAuth();
const { project, prevStatus, nextStatus } = useProjects();
</script>


<template>
  <aside class="sidebar" :class="active ? '' : 'hidden'">
    <details v-if="route.meta.context == 'project' && project.id" class="project" open>
      <summary>
        Project:<br/>
        {{project.title}}
      </summary>
      <section>
        <img v-if="project.logo" :alt="project.logo.title" :src="'http://localhost:3000/'+project.logo.path"/>
        <ul>
          <li>
            <RouterLink :to="'/project/' + project.id">
              <IconProject class="icon"/>
              Project Overview
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="'/project/' + project.id + '/edit'">
              <IconEdit class="icon"/>
              Edit Project
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="'/project/' + project.id + '/findings/new'">
              <IconAdd class="icon"/>
              New Finding
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="'/project/' + project.id + '/findings/rate'">
              <IconRate class="icon"/>
              Rate
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="'/project/' + project.id + '/ratings'">
              <IconTable class="icon"/>
              Rating Overview
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="'/project/' + project.id + '/findings/merge'">
              <IconMerge class="icon"/>
              Merge
            </RouterLink>
          </li>
          <li>
            <button @click="prevStatus()" :disabled="!project.status.prev">
              <<
            </button>
            <button @click="nextStatus()" :disabled="!project.status.next">
              Next Project Status &nbsp; >>
            </button>
          </li>
        </ul>
      </section>
    </details>
    <details>
      <summary>System Settings</summary>
      <section>
        <ul>
          <li>
            <RouterLink v-if="isAuthenticated" to="/projects">
              <IconSettings class="icon"/>
              All Projects
            </RouterLink>
          </li>
          <li>
            <RouterLink v-if="hasPrivilege('userEdit')" to="/users">
              <IconSettings class="icon"/>
              Users
            </RouterLink>
          </li>
          <li>
            <RouterLink v-if="hasPrivilege('roleEdit')" to="/roles">
              <IconSettings class="icon"/>
              Roles
            </RouterLink>
          </li>
          <li>
            <RouterLink v-if="hasPrivilege('statusEdit')" to="/statuses">
              <IconSettings class="icon"/>
              Statuses
            </RouterLink>
          </li>
          <li>
            <RouterLink v-if="hasPrivilege('heuristicSetEdit')" to="/heuristics">
              <IconSettings class="icon"/>
              Heuristics
            </RouterLink>
          </li>
          <li>
            <RouterLink v-if="hasPrivilege('ratingSetEdit')" to="/ratings">
              <IconSettings class="icon"/>
              Ratings
            </RouterLink>
          </li>
        </ul>
      </section>
    </details>
    <details v-if="isAuthenticated && user" :open="route.meta.context == undefined">
      <summary>
        <img v-if="user.image" :alt="user.image.title" :src="'http://localhost:3000/'+user.image.path"/>
        {{ user.firstname }} {{ user.lastname }}
      </summary>
      <section>
        <ul>
          <li>
            <RouterLink :to="'/users/' + user.id">
              <IconUser class="icon"/>
              My Account
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/projects">
              <IconProject class="icon"/>
              My Projects
            </RouterLink>
          </li>
          <li>
            <a @click="logout">
              <IconLogout class="icon" />
              Logout
            </a>
          </li>
        </ul>
      </section>
    </details>
  </aside>
</template>


<style scoped>
aside {
  img {
    display: flex;
    max-height: 4rem;
    margin: 0 auto 1rem;
  }
}

aside ul {
  list-style-type: none;
  padding: 0;

  li {
    margin-bottom: .25rem;
  }

  a, button {
    color: var(--color-text);
    border: 1px solid var(--app-primary);
    border-radius: .25rem;
    width: 100%;
    display: block;
    padding: .5rem;

    &.router-link-active {
      background-color: rgba(var(--app-primary-rgb), 0.1);
    }
    .icon {
      color: var(--app-primary);
    }
  }

  li:has(button) {
    display: flex;
    gap: .5rem;
    margin-top: 1rem;

    button {
      width: auto;
      font-size: .75rem;
      font-weight: normal;
      margin: 0;
      padding: .5rem;
    }

    button:last-child {
     flex: 1 1 100%;
    }
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

    img {
      display: inline-block;
      height: 2rem;
      width: 2rem;
      margin-bottom: -.5rem;
      border-radius: 50%;
      border: 2px solid currentColor;
    }
  }

  &[open] summary {
    margin-bottom: 1rem;
  }
}
</style>
