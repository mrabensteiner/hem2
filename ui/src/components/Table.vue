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
const filterKeys = ref<any>({});

const visibleCols = ref<string[]>(
  props.head.filter(col => !col.hidden).map(col => col.key)
);

const filteredData = computed(() => {
  return [...props.data].filter(function (row: any) {
    let filtered = true;
    Object.keys(filterKeys.value).forEach((key: string) => {
      let rowValue = row[key];
      rowValue = rowValue.id ?? rowValue;
      const colType = filterKeys.value[key].type;

      if (colType == undefined || ["link", "chip"].includes(colType) ) {
        if (!filterKeys.value[key]['filter'].includes(rowValue)) {
          filtered = false;
        }
      } else if (["multi", "multichip"].includes(colType)) {
        let subfilter = false;
        rowValue.forEach((f: any) => {
          const value = f.id ?? f;
          if (filterKeys.value[key]['filter'].includes(value)) {
            subfilter = true;
          }
        })
        filtered = filtered && subfilter;
      }
    });
    return filtered;
  });
});

const sortedData = computed(() => {
  const key = sortKey.value;
  const data = filteredData.value;

  if (!key || data.length === 0) {
    return data;
  }

  return [...data].sort((a, b) => sortHelper(a,b, key));
});

function sortHelper(a: DataRow, b: DataRow, key: string) {
  let valA = a[key];
  let valB = b[key];

  valA = valA.order ?? valA;
  valB = valB.order ?? valB;

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
}

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

function activeFilter(key: string) {
  return filterKeys.value[key]["filter"].length != filterKeys.value[key]["options"].length;
}

function resetFilter(key: string) {
  filterKeys.value[key]["filter"] = filterKeys.value[key]["options"].map((o: any) => o.id);
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

watch(
  () => [props.head, props.data],
  ([newHead, newData]) => {
    if (newHead == undefined || newData == undefined) return;

    let localFilter: { [key: string]: any } = {};

    newHead.forEach((h: any) => {
      const key = h.key ?? "";
      localFilter[key] = {
        type: h.type,
        options: [],
        filter: []
      };

      newData.forEach((d: any) => {
        const value = [d[h.key]].flat();

        value.forEach((v: any) => {
          const id = v.id ?? v;
          const title = v.title ?? v;
          const order = v.order;

          const index = localFilter[key].filter.indexOf(id);
          if (index === -1) {
            localFilter[key].filter.push(id);
            localFilter[key].options.push({
              id: id,
              title: title,
              order: order,
              count: 1
            });
          } else {
            localFilter[key].options[index].count += 1;
          }
        })
      });

      if (["chip", "multichip"].includes(h.type)) {
        localFilter[key]['options'].sort((a: any , b: any) => sortHelper(a, b,"order"));
      } else {
        localFilter[key]['options'].sort((a: any, b:any) => sortHelper(a, b,"title"));
      }
    });

    filterKeys.value = localFilter;
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
            :class="sortKey == h.key ? 'active' : ''"
            title="Sort"
          ></span>

          <span
            v-if="!['link', 'time'].includes(h.type || '') || h.sortable"
            :data-filter="h.key"
            :class="activeFilter(h.key) ? 'active' : ''"
            title="Filter"
          >
            <div>
              <div>
                <label>
                  <input type="checkbox" @click="resetFilter(h.key)" :disabled="!activeFilter(h.key)" :checked="!activeFilter(h.key)">
                  All
                </label>
              </div>
              <div>
                <div v-for="r in filterKeys[h.key]['options']" :key="'filter-' + h.key + r">
                  <label>
                    <input type="checkbox" :value="r.id" v-model="filterKeys[h.key]['filter']">
                    {{ r.title }} ({{ r.count }})
                  </label>
                </div>
              </div>
            </div>
          </span>
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
  table-layout: fixed;
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

[data-dir], [data-filter] {
  cursor: pointer;

  &::after {
    display: inline-block;
    margin-left: .25rem;
    font-size: 1rem;
    width: 1.5rem;
    background-color: #eee;
    border-radius: .25rem;
  }

  &[data-dir]::after {
    content: "⥮";
  }
  &[data-filter]::after {
    content: "V";
  }
  &.active::after {
    background-color: var(--app-primary);
    color: var(--color-background);
  }
}

[data-filter]:not(:hover) div {
  display: none
}

[data-filter] > div {
  background-color: var(--color-background-mute);
  border: 2px solid var(--color-border);
  position: absolute;
  width: fit-content;
  text-align: left;

  > div {
    margin: .5rem;
  }
  > div:last-child {
    background-color: var(--color-background);
    max-height: 20vh;
    overflow-y: scroll;

    > div {
      border-bottom: 1px solid var(--color-border);
    }
  }
}

[data-dir][data-dir="desc"]::after {
  content: "⥣";
}

[data-dir][data-dir="asc"]::after {
  content: "⥥";
}
</style>
