<script setup lang="ts">
import {onMounted, ref} from 'vue';
import Message from "@/components/Message.vue";
import {useRoute, useRouter} from "vue-router";
import {useProjectDetail} from "@/modules/projects/useProjectDetail.ts";
import IconSave from "@/components/icons/IconSave.vue";
import ChipSearch from "@/components/ChipSearch.vue";

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
  loadProject(route.params.id as string);
});

async function save() {
  await saveProject();
  router.push({ name: 'ProjectDetails', params: {id: route.params.id} });
}

const edited = ref<boolean>(false);
</script>


<template>
  <form @submit.prevent="save" @input="edited = true">
    <section class="sticky">
      <h1>Edit Project</h1>
      <RouterLink class="button" :to="{ name: 'ProjectDetails', params: {pid: route.params.pid, id: route.params.id} }">Cancel</RouterLink>
      <button role="submit" :disabled="!edited"><IconSave class="icon"/> Save</button>
    </section>

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
      <ChipSearch prefix="managers" v-model="managers" :users="users" />
    </div>

    <div>
      <label>Reviewers</label>
      <ChipSearch prefix="members" v-model="members" :users="users" />
    </div>
  </form>
  <Message :success="success" :error="error" />
</template>
