<script setup lang="ts">
import {ref, computed, watch} from "vue";
import { Timeago } from 'vue2-timeago';
import Chip from "@/components/Chip.vue";

const props = defineProps<{
  head: Object[],
  data: Object[],
  sort: string,
  dir: string
}>()

const sortKey = ref(props.sort);
const sortDir = ref("asc");
const hiddenCols = ref( props.head.filter(col => col.hidden).map(col => col.key));

const sortedData = computed(() => {
  const key = sortKey.value;
  return [...props.data].sort((a, b) => {
    const valA = a[key].toUpperCase();
    const valB = b[key].toUpperCase();

    let modifier = 1;
    if(sortDir.value === 'desc') modifier = -1;
    if(valA < valB) return -1 * modifier;
    if(valA > valB) return 1 * modifier;
    return 0;
  });
});

function sortCol(key, col) {
  if (col.dir == "asc") {
    col.dir = "desc";
  } else if (col.dir == "desc" || col.dir == null) {
    col.dir = "asc";
  }
  sortKey.value = key;
  sortDir.value = col.dir;
}

function toggleCol(key) {
  const hidden = hiddenCols.value;
  if (hidden.includes(key)) {
    hidden.splice(hidden.indexOf(key), 1);
  } else {
    hidden.push(key);
  }
}

watch(
  () => props.sort,
  (newsort) => {
    const col = props.head.find(col => col.key == newsort);
    col.dir = props.dir;
    sortCol(newsort, col);
  },
  { immediate: true }
);

</script>

<template>
  <div class="celltoggle">
    <a v-for="c in hiddenCols" href="javascript:;" @click="toggleCol(c)">{{ head.find(col => col.key == c).title }}</a>
  </div>
  <table>
    <thead>
    <tr>
      <th v-for="h in head" :data-key="h.key" :class="hiddenCols.includes(h.key) ? 'hidden' : ''">
        {{ h.title }}
        <span v-if="!['link', 'chip', 'multi', 'multichip'].includes(h.type)" :data-dir="h.dir ? h.dir : ''" @click="sortCol(h.key, h)"></span>
        <span v-if="!h.locked" @click="toggleCol(h.key)" data-toggle></span>
      </th>
    </tr>
    </thead>
    <tbody>
      <tr v-for="r in sortedData">
        <td v-for="h in head" :data-key="h.key" :data-value="r[h.key]"  :class="hiddenCols.includes(h.key) ? 'hidden' : ''">
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
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  border-top: 1px solid dimgrey;
  border-bottom: 1px solid dimgrey;
  color: dimgrey;
  text-transform: uppercase;
  font-size: .7rem;

  th {
    white-space: nowrap;
  }
}

tbody tr:nth-child(odd) {
  background-color: whitesmoke;
}

.hidden {
  display: none;
}

.celltoggle {
  display: flex;
  justify-content: flex-end;
  gap: .1rem;
  a {
    border-radius: .25rem .25rem 0 0;
    background-color: #eee;
    &::before {
      content: "+";
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
