<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProjects } from './useProjects.ts';
import IconTable from "@/components/icons/IconTable.vue";
import {useFindings} from "@/modules/findings/useFindings.ts";
import IconSave from "@/components/icons/IconSave.vue";

const route = useRoute();

const {
  project,
  findings,
  members,
  users,
  prepareRatingsForTable,
  loadProject,
  useCalculatedRating
} = useProjects();

const {
  allFindings,
  saveAllFindings
} = useFindings();

onMounted(() => {
  loadProject(route.params.id as string).then(() => prepareRatingsForTable());
});

function save() {
  allFindings.value = project.value.Findings.map(f => ({
    id: f.id,
    ratingId: f.ratingId
  }))
  saveAllFindings();
}
</script>

<template>
  <form @submit.prevent="save">
    <section class="sticky">
      <div>
        <RouterLink :to="{ name: 'ProjectDetails' }">Project: {{project?.title}}</RouterLink>
        <h1>Ratings Overview: {{ project.title }}</h1>
      </div>
      <button><IconSave class="icon"/> Save</button>
    </section>
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th class="right" v-for="m in members">{{users.find(u => u.id == m).shortname}}</th>
          <th class="right">Calculated Mean</th>
          <th>Aggregated</th>
        </tr>
      </thead>
      <tbody>
      <tr v-for="f in findings">
        <td><RouterLink :to="'./findings/' + f.id" >{{f.title}}</RouterLink></td>
        <td class="right" v-for="r in f.rpu" :title="r.title">
          {{r.value}}
        </td>
        <td class="right">
          {{f.totalRating}}
          <button
            type="button"
            @click="f.ratingId = f.calculatedRatingId"
            :disabled="f.totalRating == '-' || f.ratingId == f.calculatedRatingId"
            :title="f.totalRating == '-' ? 'No calculated value' : f.ratingId == f.calculatedRatingId ? 'Aggregated rating is the same as calculated.' : 'Take the calculated value.'">
            <IconTable class="icon"/> >>
          </button>
        </td>
        <td>
          <select class="flex-1" v-model="f.ratingId">
            <option :value="null">None</option>
            <option v-for="r in project.ratingset.ratings" :value="r.id">{{r.title}} ({{r.value}})</option>
          </select>
        </td>
      </tr>
      </tbody>
    </table>
  </form>
</template>

<style scoped>
table {
  border-collapse: collapse;
  margin-top: 2rem;
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
