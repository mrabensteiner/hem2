<script setup lang="ts">
import Chip from "@/components/Chip.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import IconClock from "@/components/icons/IconClock.vue";
import IconUser from "@/components/icons/IconUser.vue";
import IconCheck from "@/components/icons/IconCheck.vue";
import IconOpen from "@/components/icons/IconOpen.vue";
import Thumbnails from "@/components/Thumbnails.vue";

const { finding } = defineProps<{
  finding: any
}>();
</script>

<template>
  <details>
    <summary>
      <span class="title">{{finding.title}}</span>
    </summary>
    <section>
      <ul>
        <li>
          <IconUser class="icon"/>
          {{ finding.user.map(u => `${u.firstname} ${u.lastname}`).join(", ") }}
        </li>
        <li>
          <IconClock class="icon"/>
          <TimeAgo :date="finding.updatedat"/>
        </li>
        <li>
          <IconCheck class="icon"/>
          <Chip v-for="h in finding.heuristics" :chip="h"/>
          <span v-if="!finding.heuristics?.length">no heuristic</span>
        </li>
        <li v-if="finding.mergedTo">
          Merged to: {{finding.mergedTo}}
        </li>
        <li v-if="finding.mergedFrom.length">
          Merged from:
          <template v-for="(f, i) in finding.mergedFrom">
            <RouterLink :to="{name: 'FindingsDetails', params: {id: f.id}}" target="_blank">{{f.title}}</RouterLink>
            <template v-if="i + 1 < finding.mergedFrom?.length">, </template>
          </template>
        </li>
      </ul>
      <p>{{finding.description}}</p>
      <img v-if="finding.images?.length" :src="'http://localhost:3000/' + finding.images[0].path" />
      <RouterLink :to="{name: 'FindingsDetails', params: {id: finding.id}}" target="_blank">
        Open <IconOpen class="icon icon-right"/>
      </RouterLink>
    </section>
  </details>
</template>

<style scoped>
details {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border-hover);
  color: inherit;

  &, summary {
    border-radius: .5rem;
  }

  summary, section {
    padding: 1rem;
  }

  summary {
    border-radius: .5rem;
    background-color: var(--color-background);

    &::marker {
      color: var(--app-primary);
      cursor: pointer;
    }

    .title {
      line-height: 1.3;
    }
  }

  section {
    padding-top: .5rem;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li, p {
    font-size: .8em;
  }
}

.icon {
  height: 1em;
  margin-right: .5em;
  vertical-align: center;

  &.icon-right {
    margin-right: 0;
  }
}
</style>
