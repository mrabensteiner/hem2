<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStatuses } from "@/modules/statuses/useStatuses.ts";
import Message from "@/components/Message.vue";

const route = useRoute();

const {
  statuses,
  loadStatuses,
  saveStatuses,
  addStatus,
  removeStatus,
  success,
  error
} = useStatuses();

onMounted(() => {
  loadStatuses();
});

async function save() {
  await saveStatuses();
}
</script>


<template>
  <h1>Statuses</h1>
  <form @submit.prevent="save">
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
            <button type="button" @click="removeStatus(status.id)">Remove</button></td>
        </tr>
      </tbody>
    </table>
    <button type="button" @click="addStatus">Add Status</button>
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
