<script setup lang="ts">
import { onMounted } from 'vue';
import Message from "@/components/Message.vue";
import {useRoute, useRouter} from "vue-router";
import {useProjectDetail} from "@/modules/projects/useProjectDetail.ts";

const route = useRoute();
const router = useRouter();

const {
  project,
  managers,
  members,
  statuses,
  heuristicSets,
  ratingSets,
  users,
  success,
  error,
  loadProject,
  saveProject
} = useProjectDetail();

onMounted(() => {
  loadProject(route.params.id as string, true);
});

async function save() {
  const project = await saveProject(true);
  router.push({ name: 'ProjectDetails', params: {id: project.id} });
}
</script>


<template>
  <h1>New Project</h1>
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
        <option v-for="h in heuristicSets" :key="h.id" :value="h.id">
          {{ h.title }}
        </option>
      </select>
    </div>

    <div>
      <label for="rating">Rating Set</label>
      <select id="rating" v-model="project.ratingsetId" required>
        <option v-for="s in ratingSets" :key="s.id" :value="s.id">
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
      <label>Reviewers</label>
      <label v-for="u in users" :key="'form-mbr-' + u.id" class="checkbox-label">
        <input type="checkbox" :value="u.id" v-model="members" :disabled="managers.includes(u.id)" />
        {{ u.firstname }} {{ u.lastname }}
      </label>
    </div>

    <input type="submit" value="Save"/>
  </form>
  <Message :success="success" :error="error" />
</template>
