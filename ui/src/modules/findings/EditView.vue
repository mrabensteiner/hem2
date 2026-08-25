<script setup lang="ts">
import { onMounted } from 'vue';
import { useFindings } from "@/modules/findings/useFindings.ts";
import Message from "@/components/Message.vue";
import {useRoute} from "vue-router";
import Chip from "@/components/Chip.vue";

const route = useRoute();

const {
  finding,
  images,
  projectUsers,
  loadFinding,
  saveFinding,
  uploadImages,
  success,
  error
} = useFindings();

onMounted(() => {
  loadFinding(route.params.id as string, true);
});

async function save() {
  await saveFinding();
}

const uploadImagesHandler = async (event: Event) => {
  const input = event.target as HTMLInputElement;

  if (!input.files) return;

  const formData = new FormData();

  for (const file of input.files) {
    formData.append("image", file);
  }

  await uploadImages(formData);
  input.value = "";
};
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
        <option>-</option>
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
    <div>
      <label>Images</label><br/>
      <input type="file" @change="uploadImagesHandler" multiple accept="image/png, image/jpeg, image/gif">
      <div class="thumbnails">
        <img v-for="i in images" :alt="i.title" :src="'http://localhost:3000/'+i.path" width="100"/>
      </div>
    </div>
    <input type="submit" value="Save"/>
  </form>
  <Message :success="success" :error="error" />
</template>
