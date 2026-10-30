<script setup lang="ts">
import {onMounted} from 'vue';
import { useFindings } from "@/modules/findings/useFindings.ts";
import {useRoute} from "vue-router";
import Chip from "@/components/Chip.vue";
import IconSave from "@/components/icons/IconSave.vue";
import {useEdit} from "@/composables/useEdit.ts";
import {useAuth} from "@/composables/useAuth.ts";
import IconCancel from "@/components/icons/IconCancel.vue";

const route = useRoute();

const {
  hasPrivilege
} = useAuth();

const {
  finding,
  images,
  projectUsers,
  allFindings,
  loadFinding,
  saveFinding,
  uploadImages,
} = useFindings();

onMounted(() => {
  loadFinding(route.params.id as string, true);
});

async function save() {
  await saveFinding();
  edited.value = false;
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

const { edited } = useEdit();
</script>


<template>
  <form @submit.prevent="save" @input="edited = true">
    <section class="sticky">
      <div>
        <RouterLink :to="{ path: '/project/' + route.params.pid}">Project: {{finding.project?.title}}</RouterLink>
        <h1>Edit Finding: {{ finding.title }}</h1>
      </div>
      <RouterLink class="button" :to="{ name: 'FindingsDetails', params: {pid: route.params.pid, id: route.params.id} }"><IconCancel class="icon"/> Cancel</RouterLink>
      <button :disabled="!edited"><IconSave class="icon"/> Save</button>
    </section>
    <div>
      <label>Title</label>
      <input type="text" placeholder="Title" v-model="finding.title" />
    </div>
    <div>
      <label>Description</label>
      <textarea type="text" placeholder="Description" v-model="finding.description"></textarea>
    </div>
    <div>
      <label>Remarks or Recommendations</label>
      <textarea type="text" placeholder="Remarks or Recommendations" v-model="finding.remarks"></textarea>
    </div>
    <div v-if="hasPrivilege('ratingEdit', finding?.project)">
      <label>Personal Rating</label>
      <select v-model="finding.personalRating">
        <option value="">-</option>
        <option v-for="h in finding.project?.ratingset.ratings" :value="h.id"><Chip :chip="h"/></option>
      </select>
    </div>
    <template v-if="hasPrivilege('manager', finding?.project)">
      <div>
        <label>Final Rating</label>
        <select v-model="finding.ratingId" name="ratingId">
          <option value="">-</option>
          <option v-for="h in finding.project?.ratingset.ratings" :value="h.id"><Chip :chip="h"/></option>
        </select>
      </div>
      <div>
        <label>Manager Review</label>
        <label><input type="checkbox" v-model="finding.reviewed"/> Is Reviewed</label>
      </div>
      <div>
        <label>Merged To</label>
        <select v-model="finding.mergedToId">
          <option value="">-</option>
          <option v-for="f in allFindings" :value="f.id">
            {{f.title}}
          </option>
        </select>
      </div>
      <div>
        <label>Merged From</label>
        <select v-model="finding.mergedFrom" multiple>
          <option v-for="f in allFindings" :value="f.id">
            {{f.title}}
          </option>
        </select>
      </div>
      <div v-if="projectUsers.length">
        <label>Authors</label><br/>
        <select v-model="finding.user" multiple>
          <option v-for="u in projectUsers" :key="u.id" type="checkbox" name="authors" :value="u.id" >
            {{u.firstname}} {{u.lastname}}</option>
        </select>
      </div>
    </template>
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
  </form>
</template>
