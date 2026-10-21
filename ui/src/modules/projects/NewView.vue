<script setup lang="ts">
import {nextTick, onMounted} from 'vue';
import {useRoute, useRouter} from "vue-router";
import {useProjects} from "@/modules/projects/useProjects.ts";
import ChipSearch from "@/components/ChipSearch.vue";
import IconSave from "@/components/icons/IconSave.vue";

const route = useRoute();
const router = useRouter();

const {
  project,
  managers,
  members,
  newLogo,
  statuses,
  heuristicSets,
  ratingSets,
  users,
  loadProject,
  saveProject
} = useProjects();

onMounted(() => {
  loadProject(route.params.id as string, true);
});

async function save() {
  const project = await saveProject(true);
  router.push({ name: 'ProjectDetails', params: {id: project.id} });
}

const uploadImageHandler = async (event: Event) => {
  const target = (event.target as HTMLInputElement);
  const file = target ? (target.files ? target.files[0] : null) : null;

  if (!file) return;
  newLogo.value = file;
  await nextTick();

  const reader = new FileReader();
  reader.onload = (e) => {
    const image = (target.previousElementSibling as HTMLImageElement);
    image.src = (e.target?.result as string);
  }
  reader.readAsDataURL(file);
};
</script>


<template>
  <form @submit.prevent="save">
    <section class="sticky">
      <h1>New Project</h1>
      <button><IconSave class="icon"/> Save</button>
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
        <option value="" disabled>-- selection required --</option>
        <option v-for="status in statuses" :key="status.id" :value="status.id">
          {{ status.title }}
        </option>
      </select>
    </div>

    <div>
      <label for="heuristic">Heuristic Set</label>
      <select id="heuristic" v-model="project.heuristicsetId" required>
        <option value="" disabled>-- selection required --</option>
        <option v-for="h in heuristicSets" :key="h.id" :value="h.id">
          {{ h.title }}
        </option>
      </select>
    </div>

    <div>
      <label for="rating">Rating Set</label>
      <select id="rating" v-model="project.ratingsetId" required>
        <option value="" disabled>-- selection required --</option>
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

    <div>
      <label>Logo</label>
      <div>
        <img class="inline-logo" v-if="newLogo" alt="Project Logo" src=""/>
        <input type="file" @change="uploadImageHandler" accept="image/png, image/jpeg, image/gif, image/svg+xml">
      </div>
    </div>

    <button><IconSave class="icon"/> Save</button>
  </form>
</template>


<style scoped>
.inline-logo {
  height: 2em;
  vertical-align: center;
  margin-right: .5em;
}
</style>
