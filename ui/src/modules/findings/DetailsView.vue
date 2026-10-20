<script setup lang="ts">
import {onMounted, watch} from 'vue';
import { useFindings } from "@/modules/findings/useFindings.ts";
import {useRoute} from "vue-router";
import Chip from "@/components/Chip.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import Thumbnails from "@/components/Thumbnails.vue";
import IconEdit from "@/components/icons/IconEdit.vue";
import IconRate from "@/components/icons/IconRate.vue";
import {useAuth} from "@/composables/useAuth.ts";

const route = useRoute();

const {
  hasPrivilege
} = useAuth()

const {
  finding,
  loadFinding,
} = useFindings();

onMounted(() => {
  loadFinding(route.params.id as string);
});

watch(
  () => route.params.id,
  (id) => {
    if (id != finding.value.id) {
      loadFinding(id as string);
    }
  }
);
</script>


<template>
  <section class="sticky">
    <div>
      <RouterLink :to="{ path: '/project/' + route.params.pid}">Project: {{finding.project?.title}}</RouterLink>
      <h1>Finding: {{ finding.title }}</h1>
    </div>
    <RouterLink class="button" v-if="hasPrivilege('findingEditOwn', finding.project)" :to="{ name: 'FindingsEdit' }"><IconEdit class="icon"/> Edit</RouterLink>
  </section>

  <div class="row">
  <div class="col-3">

    <label>Images and Videos</label>
    <Thumbnails :images="finding.images"/>

    <p>
      <label>Overall Rating:</label>
      <span v-if="finding.rating"><Chip :chip="finding.rating"/></span>
      <span v-else>Not yet rated</span>
    </p>

    <p>
      <label>My Rating:</label>
      <span v-if="finding.userRating?.rating"><Chip :chip="finding.userRating.rating"/></span>
      <span v-else>Not yet rated</span>
    </p>
  </div>
  <div class="col-9">
    <div>
      <label>Reviewer(s):</label>
      <span>{{finding.user?.map(u => [u.firstname, u.lastname].join(" ")).join(", ")}}</span>
    </div>
    <div>
      <label>Heuristics(s):</label>
      <template v-for="h in finding.heuristics" :key="h.id">
        <Chip :chip="h" />
      </template>
    </div>
    <div>
      <label>Last Update:</label>
      <span><TimeAgo :date="finding.updatedat"/></span>
    </div>
  <label>Description:</label>
  <p>{{ finding.description }}</p>

    <label>Remarks or Recommendations:</label>
    <p>{{ finding.remarks }}</p>

    <div v-if="finding.mergedToId">
      <label>Merged To:</label>
      <RouterLink :to="{ params: {id: finding.mergedTo.id} }">{{finding.mergedTo.title}}</RouterLink>
    </div>

    <div v-if="finding.mergedFrom?.length">
      <label>Merged from:</label>
      <template v-for="(f,i) in finding.mergedFrom">
        <RouterLink :to="{ params: {id: f.id} }">
          {{f.title}}
        </RouterLink>
        <template v-if="i + 1 < finding.mergedFrom?.length">, </template>
      </template>
    </div>
  </div>
  </div>

  <RouterLink class="button" v-if="hasPrivilege('ratingEdit', finding.project)" :to="{ name: 'FindingsRate', params: {id: route.params.id, return: 'FindingsView'} }"><IconRate class="icon"/> Rate</RouterLink>
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

div {
  margin-bottom: 1rem;
}
</style>
