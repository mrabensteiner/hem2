<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSeverityDetail } from "@/composables/useSeverityDetail.ts";
import draggable from 'vuedraggable';

const route = useRoute();
const router = useRouter();

const isNewSeveritySet = computed(() => route.params.id === 'new');

const {
  severitySet,
  loadSeveritySet,
  saveSeveritySet,
  addSeverity,
  removeSeverity
} = useSeverityDetail();

onMounted(() => {
  loadSeveritySet(route.params.id as string, isNewSeveritySet.value);
});

async function save() {
  await saveSeveritySet(isNewSeveritySet.value);

  if (isNewSeveritySet.value) {
    router.push('/severities');
  }
}
</script>

<style>
input[type="text"], input[type="password"], select, textarea {
  width: 100%;
}

hr {
  margin: 1rem 0;
}
</style>

<template>
  <h1>Severity Set</h1>
  <form @submit.prevent="save">
    <label>
      Title
      <input type="text" v-model="severitySet.title"/>
    </label>
    <label>
      Description
      <textarea v-model="severitySet.description"/>
    </label>
    <label>Severities</label>
    <draggable v-model="severitySet.severities" item-key="id" handle=".drag-handle" ghost-class="ghost">
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
          <button type="button" @click="removeSeverity(element.id)">Remove</button>
        </div>
      </template>
    </draggable>
    <button type="button" @click="addSeverity">Add Severity</button>
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
