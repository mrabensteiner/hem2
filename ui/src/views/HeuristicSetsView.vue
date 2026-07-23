<script setup lang="ts">
import {ref} from "vue";
import Table from "@/components/Table.vue";

const data = ref([]);
fetch("http://localhost:3000/heuristic-sets")
  .then(response => response.json())
  .then(json => prepareForTable(json))
  .then(json => data.value = json);

function prepareForTable(data) {
  data = data.map((heuristicSet) => {
    heuristicSet.link = "/heuristics/" + heuristicSet.id;
    return heuristicSet;
  });

  return data;
}

const tablehead = [
  { "key": "title", "title": "Title", "locked": true },
  { "key": "link", "title": "Open", "type": "link", "locked": true  },
];

function add() {
  fetch("http://localhost:3000/heuristic-sets", {method: "POST"})
      .then(response => response.json())
      .then(json => data.value.push(json))
}
</script>

<template>
  <h1>Heuristic Sets</h1>
  <Table :head="tablehead" :data="data"></Table>
  <button type="button" @click="add">New Set</button>
</template>
