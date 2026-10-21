<script setup lang="ts">
import {ref} from "vue";
import Chip from "@/components/Chip.vue";
import Thumbnails from "@/components/Thumbnails.vue";
import IconMerge from "@/components/icons/IconMerge.vue";
import IconCancel from "@/components/icons/IconCancel.vue";
import {useProjects} from "@/modules/projects/useProjects.ts";
import TimeAgo from "@/components/TimeAgo.vue";

const dialogRef = ref<HTMLDialogElement | null>(null);

const { project } = useProjects();

const findingMerge = defineModel<any>();

enum Origin {
  LEFT, RIGHT
}

const { findingLeft, findingRight, saveCallback } = defineProps({
  findingLeft: { type: Object, required: true },
  findingRight: { type: Object, required: true },
  saveCallback: { type: Function, required: true }
});

function save() {
  dialogRef.value?.close();
  saveCallback();
}

function openModal() {
  dialogRef.value?.showModal();
}

function append(origin: Origin, key: string, isArray = false) {
  const originFinding = origin == Origin.LEFT ? findingLeft : findingRight;
  if (isArray) {
    originFinding[key].forEach((item: string) => {
      if (!findingMerge.value[key].includes(item)) findingMerge.value[key].push(item);
    });
  } else if (origin == Origin.LEFT) {
    findingMerge.value[key] = originFinding[key] + " " + findingMerge.value[key];
  } else {
    findingMerge.value[key] += " " + originFinding[key];
  }
}

function updateUsers() {
  const allUsers = project.value.UserInProject;
  const uIds = findingMerge.value.userIds;
  findingMerge.value.user = uIds.map((id: string) => allUsers.find((u: any) => u.userId === id).user);
}

function updateHeuristics() {
  const allHeuristics = project.value.heuristicset.heuristics;
  const heuristicIds = findingMerge.value.heuristicIds;
  findingMerge.value.heuristics = heuristicIds.map((id: string) => allHeuristics.find((h: any) => h.id === id));
}

defineExpose({
  openModal
})
</script>

<template>
  <dialog ref="dialogRef">
    <form @submit.prevent="save">
      <table>
        <thead>
          <tr>
            <th>Finding 1</th>
            <th></th>
            <th>Merged Finding</th>
            <th></th>
            <th>Finding 2</th>
          </tr>
        </thead>
        <tbody>
          <tr class="title">
            <th colspan="5">Title</th>
          </tr>
          <tr>
            <td>{{findingLeft.title}}</td>
            <td><button type="button" @click="append(Origin.LEFT, 'title')">></button></td>
            <td><input v-model="findingMerge.title"/></td>
            <td><button type="button" @click="append(Origin.RIGHT, 'title')"><</button></td>
            <td>{{findingRight.title}}</td>
          </tr>
          <tr class="title">
            <th colspan="5">Description</th>
          </tr>
          <tr>
            <td>{{findingLeft.description}}</td>
            <td><button type="button" @click="append(Origin.LEFT, 'description')">></button></td>
            <td><textarea v-model="findingMerge.description"/></td>
            <td><button type="button" @click="append(Origin.RIGHT, 'description')"><</button></td>
            <td>{{findingRight.description}}</td>
          </tr>
          <tr class="title">
            <th colspan="5">Remarks</th>
          </tr>
          <tr>
            <td>{{findingLeft.remarks}}</td>
            <td><button type="button" @click="append(Origin.LEFT, 'remarks')">></button></td>
            <td><textarea v-model="findingMerge.remarks"/></td>
            <td><button type="button" @click="append(Origin.RIGHT, 'remarks')"><</button></td>
            <td>{{findingRight.remarks}}</td>
          </tr>
          <tr class="title">
            <th colspan="5">Heuristics</th>
          </tr>
          <tr>
            <td><Chip v-for="h in findingLeft.heuristics" :chip="h"/></td>
            <td><button type="button" @click="append(Origin.LEFT, 'heuristicIds', true)">></button></td>
            <td>
              <select v-if="findingMerge.heuristicIds" v-model="findingMerge.heuristicIds" multiple @change="updateHeuristics">
                <option v-for="h in project.heuristicset?.heuristics" :value="h.id"><Chip :chip="h"/></option>
              </select>
            </td>
            <td><button type="button" @click="append(Origin.RIGHT, 'heuristicIds', true)"><</button></td>
            <td><Chip v-for="h in findingRight.heuristics" :chip="h"/></td>
          </tr>
          <tr class="title">
            <th colspan="5">Reviewers</th>
          </tr>
          <tr>
            <td><span v-for="u in findingLeft.user">{{u.firstname}} {{u.lastname}}</span></td>
            <td><button type="button" @click="append(Origin.LEFT, 'userIds', true)">></button></td>
            <td>
              <select v-if="findingMerge.userIds" v-model="findingMerge.userIds" multiple @change="updateUsers">
                <option v-for="uip in project.UserInProject" :value="uip.userId">{{uip.user.firstname}} {{uip.user.lastname}}</option>
              </select>
            </td>
            <td><button type="button" @click="append(Origin.RIGHT, 'userIds', true)"><</button></td>
            <td><span v-for="u in findingRight.user">{{u.firstname}} {{u.lastname}}</span></td>
          </tr>
          <template v-if="findingLeft.images?.length || findingRight.images?.length">
            <tr class="title">
              <th colspan="5">Images</th>
            </tr>
            <tr>
              <td>
                <Thumbnails :images="findingLeft.images" v-model="findingMerge.imageIds"/>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <Thumbnails :images="findingRight.images" v-model="findingMerge.imageIds"/>
              </td>
            </tr>
          </template>
          <tr class="title">
            <th colspan="5">Last Updated</th>
          </tr>
          <tr>
            <td><TimeAgo v-if="findingLeft.updatedat" :date="findingLeft.updatedat"/></td>
            <td></td>
            <td></td>
            <td></td>
            <td><TimeAgo v-if="findingRight.updatedat" :date="findingRight.updatedat"/></td>
          </tr>
        </tbody>
      </table>
      <div class="footer">
        <button type="button" @click="dialogRef?.close();"><IconCancel class="icon"/> Cancel</button>
        <button autofocus><IconMerge class="icon"/> Merge</button>
      </div>
    </form>
  </dialog>
</template>


<style scoped>
table {
  table-layout: fixed;
  width: 100%;
}

thead {
  position: sticky;
  top: 0;
  background-color: var(--color-background);
  box-shadow: 0 .25rem .5rem var(--color-border);
  margin: -1rem;
}

th {
  font-weight: bold;
}

tr.title th {
  background-color: var(--color-background-mute);
  border-top: 3px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  padding-top: .5rem;
  padding-bottom: .25rem;
  text-align: left;
}

th, td {
  &:nth-child(2), &:nth-child(4) {
    width: 2rem;
    text-align: center;
  }

  padding: .25rem;
  padding-bottom: .5rem;

  input {
    width: 100%;
  }
}

dialog {
  z-index: 2;
  margin: auto;
}

.footer {
  position: sticky;
  bottom: -1rem;
  margin: 1rem -1rem -1rem -1rem;
  padding: 0 1rem;
  background-color: var(--color-background);
  border-top: 1px solid var(--color-border);
  box-shadow: 0 -.25rem .5rem var(--color-border);
}
</style>
