<script setup lang="ts">
import {ref} from "vue";
import {RouterLink} from "vue-router";
import {useAuth} from "@/composables/useAuth.ts";
import IconProject from "@/components/icons/IconProject.vue";
import IconLogout from "@/components/icons/IconLogout.vue";
import IconUser from "@/components/icons/IconUser.vue";

const { user, logout } = useAuth();

const open = ref<boolean>(false);
</script>


<template>
  <details :open="open" @mouseenter="open = true" @mouseleave="open = false">
    <summary>{{ user.firstname }} {{user.lastname}}</summary>

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
</template>


<style scoped>
summary {
  anchor-name: --user-menu-button;
}

section {
  position: absolute;
  position-anchor: --user-menu-button;
  position-area: top;
  top: anchor(bottom);
  z-index: 2;

  background-color: var(--color-background-soft);
  color: var(--color-text);

  border-radius: .5rem;
  border: 1px solid var(--color-text);

  padding: .75rem;
  margin: 0 .5rem;
  font-size: 1rem;
}

ul {
  list-style-type: none;
  padding: 0;

  li {
    margin-bottom: .25rem;
  }

  a {
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
}
</style>
