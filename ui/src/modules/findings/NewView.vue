<script setup lang="ts">
import { onMounted } from 'vue';
import { useFindings } from "@/modules/findings/useFindings.ts";
import {useRoute, useRouter} from "vue-router";
import Chip from "@/components/Chip.vue";
import {useAuth} from "@/composables/useAuth.ts";

const route = useRoute();
const router = useRouter();

const {
  hasPrivilege
} = useAuth();

const {
  finding,
  projectUsers,
  loadNewFinding,
  createFinding,
} = useFindings();

onMounted(() => {
  loadNewFinding(route.params.pid as string);
});

async function save(reload: boolean = false) {
  await createFinding();
  if (reload) {
    await loadNewFinding(route.params.pid as string);
  } else {
    router.push(`/project/${finding.value.projectId}/findings/${finding.value.id}`);
  }
}
</script>


<template>
  <form @submit.prevent="save(false)">
  <section class="sticky">
    <div>
      <RouterLink :to="{ path: '/project/' + route.params.pid}">Project: {{finding.project?.title}}</RouterLink>
      <h1>New Finding</h1>
    </div>
    <button>Save</button>
    <button role="button" @click="save(true)">New Finding</button>
  </section>
    <div>
      <input style="font-size: 2rem" type="text" placeholder="Title" v-model="finding.title" />
    </div>
    <div>
      <label>Description</label>
      <textarea type="text" placeholder="Description" v-model="finding.description"></textarea>
    </div>
    <div v-if="hasPrivilege('ratingEdit', finding?.project)">
      <label>Personal Rating</label>
      <select v-model="finding.personalRating">
        <option value="">-</option>
        <option v-for="h in finding.project?.ratingset.ratings" :value="h.id"><Chip :chip="h"/></option>
      </select>
    </div>
    <div v-if="hasPrivilege('manager', finding?.project)">
      <label>Final Rating</label>
      <select v-model="finding.ratingId" name="ratingId">
        <option>-</option>
        <option v-for="r in finding.project?.ratingset.ratings" :value="r.id"><Chip :chip="r"/></option>
      </select>
    </div>
    <div v-if="projectUsers.length && hasPrivilege('manager', finding?.project)">
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
  </form>
</template>
