<script setup lang="ts">
import {ref} from 'vue';
import {useRouter} from "vue-router";
import {useProjects} from "@/modules/projects/useProjects.ts";
import IconSave from "@/components/icons/IconSave.vue";

const router = useRouter();

const {
  importProject
} = useProjects();

let file = ref<File | null>(null);

const handleChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) return;

  file.value = input.files[0] as File;
};

const handleUpload = async () => {
  if (!file.value) return;

  const formData = new FormData();
  console.log("val",file.value);
  formData.append("file", file.value);
  const projectId = await importProject(formData);

  router.push({name: 'ProjectDetails', params: {id: projectId}});
}
</script>


<template>
  <form @submit.prevent="handleUpload">
    <section class="sticky">
      <h1>Import Project</h1>
    </section>

    <input type="file" @change="handleChange" multiple accept="application/json">
    <br/>
    <button :disabled="!file"><IconSave class="icon"/> Import</button>
  </form>
</template>
