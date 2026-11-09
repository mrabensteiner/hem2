<script setup lang="ts">
import {onMounted} from 'vue';
import {useRoute} from "vue-router";
import {useProjects} from "@/modules/projects/useProjects.ts";
import IconOpen from "@/components/icons/IconOpen.vue";

const route = useRoute();

const {
  project,
  loadProject,
  exportJson,
  exportReportLatex,
  exportGithub,
  exportGitlab
} = useProjects();

onMounted(() => {
  loadProject(route.params.id as string);
});
</script>

<template>
    <section class="sticky">
      <h1>Export Project</h1>
    </section>

    <h2>File Export</h2>
    <div>
      <button role="button" @click="exportJson">Export JSON</button>
      <button role="button" @click="exportReportLatex">Export TEX</button>
    </div>

    <h2>Service Settings</h2>
    <form @submit.prevent="exportGithub">
      <h3>GitHub</h3>
      <div>
        <label>Personal Token</label><br/>
        <input type="text" v-model="project.githubToken" placeholder="github_pat_..."/>
      </div>
      <div>
        <label>Organisation or User of the Repository</label><br/>
        <input type="text" v-model="project.githubUser" placeholder="tugraz"/>
      </div>
      <div>
        <label>Repository ID</label><br/>
        <input type="text" v-model="project.githubRepo" placeholder="hem2"/>
      </div>
      <button :disabled="!project.githubToken || !project.githubUser || !project.githubRepo">
        <IconOpen class="icon"/> Export to GitHub
      </button>
    </form>

    <form @submit.prevent="exportGitlab">
      <h3>GitLab</h3>
      <div>
        <label>Host</label><br/>
        <input type="text" v-model="project.gitlabHost" placeholder="https://gitlab.tugraz.at/"/>
      </div>
      <div>
        <label>Personal Token</label><br/>
        <input type="text" v-model="project.gitlabToken" placeholder="glpat-..."/>
      </div>
      <div>
        <label>Organisation or User of the Repository</label><br/>
        <input type="text" v-model="project.gitlabUser" placeholder="tugraz"/>
      </div>
      <div>
        <label>Repository ID</label><br/>
        <input type="text" v-model="project.gitlabRepo" placeholder="hem2"/>
      </div>
      <button :disabled="!project.gitlabHost || !project.gitlabToken || !project.gitlabUser || !project.gitlabRepo">
        <IconOpen class="icon"/> Export to GitLab
      </button>
    </form>
</template>


<style scoped>
h2 {
  margin-top: 1rem;
  margin-bottom: .5rem;
}

h3 {
  margin: 0;
}

div > button {
  margin-top: 0;
  margin-bottom: .5rem;
}
</style>
