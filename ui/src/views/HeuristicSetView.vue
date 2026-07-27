<script setup lang="ts">
import {ref} from "vue";
import draggable from 'vuedraggable';
import {useRoute} from "vue-router";

const route = useRoute();
const data = ref([] as any[]);
fetch("http://localhost:3000/heuristic-sets/" + route.params.id)
  .then(response => response.json())
  .then(json => data.value = json);

function save() {
  const requestOptions = {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data.value)
  };

  fetch("http://localhost:3000/heuristic-sets", requestOptions)
    .then(response => response.json())
    .then(json => data.value = json)
}

function add() {
  fetch("http://localhost:3000/heuristic-sets/" + route.params.id, {method: "POST"})
    .then(response => response.json())
    .then(json => data.value.heuristics.push(json))
}

function remove(event: MouseEvent) {
  const id = (event.target as HTMLElement).dataset.statusid;

  fetch("http://localhost:3000/heuristic-sets/" + route.params.id, {
    method: "DELETE",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({id: id})
  })
    .then(response => response.json())
    .then(json => {
      if (json.error) {
        alert(json.error);
      } else {
        data.value = json;
      }
    })
}
</script>

<template>
  <h1>Heuristic Set</h1>
  <form @submit.prevent="save">
    <label>
      Title
      <input type="text" v-model="data.title"/>
    </label>
    <label>
      Description
      <textarea v-model="data.description"/>
    </label>
    <label>Heuristics</label>
    <draggable v-model="data.heuristics" item-key="id" handle=".drag-handle" ghost-class="ghost">
      <template #item="{ element }">
        <div class="list-row">
          <div class="drag-handle">⋮⋮</div>
          <div>
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
          <label>
            Description
            <textarea v-model="element.description"></textarea>
          </label>
          </div>
          <button type="button" @click="remove" :data-statusid="element.id">Remove</button>
        </div>
      </template>
    </draggable>
    <button type="button" @click="add">Add Heuristic</button>
    <input type="submit" value="Save"/>
  </form>
</template>

<style scoped>
.list-row {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  &:nth-child(odd) {
    background-color: var(--color-background-mute);
  }

  >:nth-child(2) {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 1rem;

    label:first-child {
      flex-grow: 1;
    }

    label:last-child {
      flex-basis: 100%;
    }
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
