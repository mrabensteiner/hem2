<script setup lang="ts">
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import Chip from "@/components/Chip.vue";

const route = useRoute();
const router = useRouter();

const finding = ref({});
const users = ref({});
const severityset = ref([]);
const heuristicsoptions = ref([]);

const images = ref([]);

const authors = ref([]);
const heuristics = ref([]);

function transformAuthors(json) {
  json.user.forEach((item) => {
    authors.value.push(item.id);
  });
  json.heuristics.forEach((item) => {
    heuristics.value.push(item.id);
  });
}

const newFinding = route.params.id == "new";

if (!newFinding) {
  fetch("http://localhost:3000/finding/" + route.params.id)
    .then(response => response.json())
    .then(json => finding.value = json)
    .then(json => {
      transformAuthors(json);
      severityset.value = json.project.severityset.severities;
      heuristicsoptions.value = json.project.heuristicset.heuristics;
      images.value = json.images;
    })
} else {
  finding.value.projectId = route.params.pid;

  fetch("http://localhost:3000/projects/" + route.params.pid)
    .then(response => response.json())
    .then(json => {
      //transformAuthors(json); // TODO --> current user
      severityset.value = json.severityset.severities;
      heuristicsoptions.value = json.heuristicset.heuristics;
    })

}

fetch("http://localhost:3000/users")
  .then(response => response.json())
  .then(json => users.value = json);


function save() {
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...finding.value,
      "authors": authors.value,
      "heuristics": heuristics.value,
    })
  };

  if (newFinding) {
    requestOptions.method = "POST";
  }

  fetch("http://localhost:3000/finding", requestOptions)
    .then(response => response.json())
    .then(json => finding.value = json)
    .then(
      () => {
        if (newFinding) {
          router.push({params: { id: finding.value.id } })
        } else {
          router.go(-1);
        }
      }
    );
}
const uploadImages = async (event: Event) => {
  const input = event.target as HTMLInputElement;

  if (!input.files) return;

  const formData = new FormData();

  for (const file of input.files) {
    formData.append("image", file);
  }

  await fetch("http://localhost:3000/images/" + finding.value.id, {
    method: "POST",
    body: formData,
  }).then(response => response.json()).then(json => {
    images.value = json;
    input.files = null;
    console.log(input);
  });
};
</script>

<template>
  <template v-if="!newFinding">
    <RouterLink :to="{ path: '/project/' + route.params.pid}">Project: {{finding.project.title}}</RouterLink>
  <h1 @keydown="console.log($refs.title.innerText)" ref="title">Finding:
    {{ finding.title }}</h1>
  <hr/>
  <p>Author(s):
    <template v-for="u in finding.user" :key="u.id">
      <span>{{u.firstname}} {{u.lastname}}</span>
    </template>
  </p>
  <p>Heuristics(s):
    <template v-for="h in finding.heuristics" :key="h.id">
      <Chip :chip="h" />
    </template>
  </p>
  <hr/>
  <p>Description: {{ finding.description }}</p>

  <strong>Images</strong>
  <input type="file" @change="uploadImages" multiple>
  <div class="thumbnails">
    <img v-for="i in images" :src="'http://localhost:3000/'+i.path" width="100"/>
  </div>
  <hr/>


  <h2>Edit</h2>
  </template>
  <template v-else>
    <h2>New Finding</h2>
  </template>
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
      <label>Severity</label>
      <select v-model="finding.severityId" name="severityId">
        <option v-for="h in severityset" :value="h.id"><Chip :chip="h"/></option>
      </select>
    </div>
    <div>
      <label>Authors</label><br/>
      <select v-model="authors" multiple>
        <option v-for="u in users" :key="u.id" type="checkbox" name="authors" :value="u.id" >
        {{u.firstname}} {{u.lastname}}</option>
      </select>
    </div>
    <div>
      <label>Heuristics</label><br/>
      <select v-model="heuristics" multiple>
        <option v-for="h in heuristicsoptions" :key="h.id" type="checkbox" name="authors" :value="h.id" >
        {{h.title}}</option>
      </select>
    </div>
    <input type="submit" value="Save"/>
    <RouterLink v-if="!newFinding" :to="{ path: '/project/' + route.params.pid + '/finding/new'}" class="button">New Finding</RouterLink>
  </form>
</template>

<style scoped>
.thumbnails {
  display: flex;
  gap: .5rem;
}

.thumbnails img {
  background-color: var(--color-background-mute);
  height: 6rem;
  width: 10rem;
  border: 1px solid darkgray;
  border-radius: 2px;
  object-fit: contain;
}
</style>
