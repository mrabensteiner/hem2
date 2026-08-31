<script setup lang="ts">
import {onMounted, computed, ref, watch} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHeuristic } from "./useHeuristic.ts";
import draggable from 'vuedraggable';
import Chip from "@/components/Chip.vue";
import Message from "@/components/Message.vue";
import IconSave from "@/components/icons/IconSave.vue";
import IconAdd from "@/components/icons/IconAdd.vue";

const route = useRoute();
const router = useRouter();

const isNewHeuristicSet = computed(() => route.params.id === 'new');

const {
  heuristicSet,
  loadHeuristicSet,
  saveHeuristicSet,
  addHeuristic,
  removeHeuristic,
  success,
  error
} = useHeuristic();

const colorOverride = ref("#777");
const textcolorOverride = ref("#fff");

onMounted(() => {
  loadHeuristicSet(route.params.id as string, isNewHeuristicSet.value);
});

watch(colorOverride, (newColor: string) => {
  Object.keys(heuristicSet.value.heuristics).forEach(key => {
    heuristicSet.value.heuristics[key].color = newColor;
  })
});

watch(textcolorOverride, (newTextcolor: string) => {
  Object.keys(heuristicSet.value.heuristics).forEach(key => {
    heuristicSet.value.heuristics[key].textcolor = newTextcolor;
  })
});

async function save() {
  await saveHeuristicSet(isNewHeuristicSet.value);

  if (isNewHeuristicSet.value) {
    router.push('/heuristics');
  }
  edited.value = false;
}

const edited = ref<boolean>(false);
</script>

<style>
input[type="text"], input[type="password"], select, textarea {
  width: 100%;
}
</style>

<template>
  <form @submit.prevent="save" @input="edited = true">
    <section class="sticky">
      <div>
        <RouterLink :to="{ path: '/heuristics'}">Heuristic Sets</RouterLink>
        <h1>Heuristic Set: {{heuristicSet.title}}</h1>
      </div>
      <button type="button" @click="addHeuristic"><IconAdd class="icon"/> Add Heuristic</button>
      <button role="submit" :disabled="!edited"><IconSave class="icon"/> Save</button>
    </section>
    <label>
      Title
      <input type="text" v-model="heuristicSet.title"/>
    </label>
    <label>
      Description
      <textarea v-model="heuristicSet.description"/>
    </label>
    <div>
      <label>
        Override Background
        <input v-model="colorOverride" type="color"/>
      </label>
      <label>
        Override Textcolour
        <input v-model="textcolorOverride" type="color"/>
      </label>
    </div>
    <label>Heuristics</label>
    <draggable v-model="heuristicSet.heuristics" item-key="id" handle=".drag-handle" ghost-class="ghost" @end="edited = true">
      <template #item="{ element }">
        <div class="list-row">
          <div class="drag-handle">⋮⋮</div>
          <div>
            <label>
              Title
              <input v-model="element.title"/>
            </label>
            <div>
            <label>
              Background
              <input @change="console.log('ch', element.id, element.color)" v-model="element.color" type="color"/>
            </label>
            <label>
              Text Colour
              <input v-model="element.textcolor" type="color"/>
            </label>
            </div>
            <label>
              Description
              <textarea v-model="element.description"></textarea>
            </label>
            <label v-if="element.title">
              Preview<br/>
              <Chip :chip="element"/>
            </label>
          </div>
          <button type="button" @click="removeHeuristic(element.id)">Remove</button>
        </div>
      </template>
    </draggable>
    <button type="button" @click="addHeuristic">Add Heuristic</button>
    <Message :success="success" :error="error" />
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

    label:last-child,
    label:nth-last-child(2) {
      flex-basis: 100%;
      margin-top: 0;
    }
  }

  label {
    font-size: 1rem;
  }

}

input:not([type="submit"]) {
  width: 100%;
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
