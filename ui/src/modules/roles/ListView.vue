<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoles } from "@/modules/roles/useRoles.ts";
import IconSave from "@/components/icons/IconSave.vue";
import IconAdd from "@/components/icons/IconAdd.vue";
import IconRemove from "@/components/icons/IconRemove.vue";
import {useEdit} from "@/composables/useEdit.ts";

const {
  roles,
  loadRoles,
  saveRoles,
  addRole,
  removeRole,
} = useRoles();

onMounted(() => {
  loadRoles();
});

async function save() {
  await saveRoles();
  edited.value = false;
}

const { edited } = useEdit();
</script>


<template>
  <h1>Roles</h1>

  <p>
    The role defines a user's system wide privileges. For privileges of members within in project,
    see <RouterLink :to="{name: 'StatusList'}">statuses</RouterLink>.
  </p>

  <form @submit.prevent="save" @input="edited = true">
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <td rowspan="2">Title</td>
            <td colspan="3">User</td>
            <td colspan="4">Project</td>
            <td colspan="2">Heuristic Sets</td>
            <td colspan="2">Rating Sets</td>
            <td>Statuses</td>
            <td>Roles</td>
            <td rowspan="2">Remove</td>
          </tr>
          <tr>
            <td>Add</td>
            <td>Roles to Add</td>
            <td>Edit All</td>
            <td>Add</td>
            <td>View All</td>
            <td>Edit All</td>
            <td>Hide Personal</td>
            <td>Add + Edit All</td>
            <td>Add + Edit Own</td>
            <td>Add + Edit All</td>
            <td>Add + Edit Own</td>
            <td>Add + Edit</td>
            <td>Add + Edit</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="role in roles" :key="role.id">
            <td><input v-model="role.title"/></td>
            <td><input type="checkbox" v-model="role.userAdd" title="Add Users"></td>
            <td>
              <select v-model="role.userEditRoleIds" multiple :disabled="!role.userAdd || role.userEditAll">
                <option v-for="ri in roles" :value="ri.id">{{ri.title}}</option>
              </select>
            </td>
            <td><input type="checkbox" v-model="role.userEditAll"></td>
            <td><input type="checkbox" v-model="role.projectAdd"></td>
            <td><input type="checkbox" v-model="role.projectViewAll"></td>
            <td><input type="checkbox" v-model="role.projectEditAll"></td>
            <td><input type="checkbox" v-model="role.projectHidePersonal"></td>
            <td><input type="checkbox" v-model="role.heuristicSetEditAll"></td>
            <td><input type="checkbox" v-model="role.heuristicSetEditOwn"></td>
            <td><input type="checkbox" v-model="role.ratingSetEditAll"></td>
            <td><input type="checkbox" v-model="role.ratingSetEditOwn"></td>
            <td><input type="checkbox" v-model="role.statusEdit"></td>
            <td><input type="checkbox" v-model="role.roleEdit"></td>
            <td>
              <button type="button" @click="removeRole(role.id)"><IconRemove class="icon icon-only"/></button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <button type="button" @click="addRole"><IconAdd class="icon"/> Add Role</button>
    <button :disabled="!edited"><IconSave class="icon"/> Save</button>
  </form>
</template>


<style scoped>
table {
  border-collapse: collapse;
  margin-top: 2rem;

  thead tr, tbody {
    border-width: 1px 0;
    border-style: solid;
    border-color: var(--color-border);
  }

  td {
    min-width: 2.5rem;
    padding: .2rem;
    border-width: 0 1px;
    border-style: solid;
    border-color: var(--color-border);
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

    tr:nth-child(2) {
      font-size: .75rem;
    }
  }

  select {
    min-width: 9rem;
    min-height: 0;
    padding: 0;
    overflow: auto;
  }

  td:not(:first-child) {
    text-align: center;
  }

  button {
    margin: 0;
    font-size: 1rem;
  }
}
</style>
