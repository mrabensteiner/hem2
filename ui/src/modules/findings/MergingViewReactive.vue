<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {useManualRefHistory} from '@vueuse/core';
import draggable from 'vuedraggable';
import {useProjects} from "@/modules/projects/useProjects.ts";

const route = useRoute();

const lists = ref<any>({
  merge: [],
  origin: []
});

const { clear, undo, redo, commit, canUndo, canRedo, history } = useManualRefHistory(lists, {
  clone: true
});

const {
  project,
  loadProject,
} = useProjects();


type NumberOrNull = number | null;

const mergeTargetId = ref<NumberOrNull>(null);
let draggedListIndex: NumberOrNull = null;
let draggedItemIndex: NumberOrNull = null;
let lastMergeId: string | null = null;

onMounted(async () => {
  await loadProject(route.params.pid as string);
  const findings = project.value.Findings;

  // TODO: filter already merged and reviewed findings before and put them into the merge list
  const reviewerIds = Map.groupBy(findings, (item: any) => item.user[0]?.id);
  lists.value.origin = Array.from(reviewerIds, ([userId, items]) => {
    const name = userId == null ? 'No author' : `${items[0].user[0]?.firstname} ${items[0].user[0]?.lastname}`;
    return {
      id: userId,
      name: name,
      originalCount: items.length,
      items
    };
  });

  commit();
  clear();
});

const setMergeTarget = (id: NumberOrNull) => {
  mergeTargetId.value = id;
};

const onDragStart = (e: any, listIndex: NumberOrNull = null) => {
  draggedListIndex = listIndex;
  draggedItemIndex = e.oldIndex;
};

const executeMerge = (targetItemIndex: number) => {
  setMergeTarget(null);

  if (draggedItemIndex === null || (draggedListIndex === null && draggedItemIndex === targetItemIndex)) {
    return;
  }

  const target = lists.value.merge[targetItemIndex];
  const dragged = (draggedListIndex ? lists.value.origin[draggedListIndex].items : lists.value.merge)[draggedItemIndex];

  // TODO merge modal
  target.reviewed = true;
  target.title += ` + ${dragged.title}`;

  if (draggedListIndex === null) {
    lists.value.merge = lists.value.merge.filter((item: { id: string }) => item.id !== dragged.id);
  } else {
    lastMergeId = dragged.id;
  }
};

const handleDrop = () => {
  if (lastMergeId) {
    lists.value.merge = lists.value.merge.filter((item: { id: string }) => item.id !== lastMergeId);
  }

  // TODO: set reviewed

  setMergeTarget(null);
  draggedItemIndex = null;
  lastMergeId = null;
  commit();
};

const moveAll = (listIndex: number) => {
  lists.value.origin[listIndex].items.forEach((item: any) => {
    item.title += " (moved)"
    lists.value.merge.push(item);
  })
  lists.value.origin[listIndex].items = [];
  commit();
}
</script>


<template>
  <button @click="undo" :disabled="!canUndo">Undo</button>
  <button @click="redo" :disabled="!canRedo">Redo</button>
  <h1>Merge Findings</h1>
  <div>
    <h2>Merged <span v-if="lists.merge.length">({{lists.merge.length}})</span></h2>
    <div>
      <draggable
        v-model="lists.merge"
        item-key="id"
        @start="onDragStart"
        @end="handleDrop"
        :sort="true"
        group="people"
        class="drop-field">
      >
        <template #item="{ element, index }">
          <div class="item-row">
            <div
              :class="{ 'merge-target': mergeTargetId === element.id }"
              @dragover.prevent="setMergeTarget(element.id)"
              @dragleave="setMergeTarget(null)"
              @drop="executeMerge(index)">

              <details>
                <summary>{{element.title}}</summary>
                <section>
                  <RouterLink :to="{name: 'FindingsDetails', params: {id: element.id}}">Open</RouterLink>
                </section>
              </details>
            </div>
          </div>
        </template>
      </draggable>
    </div>
  </div>

  <div>
    <h2>Origin Lists</h2>
    <div v-for="(list, i) in lists.origin" :key="list.id">
      <h3>
        {{ list.name }}
        <span v-if="list.originalCount">({{list.originalCount - list.items.length}}/{{list.originalCount}})</span>
        <button @click="moveAll(i)" :disabled="!list.items.length" style="display: inline">Move Remaining</button>
      </h3>
      <draggable
        v-model="lists.origin[i].items"
        :group="{ name: 'people', put: false }"
        item-key="id"
        :sort="false"
        @start="onDragStart($event, i)"
        @end="handleDrop"
      >
        <template #item="{ element }">
          <div>
            <details>
              <summary>{{element.title}}</summary>
              <section>
                <RouterLink :to="{name: 'FindingsDetails', params: {id: element.id}}">Open</RouterLink>
              </section>
            </details>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>


<style scoped>
.item-row {
  margin: .5rem;
}

details {
  padding: 1rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  cursor: grab;
}

.merge-target details {
  background-color: color-mix(in srgb, var(--app-primary) 10%, transparent);
}


.drop-field {
  background-color: #eee; min-height: 10rem; border: 1px solid gray;

  .sortable-ghost {
    height: .25rem !important;
    background-color: var(--app-primary);
    margin: .5rem;

    details {
      display: none;
    }
  }
  &:has(.merge-target) .sortable-ghost {
    display: none;
  }
}

.sortable-chosen details {
  box-shadow: 0 0 .5rem var(--color-border-hover);
}
</style>

