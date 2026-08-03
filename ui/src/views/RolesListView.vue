<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {useRolesList} from "@/composables/useRolesList.ts";
import Message from "@/components/Message.vue";

const route = useRoute();

const {
  roles,
  loadRoles,
  saveRoles,
  addRole,
  removeRole,
  success,
  error
} = useRolesList();

onMounted(() => {
  loadRoles();
});

async function save() {
  await saveRoles();
}
</script>


<template>
  <h1>Roles</h1>
  <form @submit.prevent="save">
    <table class="table">
      <thead>
        <tr>
          <td rowspan="2">Title</td>
          <td colspan="2">User</td>
          <td colspan="3">Project</td>
          <td>Heuristic Sets</td>
          <td>Rating Sets</td>
          <td>Statuses</td>
          <td>Roles</td>
          <td rowspan="2">Remove</td>
        </tr>
        <tr>
          <td>Add</td>
          <td>Edit All</td>
          <td>Add</td>
          <td>View All</td>
          <td>Edit All</td>
          <td>Add + Edit</td>
          <td>Add + Edit</td>
          <td>Add + Edit</td>
          <td>Add + Edit</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="role in roles" :key="role.id">
          <td><input v-model="role.title"/></td>
          <td><input type="checkbox" v-model="role.userAdd" title="Add Users"></td>
          <td><input type="checkbox" v-model="role.userEdit"></td>
          <td><input type="checkbox" v-model="role.projectAdd"></td>
          <td><input type="checkbox" v-model="role.projectViewAll"></td>
          <td><input type="checkbox" v-model="role.projectEditAll"></td>
          <td><input type="checkbox" v-model="role.heuristicSetEdit"></td>
          <td><input type="checkbox" v-model="role.ratingSetEdit"></td>
          <td><input type="checkbox" v-model="role.statusEdit"></td>
          <td><input type="checkbox" v-model="role.rolesEdit"></td>
          <td>
            <button type="button" @click="removeRole(role.id)">Remove</button></td>
        </tr>
      </tbody>
    </table>
    <button type="button" @click="addRole">Add Role</button>
    <input type="submit" value="Save"/>
    <Message :success="success" :error="error" />
  </form>
</template>


<style scoped>
table {
  width: 100%;
  border-collapse: collapse;

  td {
    padding: .2rem;
    border-width: 0 1px;
    border-style: solid;
    border-color: var(--color-text);
  }

  thead, tbody tr:nth-child(even) {
    background-color: var(--color-background-mute);
  }

  thead {
    border-bottom: 1px solid var(--color-text);
    text-align: center;

    tr:first-child td {
      font-weight: bold;
    }
  }

  td:not(:first-child) {
      text-align: center;

  }

  input {
    width: 100%;
  }

  button {
    margin: 0;
    font-size: 1rem;
  }
}
</style>
