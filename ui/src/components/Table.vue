<script setup lang="ts">
import {ref, computed, watch} from "vue";
import { Timeago } from 'vue2-timeago';
import Chip from "@/components/Chip.vue";

interface HeaderColumn {
  key: string;
  title: string;
  type?: 'link' | 'multi' | 'chip' | 'multichip' | 'time';
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

const hiddenCols = ref<string[]>(
  props.head.filter(col => col.hidden).map(col => col.key)
);

const sortedData = computed(() => {
  const key = sortKey.value;

  if (!key || props.data.length === 0) {
    return props.data;
  }

  return [...props.data].sort((a: DataRow, b: DataRow) => {
    const rawA = a[key];
    const rawB = b[key];

    const isNumA = typeof rawA === 'number' || (!isNaN(Number(rawA)) && rawA !== '');
    const isNumB = typeof rawB === 'number' || (!isNaN(Number(rawB)) && rawB !== '');

    let valA: string | number = rawA;
    let valB: string | number = rawB;

    if (isNumA && isNumB) {
      valA = Number(rawA);
      valB = Number(rawB);
    } else {
      valA = String(rawA).toUpperCase();
      valB = String(rawB).toUpperCase();
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

function toggleCol(key: string) {
  const hidden = hiddenCols.value;
  const index = hidden.indexOf(key);

  if (index !== -1) {
    hidden.splice(index, 1);
  } else {
    hidden.push(key);
  }
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
  <div class="celltoggle">
    <button
      v-for="c in hiddenCols"
      :key="c"
      @click="toggleCol(c)"
      title="Show this cell"
    >
      {{ head.find(col => col.key === c)?.title }}
    </button>
  </div>

  <div class="tablecontainer">
    <table>
      <thead>
      <tr>
        <th
          v-for="h in head"
          :key="h.key"
          :data-key="h.key"
          :class="{ 'hidden': hiddenCols.includes(h.key) }"
        >
          {{ h.title }}

          <span
            v-if="!['link', 'chip', 'multi', 'multichip'].includes(h.type || '')"
            :data-dir="sortKey === h.key ? sortDir : ''"
            @click="sortCol(h.key)"
            title="Sort"
          ></span>

          <span
            v-if="!h.locked"
            @click="toggleCol(h.key)"
            data-toggle
            title="Hide this cell"
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
          :class="{ 'hidden': hiddenCols.includes(h.key) }"
        >
          <template v-if="h.key === 'link'">
            <RouterLink :to="{ path: r.link }">Open</RouterLink>
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

.celltoggle {
  display: flex;
  justify-content: flex-end;
  gap: .5rem;

  button {
    border: none;
    font-weight: normal;
    color: var(--app-primary);
    margin: 0;
    border-radius: .25rem .25rem 0 0;
    background-color: var(--color-background-mute);
    text-decoration: none;
    padding: 0.2rem 0.5rem;

    &::before {
      content: "+ ";
    }

    &:hover {
      background-color: rgba(var(--app-primary-rgb), 0.25);
    }
  }
}

[data-toggle] {
  cursor: pointer;

  &::after {
    display: inline-block;
    margin-left: .5rem;
    font-size: 1rem;
    width: 1.5rem;
    background-color: #eee;
    content: "-";
    border-radius: .25rem;
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
