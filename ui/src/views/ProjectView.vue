<script setup lang="ts">
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import Table from "@/components/Table.vue";

const route = useRoute();
const router = useRouter();

const project = ref({});
const findings = ref([]);

const statuses = ref({});
const heuristics = ref({});
const severities = ref({});
const users = ref([]);

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
    .then(json => {
      managersAndMembers(json);
      prepareForTable(json);
    })
}

function prepareForTable(data) {
  findings.value = data.Findings.map((finding) => {
    finding.user = finding.user.map(u => u.firstname + " " + u.lastname);
    finding.link = '/project/' + project.value.id + '/finding/' + finding.id;
    return finding;
  });
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

const tablehead = [
  { "key": "id", "title": "ID", "hidden": true },
  { "key": "title", "title": "Title", "locked": true },
  { "key": "description", "title": "Description", "hidden": true },
  { "key": "heuristics", "title": "Heuristic(s)", "type": "multichip" },
  { "key": "severity", "title": "Severity", "type": "chip" },
  { "key": "user", "title": "Author(s)", "type": "multi" },
  { "key": "updatedat", "title": "Last Change", "type": "time" },
  { "key": "link", "title": "Open", "type": "link", "locked": true },
];
</script>

<style>
input[type="text"], select, textarea {
  width: 100%;
}

div:has(> label, > input) {
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
    <Table :head="tablehead" :data="findings" sort="updatedat" dir="asc"/>
    <RouterLink :to="{ path: '/project/' + project.id + '/finding/new'}">New Finding</RouterLink>

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
        <label v-for="u in users">
          <input type="checkbox" name="manager" :value="u.id" v-model="managers"/>
          {{u.firstname}} {{u.lastname}}<br/>
        </label>
      </div>
      <div>
        <label>Members</label><br/>
          <label v-for="u in users">
            <input type="checkbox" name="members" :value="u.id" v-model="members" :disabled="managers.includes(u.id)"/>
            {{u.firstname}} {{u.lastname}}<br/>
          </label>
      </div>
      <input type="submit" value="Save"/>
    </form>
  </main>
</template>
