<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProjectDetail } from './useProjectDetail.ts';
import {useLocalStorage} from "@vueuse/core";
import Table from "@/components/Table.vue";
import Chip from "@/components/Chip.vue";
import FindingCard from "@/components/FindingCard.vue";
import IconTable from "@/components/icons/IconTable.vue";
import IconCards from "@/components/icons/IconCards.vue";

const route = useRoute();
const router = useRouter();

const isNewProject = computed(() => route.params.id === 'new');

const {
  project,
  findings,
  loadProject,
  checkProjectPrivilege
} = useProjectDetail();

onMounted(() => {
  loadProject(route.params.id as string, isNewProject.value).then(() => {
    checkProjectPrivilege(route.meta.requiredProjectPrivilege as string);
  });
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

enum viewType {TABLE, CARDS};
const view = useLocalStorage("view", viewType.TABLE)
</script>

<template>
  <section class="sticky">
    <h1>Project: {{ project.title }}</h1>
    <RouterLink class="button" :to="{ path: `${route.path}/edit`}">Edit</RouterLink>
  </section>
  <p>Status:
    <Chip :chip="project.status" />
  </p>

  <p>Managers:
    {{ project.UserInProject?.filter((uip: any) => uip.projectRole === 'MANAGER').map((uip: any) => `${uip.user.firstname} ${uip.user.lastname}`).join(", ") }}
  </p>

  <p>Reviewers:
    {{ project.UserInProject?.filter((uip: any) => uip.projectRole === 'MEMBER').map((uip: any) => `${uip.user.firstname} ${uip.user.lastname}`).join(", ") }}
  </p>

  <hr/>
  <p>{{ project.description }}</p>
  <hr/>
  <h2>Findings ({{findings.length}})
    <abbr class="info" v-if="project.status?.findingsViewOwn && !project.status?.findingsViewAll" title="In this Project Status, Findings of other Reviewers are hidden.">i</abbr>
    <abbr class="info" v-if="!project.status?.findingsViewOwn && !project.status?.findingsViewAll" title="In this Project Status, all Findings are hidden.">i</abbr>

    <div class="view-toggle animation" v-if="findings || project.status?.findingsViewOwn || project.status?.findingsViewAll">
      <label title="Table View"><input type="radio" id="view" v-model="view" :value="viewType.TABLE"/><IconTable/></label>
      <label title="Cards View"><input type="radio" id="aview" v-model="view" :value="viewType.CARDS"/><IconCards/></label>
    </div>
  </h2>

  <div v-if="view == viewType.CARDS" class="row">
    <FindingCard v-for="f in findings" :finding="f" />
  </div>

  <Table v-else :head="findingsTableHead" :data="findings" sort="updatedat" dir="asc" />

  <div v-if="project.status">
    <h3>Current Project Status ({{project.status?.title}})</h3>
    <ul class="project-status">
      <li :data-allowed="project.status?.projectViewDetails">View project details</li>
      <li :data-allowed="project.status?.findingsAdd">Add new findings</li>
      <li :data-allowed="project.status?.findingsViewOwn">View own findings</li>
      <li :data-allowed="project.status?.findingsViewAll">View all findings</li>
      <li :data-allowed="project.status?.findingsEditOwn">Edit own findings</li>
      <li :data-allowed="project.status?.findingsEditAll">Edit all findings</li>
      <li :data-allowed="project.status?.ratingEdit">Rate findings</li>
    </ul>
  </div>

  <RouterLink :to="`/project/${project.id}/findings/new`" class="button">New Finding</RouterLink>
  <RouterLink :to="`/project/${project.id}/findings/rate`" class="button">Rate</RouterLink>
  <RouterLink :to="`/project/${project.id}/ratings`" class="button">Rating Overview</RouterLink>

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

<style scoped>
.info {
  color: var(--app-primary);
  cursor: help;
  width: 1.5em;
  display: inline-block;
  border: 2px solid var(--app-primary);
  text-align: center;
  border-radius: 50%;
}

.row {
  margin-top: 2rem;
}

.view-toggle {
  display: inline-block;

  input {
    position: absolute;
    opacity: 0;
  }

  label {
    border-radius: 100%;
    height: 3rem;
    width: 3rem;
    padding: .75rem;
    cursor: pointer;
    display: inline-flex;

    &:has(input:checked) {
      background-color: rgba(var(--app-primary-rgb), .25);
    }
  }
}

ul.project-status {
  list-style-type: none;
  padding-inline-start: 1em;

  li {
    &::before {
      display: inline-block;
      width: 1rem;
    }
    &[data-allowed="true"]::before {
      color: green;
      content: '✓';
    }
    &[data-allowed="false"]::before {
      color: red;
      content: '🗙';
    }
  }
}
</style>
