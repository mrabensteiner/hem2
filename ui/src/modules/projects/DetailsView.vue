<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProjectDetail } from './useProjectDetail.ts';
import Table from "@/components/Table.vue";
import Chip from "@/components/Chip.vue";

const route = useRoute();
const router = useRouter();

const isNewProject = computed(() => route.params.id === 'new');

const {
  project,
  findings,
  loadProject
} = useProjectDetail();

onMounted(() => {
  loadProject(route.params.id as string, isNewProject.value);
});

const findingsTableHead = [
  { "key": "id", "title": "ID", "hidden": true },
  { "key": "title", "title": "Title", "type": "link", "locked": true, sortable: true },
  { "key": "description", "title": "Description", "hidden": true },
  { "key": "heuristics", "title": "Heuristic(s)", "type": "multichip" },
  { "key": "rating", "title": "Rating", "type": "chip" },
  { "key": "user", "title": "Reviewer(s)", "type": "multi" },
  { "key": "updatedat", "title": "Last Change", "type": "time" },
  { "key": "link", "title": "Open", "type": "link", "locked": true },
];
</script>

<template>
  <h1>Project: {{ project.title }} <RouterLink :to="{ path: `${route.path}/edit`}">Edit</RouterLink></h1>
  <hr/>
  <p>Status:
    <Chip :chip="project.status" />
  </p>

  <p>Managers:
    <template v-for="uip in project.UserInProject" :key="'manager-' + uip.userId">
      <span v-if="uip.projectRole === 'MANAGER'">{{ uip.user?.firstname }} {{ uip.user?.lastname }}&nbsp;</span>
    </template>
  </p>

  <p>Reviewers:
    <template v-for="uip in project.UserInProject" :key="'member-' + uip.userId">
      <span v-if="uip.projectRole === 'MEMBER'">{{ uip.user?.firstname }} {{ uip.user?.lastname }}&nbsp;</span>
    </template>
  </p>

  <hr/>
  <p>{{ project.description }}</p>
  <hr/>

  <h2>Findings</h2>
  <Table :head="findingsTableHead" :data="findings" sort="updatedat" dir="asc" />
  <RouterLink :to="`/project/${project.id}/findings/new`" class="button">New Finding</RouterLink>

  <h2>Findings per Reviewer</h2>
  <div>
    <div v-for="user in project.UserInProject?.filter((uip: any) => uip.projectRole === 'MEMBER').map((uip: any) => uip.user)">
      {{user.firstname}} {{user.lastname}}
      ({{findings.filter((f: any) => f.user.includes(`${user.firstname} ${user.lastname}`)).length}})

      <ul>
        <li v-for="f in findings.filter((f: any) => f.user.includes(`${user.firstname} ${user.lastname}`))">
          <RouterLink :to="{ path: `${route.path}/findings/${f.id}` }">{{f.title}}</RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>
