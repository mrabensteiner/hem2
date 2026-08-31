<script setup lang="ts">
import Chip from "@/components/Chip.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import IconClock from "@/components/icons/IconClock.vue";
import IconUser from "@/components/icons/IconUser.vue";
import IconCheck from "@/components/icons/IconCheck.vue";

const { finding } = defineProps<{
  finding: any
}>();
</script>

<template>
  <a class="card" :href="finding.link">
    <img v-if="finding.images?.length" :src="'http://localhost:3000/' + finding.images[0].path" />
    <div>
      <h3>{{ finding.title }}</h3>
      <p>
        <IconClock class="icon"/>
        <TimeAgo :date="finding.updatedat"/>
      </p>
      <p>
        <IconUser class="icon"/>
        {{ finding.user.join(", ") }}
      </p>
      <p>
        <IconCheck class="icon"/>
        <Chip v-for="h in finding.heuristics" :chip="h"/>
      </p>
      <p>{{finding.description}}</p>
    </div>
  </a>
</template>

<style scoped>
.card {
  color: inherit;
  background-color: var(--color-background-mute);
  border-radius: .5rem;
  padding: 0;
  box-shadow: 0 0 .5rem var(--color-border-hover);

  &:hover {
    transform: scale(1.025);
  }

  div {
   padding: .5rem;
  }

  h3 {
    font-weight: bold;
  }

  p {
    font-size: .8em;
  }
}

img {
  width: 100%;
  height: 5rem;
  object-fit: cover;
  border-radius: .5rem .5rem 0 0;
}

.icon {
  height: 1em;
  margin-right: .5em;
  vertical-align: center;
}

</style>
