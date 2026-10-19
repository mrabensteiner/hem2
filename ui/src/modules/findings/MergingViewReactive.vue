<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {useManualRefHistory} from '@vueuse/core';
import draggable from 'vuedraggable';
import {useFindings} from "@/modules/findings/useFindings.ts";
import FindingCollapsible from "@/components/FindingCollapsible.vue";
import MergeModal from "@/components/MergeModal.vue";

const route = useRoute();

const lists = ref<any>({
  merge: [],
  origin: []
});

const modalMergeComponent =ref<InstanceType<typeof MergeModal> | null>(null);
const targetIndex = ref<NumberOrNull>(null);
const findingMerge = ref<any>({});
const findingMergeLeft = ref<any>({});
const findingMergeRight = ref<any>({});

const { clear, undo, redo, reset, commit, canUndo, canRedo, history } = useManualRefHistory(lists, {
  clone: true
});

const {
  allFindings,
  loadAllFindings,
  saveAllFindings,
} = useFindings();


type NumberOrNull = number | null;

const mergeTargetId = ref<NumberOrNull>(null);
let draggedListIndex: NumberOrNull = null;
let draggedItemIndex: NumberOrNull = null;
let lastMergeId: string | null = null;

onMounted(async () => {
  await loadAllFindings(route.params.pid as string);
  splitFindings();
});

function splitFindings() {
  // TODO: filter already merged and reviewed findings before and put them into the merge list
  const findings: any[] = allFindings.value;
  const reviewed = findings.filter(f => (f.reviewed || f.mergedFrom.length) && !f.mergedTo);
  const notReviewed = findings.filter(f => !(f.reviewed || f.mergedFrom.length || f.mergedTo));
  lists.value.merge = reviewed;
  const reviewerIds = Map.groupBy(notReviewed, (item: any) => item.user[0]?.id);
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
}

const setMergeTarget = (id: NumberOrNull) => {
  mergeTargetId.value = id;
};

const onDragStart = (e: any, listIndex: NumberOrNull = null) => {
  draggedListIndex = listIndex;
  draggedItemIndex = e.oldIndex;
};

function startMerge(targetItemIndex: number) {
  setMergeTarget(null);

  if (draggedItemIndex === null || (draggedListIndex === null && draggedItemIndex === targetItemIndex)) {
    return;
  }

  targetIndex.value = targetItemIndex;

  const target = lists.value.merge[targetItemIndex];
  const dragged = (draggedListIndex != null ? lists.value.origin[draggedListIndex].items : lists.value.merge)[draggedItemIndex];
  dragged.reviewed = false;

  findingMergeLeft.value = target;
  findingMergeLeft.value = lists.value.merge[targetItemIndex];
  findingMergeRight.value = dragged;

  findingMergeLeft.value.heuristicIds = findingMergeLeft.value.heuristics.map((item: any) => item.id);
  findingMergeRight.value.heuristicIds = findingMergeRight.value.heuristics.map((item: any) => item.id);

  findingMergeLeft.value.userIds = findingMergeLeft.value.user.map((item: any) => item.id);
  findingMergeRight.value.userIds = findingMergeRight.value.user.map((item: any) => item.id);

  findingMerge.value = {...target};
  findingMerge.value.images = [...findingMerge.value.images, ...findingMergeRight.value.images];

  lastMergeId = dragged.id;
  modalMergeComponent.value?.openModal();

}

function saveMerge() {
  if (targetIndex === null) return;
  const target = lists.value.merge[targetIndex.value as number];
  const dragged = findingMergeRight.value;
  const merged = findingMerge.value;

  target.newMerge = target.newMerge || target.mergedFromIds.length == 0;
  target.reviewed = true;

  target.images = [...(target.images ?? []), ...(dragged.images ?? [])];
  target.mergedFrom = [...(target.mergedFrom.length ? target.mergedFrom : [findingMergeLeft.value]), ...(dragged.mergedFrom.length ? dragged.mergedFrom : [dragged])];
  target.mergedFromIds = [...(target.mergedFromIds.length ? target.mergedFromIds : [target.id]), ...(dragged.mergedFromIds.length ? dragged.mergedFromIds : [dragged.id])];
  target.title = merged.title;
  target.description = merged.description;
  target.user = merged.user;
  target.userIds = merged.userIds;
  target.heuristics = merged.heuristics;
  target.heuristicIds = merged.heuristicIds;

 lists.value.merge[targetIndex.value as number] = target;

  setMergeTarget(null);

  if (draggedListIndex === null) {
    lists.value.merge = lists.value.merge.filter((item: { id: string }) => item.id !== dragged.id);
  } else {
    lists.value.origin[draggedListIndex].items.splice(draggedListIndex, 1);
    lastMergeId = dragged.id;
  }

  commit();
}

const handleDrop = (e: any) => {
  if (lastMergeId != null) {
    reset();
  } else {
    commit();
  }

  draggedItemIndex = null;
  lastMergeId = null;
};

const moveAll = (listIndex: number) => {
  lists.value.origin[listIndex].items.forEach((item: any) => {
    lists.value.merge.push(item);
  })
  lists.value.origin[listIndex].items = [];
  commit();
};

const save = async () => {
  allFindings.value = lists.value.merge;
  await saveAllFindings();
  splitFindings();
};
</script>


<template>
  <section class="sticky">
    <h1>Merge Findings</h1>
    <button @click="undo" :disabled="!canUndo">Undo</button>
    <button @click="redo" :disabled="!canRedo">Redo</button>
    <button @click="save" :disabled="!history">Save</button>
  </section>

  <div class="flex flex-half">
    <div class="flex flex-column">
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
                @drop="startMerge(index)"
              >
                  <FindingCollapsible :finding="element"/>
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
            <div class="item-row">
              <FindingCollapsible :finding="element"/>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
  <MergeModal ref="modalMergeComponent" @close="lastMergeId == null" :save-callback="saveMerge" v-model="findingMerge" :findingLeft="findingMergeLeft" :findingRight="findingMergeRight"/>
</template>


<style scoped>
.flex {
  flex: 1;
}

.item-row {
  margin: .5rem;
  cursor: grab;
}

.merge-target {
  &:deep(details), &:deep(summary) {
    background-color: color-mix(in srgb, var(--app-primary) 10%, transparent);
  }
}

div:has(> .drop-field) {
  flex: 1 0 10%;
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

