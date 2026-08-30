<script setup lang="ts">
import { onMounted } from 'vue';
import { useFindings } from "@/modules/findings/useFindings.ts";
import Message from "@/components/Message.vue";
import {useRoute} from "vue-router";
import Chip from "@/components/Chip.vue";
import TimeAgo from "@/components/TimeAgo.vue";
const route = useRoute();

const {
  finding,
  userRating,
  loadFinding,
  saveRating,
  success,
  error
} = useFindings();

onMounted(() => {
  loadFinding(route.params.id as string);
});
</script>


<template>
  <RouterLink :to="{ path: '/project/' + route.params.pid}">Project: {{finding.project?.title}}</RouterLink>
  <h1>Rate: {{ finding.title }}</h1>
  <hr/>
  <div class="row">
  <div class="col-3">
  <p><label>Reviewer(s):</label>
    <span>{{finding.user?.map(u => [u.firstname, u.lastname].join(" ")).join(", ")}}</span>
  </p>
  <p><label>Heuristics(s):</label>
    <template v-for="h in finding.heuristics" :key="h.id">
      <Chip :chip="h" />
    </template>
  </p>
    <p><label>Last Update:</label>
      <span><TimeAgo :date="finding.updatedat"/></span>
    </p>
  </div>
  <div class="col-9">
  <label>Description:</label>
  <p>{{ finding.description }}</p>

  <label>Images</label>
  <div class="thumbnails">
    <img v-for="i in finding.images" :src="'http://localhost:3000/'+i.path" width="100"/>
  </div>
  </div>
  </div>
  <form @submit.prevent="saveRating">
  <h3>Rate</h3>
  <div class="ratingbuttons">
    <label v-for="r in finding.project?.ratingset.ratings" :style="'--main-bg-color:'+ r.color + ';--main-text-color:'+ r.textcolor">
      <input @click="console.log('submit')" type="radio" name="rating" :value="r.id" v-model="userRating">
      <span>{{r.title}}</span>
    </label>
  </div>
  <input type="submit" value="Save"/>
  </form>

  <Message :success="success" :error="error" />
</template>

<style scoped>
.row {
  display: flex;
}
.col-3 {
  width: 33%;
}
.col-9 {
  width: 66%;
}

.ratingbuttons {
  --main-bg-color: #777;
  --main-text-color: #fff;

  display: flex;
  gap: 1rem;

  input {
    appearance: none;
    border: none;
    padding: 0;
  }

  label {
    text-align: center;
    flex: 1;
    display: flex;
    align-items: center;
    border-radius: 5px;
    border: 2px solid black;
    color: var(--main-bg-color);
    border-color: var(--main-bg-color);
    display: flex;
    justify-content: center;

    span {
      font-weight: bold;
    }
    &:hover {
      cursor: pointer;
      background-color: color-mix(in srgb, var(--main-bg-color)20%, transparent);
    }

    &:has(input:checked) {
      color: var(--main-text-color);
      background-color: color-mix(in srgb, var(--main-bg-color)60%, transparent);
    }

  }
}
</style>
