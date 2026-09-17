<script setup lang="ts">
import { onMounted } from 'vue';
import { useStatuses } from "@/modules/statuses/useStatuses.ts";
import IconSave from "@/components/icons/IconSave.vue";
import IconAdd from "@/components/icons/IconAdd.vue";
import IconRemove from "@/components/icons/IconRemove.vue";
import {useEdit} from "@/composables/useEdit.ts";

const {
  statuses,
  loadStatuses,
  saveStatuses,
  addStatus,
  removeStatus,
} = useStatuses();

onMounted(() => {
  loadStatuses();
});

async function save() {
  await saveStatuses();
  edited.value = false;
}

const { edited } = useEdit();
</script>


<template>
  <h1>Statuses</h1>

  <p>The status defines the privileges of project members during a project state.
    Disabled privileges or not shown or blocked for project members. This restrictions do not apply
    to project managers and system administrators, as defined in their user
    <RouterLink :to="{name: 'RolesList'}">roles</RouterLink>.
  </p>

  <form @submit.prevent="save" @input="edited = true">
    <table class="table">
      <thead>
        <tr>
          <td rowspan="2">Title</td>
          <td>Project</td>
          <td colspan="5">Findings</td>
          <td>Rating</td>
          <td rowspan="2">Remove</td>
        </tr>
        <tr>
          <td>View Details</td>
          <td>Add</td>
          <td>View Own</td>
          <td>View All</td>
          <td>Edit Own</td>
          <td>Edit All</td>
          <td>Edit Own</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="status in statuses" :key="status.id">
          <td><input v-model="status.title"/></td>
          <td><input type="checkbox" v-model="status.projectViewDetails"></td>
          <td><input type="checkbox" v-model="status.findingsAdd"></td>
          <td><input type="checkbox" v-model="status.findingsViewOwn"></td>
          <td><input type="checkbox" v-model="status.findingsViewAll"></td>
          <td><input type="checkbox" v-model="status.findingsEditOwn"></td>
          <td><input type="checkbox" v-model="status.findingsEditAll"></td>
          <td><input type="checkbox" v-model="status.ratingEdit"></td>
          <td>
            <button type="button" @click="removeStatus(status.id)"><IconRemove class="icon"/> Remove</button></td>
        </tr>
      </tbody>
    </table>
    <button type="button" @click="addStatus"><IconAdd class="icon"/> Add Status</button>
    <button :disabled="!edited"><IconSave class="icon"/> Save</button>
  </form>
</template>


<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;

  thead tr, tbody {
    border-width: 1px 0;
    border-style: solid;
    border-color: var(--color-border);
  }

  td {
    padding: .2rem;
    border-width: 0 1px;
    border-style: solid;
    border-color: var(--color-border);
  }

  thead, tbody tr:nth-child(even) {
    background-color: var(--color-background-mute);
  }

  thead {
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
