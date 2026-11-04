<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useFindings } from "@/modules/findings/useFindings.ts";
import {useRoute, useRouter} from "vue-router";
import FindingFull from "@/components/FindingFull.vue";
import IconSave from "@/components/icons/IconSave.vue";
import IconOpen from "@/components/icons/IconOpen.vue";
import IconEdit from "@/components/icons/IconEdit.vue";
import {useAuth} from "@/composables/useAuth.ts";
const route = useRoute();
const router = useRouter();

const {
  hasPrivilege
} = useAuth();

const {
  finding,
  userRating,
  loadFinding,
  saveRating,
} = useFindings();

onMounted(() => {
  const id = (route.params.id as string) ?? "";
  loadFinding(id, false, route.params.pid as string).then(() =>
    router.replace({params: {id: finding.value.id}})
  );
});

watch(
  () => route.params.id,
  (id) => {
    if (id != finding.value.id) {
      loadFinding(id as string, false, route.params.pid as string);
    }
  }
);

function save(event: SubmitEvent) {
  const next = event.submitter?.dataset.next == "true";

  saveRating(next).then(() => {
    if (route.params.id && !next) {
      router.push({name: 'FindingsDetails'})
    } else {
      router.push({params: {id: finding.value.id}});
    }
  });
}
</script>


<template>
  <section class="sticky">
    <div>
      <RouterLink :to="{ path: '/project/' + route.params.pid}">Project: {{finding.project?.title}}</RouterLink>
      <h1>Rate: {{ finding.title }}</h1>
    </div>
  </section>

  <div v-if="route.params.id && finding.id">
    <FindingFull :finding="finding" :hide-status="true"/>

    <form @submit.prevent="save">
      <h3>Rate</h3>
      <div class="ratingbuttons">
        <label v-for="r in finding.project?.ratingset.ratings" :style="'--main-bg-color:'+ r.color + ';--main-text-color:'+ r.textcolor">
          <input type="radio" name="rating" :value="r.id" v-model="userRating">
          <span>{{r.title}}</span>
        </label>
      </div>
      <div class="button-row">
        <button type="button" @click="userRating = null">Reset Rating</button>
        <RouterLink v-if="finding.id" :to="{name: 'FindingsDetails', params: { id: finding.id }}" class="button">Back to View</RouterLink>
        <RouterLink v-if="hasPrivilege('findingEditOwn', finding.project)" :to="{name: 'FindingsEdit'}" class="button"><IconEdit class="icon"/> Edit</RouterLink>
        <button :disabled="!userRating"><IconSave class="icon"/> Save</button>
        <button :disabled="!userRating" data-next="true"><IconOpen class="icon"/> Save and Rate Next</button>
      </div>
    </form>
  </div>

  <p v-if="!finding.id">No more findings to rate.</p>
</template>

<style scoped>
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
    border: 2px solid var(--main-bg-color);
    color: var(--main-bg-color);
    display: flex;
    justify-content: center;

    line-height: 1.3;
    padding: .5rem;

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
