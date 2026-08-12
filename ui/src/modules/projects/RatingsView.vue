<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProjectDetail } from './useProjectDetail.ts';

const route = useRoute();

const {
  project,
  findings,
  members,
  users,
  prepareRatingsForTable,
  loadProject
} = useProjectDetail();

onMounted(() => {
  loadProject(route.params.id as string).then(() => prepareRatingsForTable());
});
</script>

<template>
  <RouterLink :to="{ path: '/project/' + route.params.pid}">Project: {{project?.title}}</RouterLink>
  <h1>Ratings Overview: {{ project.title }}</h1>
  <hr/>
  <table>
    <tr>
      <th>Title</th>
      <th v-for="m in members">{{users.find(u => u.id == m).lastname}}</th>
      <th>Calculated (AVG)</th>
      <th>Aggregated</th>
    </tr>
    <tr v-for="f in findings">
      <td><RouterLink :to="'./findings/' + f.id" >{{f.title}}</RouterLink></td>
      <td v-for="r in f.rpu" :title="r.title">{{r.value}}</td>
      <td>{{f.totalRating}}</td>
      <td>{{f.rating.title}}</td>
    </tr>
  </table>
</template>
