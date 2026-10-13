<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import draggable from 'vuedraggable';
import {useProjects} from "@/modules/projects/useProjects.ts";

const route = useRoute();

const {
  loadProject,
} = useProjects();

const originLists = ref<any[]>([]);
const mergeList = ref<any>({items:[]});

type NumberOrNull = number | null;

const mergeTargetId = ref<NumberOrNull>(null);
let draggedListIndex: NumberOrNull = null;
let draggedItemIndex: NumberOrNull = null;
let lastMergeId: string | null = null;

onMounted(() => {
  loadProject(route.params.pid as string).then((data) => {
    const findings = data.Findings;

    // TODO: filter already merged and reviewed findings before and put them into the merge list
    const reviewerIds = Map.groupBy(findings, (item: any) => item.user[0]?.id);
    originLists.value = Array.from(reviewerIds, ([userId, items]) => {
      const name = userId == null ? 'No author' : `${items[0].user[0]?.firstname} ${items[0].user[0]?.lastname}`;
      return {
        id: userId,
        name: name,
        originalCount: items.length,
        items
      };
    });
  });
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

  const target = mergeList.value.items[targetItemIndex];
  const dragged = (draggedListIndex ? originLists.value[draggedListIndex] : mergeList.value).items[draggedItemIndex];

  // TODO merge modal
  target.reviewed = true;
  target.title += ` + ${dragged.title}`;

  if (draggedListIndex === null) {
    mergeList.value.items = mergeList.value.items.filter((item: { id: string }) => item.id !== dragged.id);
  } else {
    lastMergeId = dragged.id;
  }
};

const handleDrop = () => {
  if (lastMergeId) {
    mergeList.value.items = mergeList.value.items.filter((item: { id: string }) => item.id !== lastMergeId);
  }

  // TODO: set reviewed

  setMergeTarget(null);
  draggedItemIndex = null;
  lastMergeId = null;
};

const moveAll = (listIndex: number) => {
  originLists.value[listIndex].items.forEach((item: any) => {
    item.title += " (moved)"
    mergeList.value.items.push(item);
  })
  originLists.value[listIndex].items = [];
}
</script>


<template>
  <h1>Merge Findings</h1>
  <div>
    <h2>Merged <span v-if="mergeList.items.length">({{mergeList.items.length}})</span></h2>
    <div>
      <draggable
        v-model="mergeList.items"
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
    <div v-for="(list, i) in originLists" :key="list.id">
      <h3>
        {{ list.name }}
        <span v-if="list.originalCount">({{list.originalCount - list.items.length}}/{{list.originalCount}})</span>
        <button @click="moveAll(i)" :disabled="!list.items.length" style="display: inline">Move Remaining</button>
      </h3>
      <draggable
        v-model="originLists[i].items"
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

