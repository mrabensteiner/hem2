<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProjectDetail } from '../composables/useProjectDetail.js';
import Table from "@/components/Table.vue";
import Chip from "@/components/Chip.vue";

const route = useRoute();
const router = useRouter();

const isNewProject = computed(() => route.params.id === 'new');

const {
  project,
  findings,
  managers,
  members,
  statuses,
  heuristics,
  severities,
  users,
  error,
  loadProject,
  saveProject
} = useProjectDetail();

onMounted(() => {
  loadProject(route.params.id as string, isNewProject.value);
});

async function save() {
  await saveProject(isNewProject.value);

  if (isNewProject.value) {
    router.push('/projects');
  }
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

hr {
  margin: 1rem 0;
}
</style>

<template>
  <template v-if="!isNewProject">
    <h1>Project: {{ project.title }}</h1>
    <hr/>

    <p>Status:
      <Chip :chip="project.status" />
    </p>

    <p>Managers:
      <template v-for="uip in project.UserInProject" :key="'manager-' + uip.userId">
        <span v-if="uip.projectRole === 'MANAGER'">{{ uip.user?.firstname }} {{ uip.user?.lastname }}</span>
      </template>
    </p>

    <p>Members:
      <template v-for="uip in project.UserInProject" :key="'member-' + uip.userId">
        <span v-if="uip.projectRole === 'MEMBER'">{{ uip.user?.firstname }} {{ uip.user?.lastname }}</span>
      </template>
    </p>

    <hr/>
    <p>{{ project.description }}</p>
    <hr/>

    <h2>Findings</h2>
    <Table :head="tablehead" :data="findings" sort="updatedat" dir="asc" />
    <RouterLink :to="`/project/${project.id}/finding/new`" class="link-btn">New Finding</RouterLink>

    <h2>Edit Project</h2>
  </template>

  <template v-else>
    <h2>New Project</h2>
  </template>

  <form @submit.prevent="save">
    <div>
      <label for="title">Title</label>
      <input id="title" type="text" placeholder="Title" v-model="project.title" required />
    </div>

    <div>
      <label for="description">Description</label>
      <textarea id="description" placeholder="Description" v-model="project.description" rows="3"></textarea>
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
      <select id="heuristic" v-model="project.heuristicsetId">
        <option v-for="h in heuristics" :key="h.id" :value="h.id">
          {{ h.title }}
        </option>
      </select>
    </div>

    <div>
      <label for="severity">Severity Rating Set</label>
      <select id="severity" v-model="project.severitysetId">
        <option v-for="s in severities" :key="s.id" :value="s.id">
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
</template>
