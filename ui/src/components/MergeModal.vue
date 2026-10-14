<script setup lang="ts">
import {ref} from "vue";

const dialogRef = ref<HTMLDialogElement | null>(null);

const findingMerge = defineModel<any>();

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
      <tr>
        <td>{{findingLeft.title}}</td>
        <td>>></td>
        <td><input v-model="findingMerge.title"/></td>
        <td><<</td>
        <td>{{findingRight.title}}</td>
      </tr>
      <tr>
        <td>{{findingLeft.description}}</td>
        <td>>></td>
        <td><input v-model="findingMerge.description"/></td>
        <td><<</td>
        <td>{{findingRight.description}}</td>
      </tr>
    </table>
    <button @click="dialogRef?.close();">Cancel</button>
    <button @click="save">Save</button>
  </dialog>
</template>


<style scoped>
table {
  table-layout: fixed;
  width: 100%;
}

th, td {
  &:nth-child(2), &:nth-child(4) {
    width: 2rem;
    text-align: center;
  }
  padding: .25rem;
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
