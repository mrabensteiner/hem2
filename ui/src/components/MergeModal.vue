<script setup lang="ts">
import {ref} from "vue";
import Chip from "@/components/Chip.vue";
import Thumbnails from "@/components/Thumbnails.vue";
import IconMerge from "@/components/icons/IconMerge.vue";
import IconCancel from "@/components/icons/IconCancel.vue";

const dialogRef = ref<HTMLDialogElement | null>(null);

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

defineExpose({
  openModal
})
</script>

<template>
  <dialog ref="dialogRef">
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
          <td><button @click="append(Origin.LEFT, 'title')">></button></td>
          <td><input v-model="findingMerge.title"/></td>
          <td><button @click="append(Origin.RIGHT, 'title')"><</button></td>
          <td>{{findingRight.title}}</td>
        </tr>
        <tr class="title">
          <th colspan="5">Description</th>
        </tr>
        <tr>
          <td>{{findingLeft.description}}</td>
          <td><button @click="append(Origin.LEFT, 'description')">></button></td>
          <td><textarea v-model="findingMerge.description"/></td>
          <td><button @click="append(Origin.RIGHT, 'description')"><</button></td>
          <td>{{findingRight.description}}</td>
        </tr>
        <tr class="title">
          <th colspan="5">Remarks</th>
        </tr>
        <tr>
          <td>{{findingLeft.remarks}}</td>
          <td><button @click="append(Origin.LEFT, 'remarks')">></button></td>
          <td><textarea v-model="findingMerge.remarks"/></td>
          <td><button @click="append(Origin.RIGHT, 'remarks')"><</button></td>
          <td>{{findingRight.remarks}}</td>
        </tr>
        <tr class="title">
          <th colspan="5">Heuristics</th>
        </tr>
        <tr>
          <td><Chip v-for="h in findingLeft.heuristics" :chip="h"/></td>
          <td><button @click="append(Origin.LEFT, 'heuristicIds', true)">></button></td>
          <td>{{findingMerge.heuristicIds}}</td>
          <td><button @click="append(Origin.RIGHT, 'heuristicIds', true)"><</button></td>
          <td><Chip v-for="h in findingRight.heuristics" :chip="h"/></td>
        </tr>
        <tr class="title">
          <th colspan="5">Reviewers</th>
        </tr>
        <tr>
          <td><span v-for="u in findingLeft.user">{{u.firstname}} {{u.lastname}}</span></td>
          <td><button @click="append(Origin.LEFT, 'userIds', true)">></button></td>
          <td>{{findingMerge.userIds}}</td>
          <td><button @click="append(Origin.RIGHT, 'userIds', true)"><</button></td>
          <td><span v-for="u in findingRight.user">{{u.firstname}} {{u.lastname}}</span></td>
        </tr>
        <tr class="title">
          <th colspan="5">Images</th>
        </tr>
        <tr>
          <td>
            <Thumbnails :images="findingLeft.images"/>
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            <Thumbnails :images="findingRight.images"/>
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="dialogRef?.close();"><IconCancel class="icon"/> Cancel</button>
    <button @click="save"><IconMerge class="icon"/> Merge</button>
  </dialog>
</template>


<style scoped>
table {
  table-layout: fixed;
  width: 100%;
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

dialog::backdrop {
  background-color: #aaaa;
}
</style>
