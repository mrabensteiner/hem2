<script setup lang="ts">
import { onMounted } from 'vue';
import { useFindings } from "@/modules/findings/useFindings.ts";
import Message from "@/components/Message.vue";
import {useRoute} from "vue-router";
import Chip from "@/components/Chip.vue";

const route = useRoute();

const {
  finding,
  loadFinding,
  success,
  error
} = useFindings();

onMounted(() => {
  loadFinding(route.params.id as string);
});
</script>


<template>
  <RouterLink :to="{ path: '/project/' + route.params.pid}">Project: {{finding.project?.title}}</RouterLink>
  <h1>Finding: {{ finding.title }}  <RouterLink :to="{ path: `${route.path}/edit`}">Edit</RouterLink></h1>

  <hr/>
  <p><label>Reviewer(s):</label>
    <span>{{finding.user?.map(u => [u.firstname, u.lastname].join(" ")).join(", ")}}</span>
  </p>
  <p><label>Heuristics(s):</label>
    <template v-for="h in finding.heuristics" :key="h.id">
      <Chip :chip="h" />
    </template>
  </p>
  <hr/>
  <label>Description:</label>
  <p>{{ finding.description }}</p>

  <label>Images</label>
  <div class="thumbnails">
    <img v-for="i in finding.images" :src="'http://localhost:3000/'+i.path" width="100"/>
  </div>
  <hr/>

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
