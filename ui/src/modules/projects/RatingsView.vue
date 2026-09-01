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
  <RouterLink :to="{ name: 'ProjectDetails' }">Project: {{project?.title}}</RouterLink>
  <h1>Ratings Overview: {{ project.title }}</h1>
  <hr/>
  <table>
    <thead>
      <tr>
        <th>Title</th>
        <th class="right" v-for="m in members">{{users.find(u => u.id == m).lastname}}</th>
        <th class="right">Calculated (AVG)</th>
        <th>Aggregated</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="f in findings">
        <td><RouterLink :to="'./findings/' + f.id" >{{f.title}}</RouterLink></td>
        <td class="right" v-for="r in f.rpu" :title="r.title">{{r.value}}</td>
        <td class="right">{{f.totalRating}}</td>
        <td>
          <select disabled>
            <option>{{f.rating?.title}}</option>
          </select>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table {
  border-collapse: collapse;
  margin-top: 1rem;
  width: 100%;
}

th, td {
  text-align: left;
  padding: .2rem;
  border-width: .1rem;
  border-style: solid;
  border-color: var(--color-border);
}

th.right, td.right {
  text-align: right;
}

tbody tr:nth-child(odd) {
  background-color: var(--color-background-soft);
}
</style>
