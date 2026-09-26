<script setup lang="ts">
import { onMounted } from 'vue';
import { useFindings } from "@/modules/findings/useFindings.ts";
import {useRoute} from "vue-router";
import Chip from "@/components/Chip.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import Thumbnails from "@/components/Thumbnails.vue";
import IconEdit from "@/components/icons/IconEdit.vue";
import IconRate from "@/components/icons/IconRate.vue";

const route = useRoute();

const {
  finding,
  loadFinding,
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
    <RouterLink class="button" :to="{ path: `${route.path}/edit`}"><IconEdit class="icon"/> Edit</RouterLink>
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
      <label>My Rating:</label>
      <span v-if="finding.userRating?.rating"><Chip :chip="finding.userRating.rating"/></span>
      <span v-else>Not yet rated</span>
    </p>
  </div>
  <div class="col-9">
  <label>Description:</label>
  <p>{{ finding.description }}</p>

  <label>Images and Videos</label>
  <Thumbnails :images="finding.images"/>
  </div>
  </div>

  <RouterLink class="button" :to="{ name: 'FindingsRate', params: {id: route.params.id} }"><IconRate class="icon"/> Rate</RouterLink>
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
