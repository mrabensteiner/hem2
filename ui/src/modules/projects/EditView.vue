<script setup lang="ts">
import { onMounted } from 'vue';
import { useFindings } from "@/modules/findings/useFindings.ts";
import Message from "@/components/Message.vue";
import {useRoute, useRouter} from "vue-router";
import Chip from "@/components/Chip.vue";
import {useProjectDetail} from "@/modules/projects/useProjectDetail.ts";

const route = useRoute();
const router = useRouter();

const {
  project,
  managers,
  members,
  statuses,
  heuristics,
  ratings,
  users,
  success,
  error,
  loadProject,
  saveProject
} = useProjectDetail();

onMounted(() => {
  loadProject(route.params.id as string);
});

async function save() {
  await saveProject();
  router.push({ name: 'ProjectDetails', params: {id: route.params.id} });
}
</script>


<template>
  <h1>Edit Project <RouterLink :to="{ name: 'ProjectDetails', params: {id: route.params.pid, id: route.params.id} }">Cancel Edit</RouterLink></h1>
  <form @submit.prevent="save">
    <div>
      <label>Title</label>
      <input type="text" placeholder="Title" v-model="project.title" />
    </div>

    <div>
      <label>Description</label>
      <textarea type="text" placeholder="Description" v-model="project.description"></textarea>
    </div>

    <div>
      <label for="status">Status</label>
      <select id="status" v-model="project.statusId" required>
        <option v-for="status in statuses" :key="status.id" :value="status.id">
          {{ status.title }}
        </option>
      </select>
    </div>

    <div>
      <label for="heuristic">Heuristic Set</label>
      <select id="heuristic" v-model="project.heuristicsetId" required>
        <option v-for="h in heuristics" :key="h.id" :value="h.id">
          {{ h.title }}
        </option>
      </select>
    </div>

    <div>
      <label for="rating">Rating Set</label>
      <select id="rating" v-model="project.ratingsetId" required>
        <option v-for="s in ratings" :key="s.id" :value="s.id">
          {{ s.title }}
        </option>
      </select>
    </div>

    <div>
      <label>Managers</label>
      <div class="checkbox-group">
        <label v-for="u in users" :key="'form-mgr-' + u.id" class="checkbox-label">
          <input type="checkbox" :value="u.id" v-model="managers" />
          {{ u.firstname }} {{ u.lastname }}
        </label>
      </div>
    </div>

    <div>
      <label>Members</label>
      <label v-for="u in users" :key="'form-mbr-' + u.id" class="checkbox-label">
        <input type="checkbox" :value="u.id" v-model="members" :disabled="managers.includes(u.id)" />
        {{ u.firstname }} {{ u.lastname }}
      </label>
    </div>

    <input type="submit" value="Save"/>
  </form>
  <Message :success="success" :error="error" />
</template>
