<script setup lang="ts">
import { onMounted } from 'vue';
import { useFindings } from "@/modules/findings/useFindings.ts";
import Message from "@/components/Message.vue";
import {useRoute, useRouter} from "vue-router";
import Chip from "@/components/Chip.vue";

const route = useRoute();
const router = useRouter();

const {
  finding,
  projectUsers,
  loadNewFinding,
  createFinding,
  success,
  error
} = useFindings();

onMounted(() => {
  loadNewFinding(route.params.pid as string);
});

async function save(reload: boolean = false) {
  await createFinding();
  if (reload) {
    const tmpSuccess = success.value;
    await loadNewFinding(route.params.pid as string);
    success.value = tmpSuccess;
  } else {
    router.push(`/project/${finding.value.projectId}/findings/${finding.value.id}`);
  }
}
</script>


<template>
  <RouterLink :to="{ path: '/project/' + route.params.pid}">Project: {{finding.project?.title}}</RouterLink>
  <h1>New Finding</h1>
  <form @submit.prevent="save(false)">
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
    <div v-if="projectUsers.length">
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
    <a class="button" @click="save(true)">New Finding</a>
  </form>
  <Message :success="success" :error="error" />
</template>
