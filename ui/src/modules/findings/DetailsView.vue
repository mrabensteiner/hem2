<script setup lang="ts">
import {onMounted, watch} from 'vue';
import { useFindings } from "@/modules/findings/useFindings.ts";
import {useRoute} from "vue-router";
import IconEdit from "@/components/icons/IconEdit.vue";
import IconRate from "@/components/icons/IconRate.vue";
import {useAuth} from "@/composables/useAuth.ts";
import FindingFull from "@/components/FindingFull.vue";

const route = useRoute();

const {
  hasPrivilege
} = useAuth()

const {
  finding,
  loadFinding,
} = useFindings();

onMounted(() => {
  loadFinding(route.params.id as string);
});

watch(
  () => route.params.id,
  (id) => {
    if (id != finding.value.id) {
      loadFinding(id as string);
    }
  }
);
</script>


<template>
  <section class="sticky">
    <div>
      <RouterLink :to="{ path: '/project/' + route.params.pid}">Project: {{finding.project?.title}}</RouterLink>
      <h1>Finding: {{ finding.title }}</h1>
    </div>
    <RouterLink class="button" v-if="hasPrivilege('findingEditOwn', finding.project)" :to="{ name: 'FindingsEdit' }"><IconEdit class="icon"/> Edit</RouterLink>
  </section>

  <FindingFull :finding="finding"/>

  <RouterLink class="button" v-if="hasPrivilege('ratingEdit', finding.project)" :to="{ name: 'FindingsRate', params: {id: route.params.id, return: 'FindingsView'} }"><IconRate class="icon"/> Rate Finding</RouterLink>
</template>
