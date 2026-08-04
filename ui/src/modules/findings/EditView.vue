<script setup lang="ts">
import { onMounted } from 'vue';
import { useFindings } from "@/modules/findings/useFindings.ts";
import Message from "@/components/Message.vue";
import {useRoute} from "vue-router";
import Chip from "@/components/Chip.vue";

const route = useRoute();

const {
  finding,
  projectUsers,
  loadFinding,
  saveFinding,
  success,
  error
} = useFindings();

onMounted(() => {
  loadFinding(route.params.id as string, true);
});

async function save() {
  await saveFinding();
}
</script>


<template>
  <RouterLink :to="{ path: '/project/' + route.params.pid}">Project: {{finding.project?.title}}</RouterLink>
  <h1>Edit Finding: {{ finding.title }} <RouterLink :to="{ name: 'FindingsDetails', params: {pid: route.params.pid, id: route.params.id} }">Cancel Edit</RouterLink></h1>
  <form @submit.prevent="save">
    <div>
      <label>Title</label>
      <input type="text" placeholder="Title" v-model="finding.title" />
    </div>
    <div>
      <label>Description</label>
      <textarea type="text" placeholder="Description" v-model="finding.description"></textarea>
    </div>
    <div>
      <label>Rating</label>
      <select v-model="finding.ratingId" name="ratingId">
        <option v-for="h in finding.project?.ratingset.ratings" :value="h.id"><Chip :chip="h"/></option>
      </select>
    </div>
    <div>
      <label>Authors</label><br/>
      <select v-model="finding.user" multiple>
        <option v-for="u in projectUsers" :key="u.id" type="checkbox" name="authors" :value="u.id" >
          {{u.firstname}} {{u.lastname}}</option>
      </select>
    </div>
    <div>
      <label>Heuristics</label><br/>
      <select v-model="finding.heuristics" multiple>
        <option v-for="h in finding.project?.heuristicset.heuristics" :key="h.id" type="checkbox" name="authors" :value="h.id" >
          {{h.title}}</option>
      </select>
    </div>
    <input type="submit" value="Save"/>
    <RouterLink :to="{ path: '/project/' + route.params.pid + '/finding/new'}" class="button">New Finding</RouterLink>
  </form>
  <Message :success="success" :error="error" />
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
