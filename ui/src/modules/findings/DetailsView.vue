<script setup lang="ts">
import { onMounted } from 'vue';
import { useFindings } from "@/modules/findings/useFindings.ts";
import Message from "@/components/Message.vue";
import {useRoute} from "vue-router";
import Chip from "@/components/Chip.vue";
import TimeAgo from "@/components/TimeAgo.vue";

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
  <section class="sticky">
    <div>
      <RouterLink :to="{ path: '/project/' + route.params.pid}">Project: {{finding.project?.title}}</RouterLink>
      <h1>Finding: {{ finding.title }}</h1>
    </div>
    <RouterLink class="button" :to="{ path: `${route.path}/edit`}">Edit</RouterLink>
  </section>

  <div class="row">
  <div class="col-3">
  <p><label>Reviewer(s):</label>
    <span>{{finding.user?.map(u => [u.firstname, u.lastname].join(" ")).join(", ")}}</span>
  </p>
  <p><label>Heuristics(s):</label>
    <template v-for="h in finding.heuristics" :key="h.id">
      <Chip :chip="h" />
    </template>
  </p>
    <p><label>Last Update:</label>
      <span><TimeAgo :date="finding.updatedat"/></span>
    </p>
    <p>
      <label>Personal Rating:</label>
      <span v-if="finding.userRating?.rating"><Chip :chip="finding.userRating.rating"/></span>
      <span v-else>Not rated</span>
    </p>
  </div>
  <div class="col-9">
  <label>Description:</label>
  <p>{{ finding.description }}</p>

  <label>Images</label>
  <div class="thumbnails">
    <img v-for="i in finding.images" :src="'http://localhost:3000/'+i.path" width="100"/>
  </div>
  </div>
  </div>

  <RouterLink class="button" :to="{ name: 'FindingsRate', params: {id: route.params.id} }">Rate</RouterLink>

  <Message :success="success" :error="error" />
</template>

<style scoped>
.row {
  display: flex;
}
.col-3 {
  width: 33%;
}
.col-9 {
  width: 66%;
}
</style>
