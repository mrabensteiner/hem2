<script setup lang="ts">
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";

const route = useRoute();
const router = useRouter();

const project = ref({});
const statuses = ref({});
const heuristics = ref({});
const severities = ref({});
const users = ref({});

const managers = ref([]);
const members = ref([]);

function managersAndMembers(json) {
  json.UserInProject.forEach((item) => {
    if (item.projectRole == "MANAGER") {
      managers.value.push(item.userId);
    } else if (item.projectRole == "MEMBER") {
      members.value.push(item.userId);
    }
  });
}

const newProject = route.params.id == "new";

if (!newProject) {
  fetch("http://localhost:3000/project/" + route.params.id)
    .then(response => response.json())
    .then(json => project.value = json)
    .then(json => managersAndMembers(json))
}



fetch("http://localhost:3000/statuses")
  .then(response => response.json())
  .then(json => statuses.value = json);

fetch("http://localhost:3000/heuristics")
  .then(response => response.json())
  .then(json => heuristics.value = json);

fetch("http://localhost:3000/severities")
  .then(response => response.json())
  .then(json => severities.value = json);

fetch("http://localhost:3000/users")
  .then(response => response.json())
  .then(json => users.value = json);


function save() {
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...project.value,
      "managers": managers.value,
      "members": members.value
    })
  };

  if (newProject) {
    requestOptions.method = "POST";
  }

  fetch("http://localhost:3000/project", requestOptions)
    .then(response => response.json())
    .then(json => project.value = json)
    .then(
      () => {
        if (newProject) {
          router.push(`/projects`)
        }
      }
    );
}

</script>

<style>
input[type="text"], select {
  width: 100%;
}

div:has(label, input) {
  margin-top: 1rem;
}

hr {
  margin: 1rem 0;
}

</style>

<template>
  <main>
    <template v-if="!newProject">
    <h1 @keydown="console.log($refs.title.innerText)" contenteditable="plaintext-only" ref="title">Project: {{ project.title }}</h1>
    <hr/>
    <p>Managers:
      <template v-for="uip in project.UserInProject" :key="uip.userId">
        <span v-if="uip.projectRole == 'MANAGER'">{{uip.user.firstname}} {{uip.user.lastname}}</span>
      </template>
    </p>
    <p>Members:
      <template v-for="uip in project.UserInProject" :key="uip.userId">
        <span v-if="uip.projectRole == 'MEMBER'">{{uip.user.firstname}} {{uip.user.lastname}}</span>
      </template>
    </p>
    <hr/>
    <p>{{project.description}}</p>
    <hr/>
    <h2>Findings</h2>
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Heuristic(s)</th>
          <th>Severity</th>
          <th>Author(s)</th>
        </tr>
      </thead>
      <tbody>
      <tr v-for="finding in project.Findings" :key="finding.id">
        <td>{{ finding.title }}</td>
        <td>{{ finding.description }}</td>
        <td>{{ finding.heuristics.map(h => h.title).join(", ") }}</td>
        <td>{{ finding.severity }}</td>
        <td><template v-for="u in finding.user">{{u.firstname}} {{u.lastname}}</template></td>
      </tr>
      </tbody>
    </table>

    <h2>Edit</h2>
    </template>
    <template v-else>
      <h2>New Project</h2>
    </template>
    <form @submit.prevent="save">
      <div>
        <label>Title</label>
        <input type="text" placeholder="Title" v-model="project.title" />
      </div>
      <div>
        <label>Description</label>
        <input type="text" placeholder="Description" v-model="project.description" />
      </div>
      <div>
        <label>Status</label>
        <select v-model="project.statusId" required>
          <option v-for="status in statuses" :value="status.id">{{ status.title }}</option>
        </select>
      </div>
      <div>
        <label>Heuristic Set</label>
        <select v-model="project.heuristicsetId">
          <option v-for="h in heuristics" :value="h.id">{{ h.title }}</option>
        </select>
      </div>
      <div>
        <label>Severity Rating Set</label>
        <select v-model="project.severitysetId">
          <option v-for="s in severities" :value="s.id">{{ s.title }}</option>
        </select>
      </div>
      <div>
        <label>Managers</label><br/>
        <label v-for="u in users" :key="u.id">
          <input type="checkbox" name="manager" :value="u.id" v-model="managers"/>
          {{u.firstname}} {{u.lastname}}<br/>
        </label>
      </div>
      <div>
        <label>Members</label><br/>
          <label v-for="u in users" :key="u.id">
            <input type="checkbox" name="members" :value="u.id" v-model="members"/>
            {{u.firstname}} {{u.lastname}}<br/>
          </label>
      </div>
      <input type="submit" value="Save"/>
    </form>
  </main>
</template>
