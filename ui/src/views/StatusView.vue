<script setup lang="ts">
import {ref} from "vue";
import draggable from 'vuedraggable';

const data = ref([] as any[]);
fetch("http://localhost:3000/status")
  .then(response => response.json())
  .then(json => data.value = json);

function save() {
  const requestOptions = {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data.value)
  };

  fetch("http://localhost:3000/status", requestOptions)
    .then(response => response.json())
    .then(json => data.value = json)
}

function add() {
  fetch("http://localhost:3000/status", {method: "POST"})
    .then(response => response.json())
    .then(json => data.value.push(json))
}

function remove(event: MouseEvent) {
  const id = (event.target as HTMLElement).dataset.statusid;

  fetch("http://localhost:3000/status", {
    method: "DELETE",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({id: id})
  })
    .then(response => response.json())
    .then(json => data.value = json)
}
</script>

<template>
  <h1>Statuses</h1>
  <form @submit.prevent="save">
    <draggable v-model="data" item-key="id" handle=".drag-handle" ghost-class="ghost">
      <template #item="{ element }">
        <div class="list-row">
          <div class="drag-handle">⋮⋮</div>
          <label>
            Title
            <input v-model="element.title"/>
          </label>
          <label>
            Background
            <input v-model="element.color" type="color"/>
          </label>
          <label>
            Text Colour
            <input v-model="element.textcolor" type="color"/>
          </label>
          <button type="button" @click="remove" :data-statusid="element.id">Remove</button>
        </div>
      </template>
    </draggable>
    <button type="button" @click="add">Add</button>
    <input type="submit" value="Save"/>
  </form>
</template>

<style scoped>
.list-row {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  &:nth-child(odd) {
    background-color: whitesmoke;
  }

  :nth-child(2) {
    flex-grow: 1;
  }

  label {
    font-size: 1rem;
  }

  input {
    width: 100%;
  }
}

.drag-handle {
  cursor: move;
  padding: 1rem;
}

.ghost, .ghost:nth-child(odd) {
  background-color: var(--app-primary);
  opacity: .3;
}
</style>
