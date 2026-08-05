<script setup lang="ts">
import {ref, computed, watch} from "vue";
import { Timeago } from 'vue2-timeago';
import Chip from "@/components/Chip.vue";

interface HeaderColumn {
  key: string;
  title: string;
  type?: 'link' | 'multi' | 'chip' | 'multichip' | 'time';
  sortable?: boolean;
  hidden?: boolean;
  locked?: boolean;
}

type DataRow = Record<string, any>;
type SortDirection = 'asc' | 'desc';

const props = defineProps<{
  head: HeaderColumn[];
  data: DataRow[];
  sort?: string;
  dir?: SortDirection;
}>();

const columnDirections = ref<Record<string, SortDirection>>({});
const sortKey = ref<string>(props.sort || "");
const sortDir = ref<SortDirection>(props.dir || "asc");

const visibleCols = ref<string[]>(
  props.head.filter(col => !col.hidden).map(col => col.key)
);

const sortedData = computed(() => {
  const key = sortKey.value;

  if (!key || props.data.length === 0) {
    return props.data;
  }

  return [...props.data].sort((a: DataRow, b: DataRow) => {
    let valA = a[key];
    let valB = b[key];

    if (props.head.find(h => h.type === 'chip')) {
      valA = valA?.order ?? -1;
      valB = valB?.order ?? -1;
    }

    const isNumA = typeof valA === 'number' || (!isNaN(Number(valA)) && valA !== '');
    const isNumB = typeof valB === 'number' || (!isNaN(Number(valB)) && valB !== '');

    if (isNumA && isNumB) {
      valA = Number(valA);
      valB = Number(valB);
    } else {
      valA = String(valA).toUpperCase();
      valB = String(valB).toUpperCase();
    }

    const modifier = sortDir.value === 'desc' ? -1 : 1;
    if (valA < valB) return -1 * modifier;
    if (valA > valB) return 1 * modifier;
    return 0;
  });
});

function sortCol(key: string) {
  const currentDir = columnDirections.value[key];

  let nextDir: SortDirection = 'asc';
  if (sortKey.value === key) {
    nextDir = currentDir === 'asc' ? 'desc' : 'asc';
  } else if (currentDir) {
    nextDir = currentDir;
  }

  columnDirections.value[key] = nextDir;
  sortKey.value = key;
  sortDir.value = nextDir;
}

watch(
  () => props.sort,
  (newSort) => {
    if (!newSort) return;

    const initialDir = props.dir || "asc";
    columnDirections.value[newSort] = initialDir;
    sortKey.value = newSort;
    sortDir.value = initialDir;
  },
  { immediate: true }
);

</script>

<template>
  <div class="col-toggle-container">
    <div class="col-toggle">
      <div>Toggle Columns</div>
      <div v-for="col in head">
        <label>
          <input type="checkbox" :value="col.key" v-model="visibleCols" :disabled="col.locked" />
          {{ col.title }}
        </label>
      </div>
    </div>
  </div>

  <div class="tablecontainer">
    <table>
      <thead>
      <tr>
        <th
          v-for="h in head"
          :key="h.key"
          :data-key="h.key"
          :class="{ 'hidden': !visibleCols.includes(h.key) }"
        >
          {{ h.title }}

          <span
            v-if="!['link', 'multi', 'multichip'].includes(h.type || '') || h.sortable"
            :data-dir="sortKey === h.key ? sortDir : ''"
            @click="sortCol(h.key)"
            title="Sort"
          ></span>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="data.length === 0">
        <td :colspan="head.length">Empty - create new entries</td>
      </tr>
      <tr v-for="(r, rIdx) in sortedData" :key="rIdx">
        <td
          v-for="h in head"
          :key="h.key"
          :data-key="h.key"
          :data-value="r[h.key]"
          :class="{ 'hidden': !visibleCols.includes(h.key) }"
        >
          <template v-if="h.type === 'link'">
            <RouterLink :to="{ path: r.link }">
              <template v-if="h.key === 'link'">Open</template>
              <template v-else>{{ r[h.key] }}</template>
            </RouterLink>
          </template>
          <template v-else-if="h.type === 'multi'">
            {{ r[h.key].join(", ") }}
          </template>
          <template v-else-if="h.type === 'chip'">
            <Chip :chip="r[h.key]" />
          </template>
          <template v-else-if="h.type === 'multichip'">
            <Chip v-for="c in r[h.key]" :chip="c" />
          </template>
          <template v-else-if="h.type === 'time'">
            <abbr :title="new Date(r[h.key]).toLocaleString('en-GB')"><timeago :datetime="r[h.key]"/></abbr>
          </template>
          <template v-else>{{ r[h.key] }}</template>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.tablecontainer {
  width: 100%;
  overflow-x: auto;
  margin-bottom: 1rem;
}

table {
  width: 100%;
  overflow: hidden;
  border-collapse: collapse;
}

thead {
  border-top: 1px solid dimgrey;
  border-bottom: 1px solid dimgrey;
  color: dimgrey;
  font-size: 1rem;

  th {
    white-space: nowrap;
  }
}

tbody {
  tr:nth-child(odd) {
    background-color: var(--color-background-mute);
  }
  td {
    padding: .5rem;
  }

}

.hidden {
  display: none;
}

.col-toggle-container {
  display: flex;
  justify-content: end;
  margin-bottom: 2.6rem;

  &:not(:has(input:enabled)) {
    display: none;
  }
}

.col-toggle {
  display: flex;
  flex-direction: column;
  position: absolute;
  cursor: pointer;

  > div {
    background-color: var(--color-background-mute);
  }

  > div:first-child {
    padding: .5rem;
    border-radius: .5rem .5rem 0 0;
    align-self: end;
  }

  > div:not(:first-child) {
    display: none;
  }

  &:hover > div:not(:first-child) {
    display: block;
    padding: 0 .25rem;
  }
}

[data-dir] {
  cursor: pointer;

  &::after {
    display: inline-block;
    margin-left: .5rem;
    font-size: 1rem;
    width: 1.5rem;
    background-color: #eee;
    content: "⥮";
    border-radius: .25rem;
  }
}

[data-dir="desc"]::after {
  content: "⥣";
}

[data-dir="asc"]::after {
  content: "⥥";
}
</style>
