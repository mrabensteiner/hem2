<script setup lang="ts">
import Thumbnails from "@/components/Thumbnails.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import FindingStatus from "@/components/FindingStatus.vue";
import Chip from "@/components/Chip.vue";

const { finding } = defineProps<{
  finding: any,
  hideStatus?: boolean
}>();
</script>

<template>

  <div class="row" v-if="finding.id">
    <div class="col-9">
      <div>
        <label>
          <template v-if="finding.user?.length > 1">Reviewers:</template>
          <template v-else>Reviewer:</template>
          &nbsp;
        </label>
        <span>{{finding.user?.map(u => [u.firstname, u.lastname].join(" ")).join(", ")}}</span>
      </div>
      <div>
        <label>
          <template v-if="finding.heuristics?.length > 1">Heuristic:</template>
          <template v-else>Heuristics:</template>
          &nbsp;
        </label>
        <template v-if="finding.heuristics?.length" v-for="h in finding.heuristics" :key="h.id">
          <Chip :chip="h" />
        </template>
        <template v-else>
          None
        </template>
      </div>
      <div>
        <label>Last Update:&nbsp;</label>
        <span><TimeAgo :date="finding.updatedat"/></span>
      </div>
      <label>Description:&nbsp;</label>
      <p>{{ finding.description }}</p>

      <label>Remarks or Recommendations:</label>
      <p>{{ finding.remarks }}</p>
    </div>
    <div class="col-3">

      <label>Images and Videos&nbsp;</label><br/>
      <Thumbnails v-if="finding.images?.length" :images="finding.images"/>
      <span v-else>No images</span>

      <p v-if="!hideStatus">
        <label>Overall Rating:&nbsp;</label>
        <span v-if="finding.rating"><Chip :chip="finding.rating"/></span>
        <span v-else>Not yet rated</span>
      </p>

      <p v-if="!hideStatus">
        <label>My Rating:&nbsp;</label>
        <span v-if="finding.userRating?.rating"><Chip :chip="finding.userRating.rating"/></span>
        <span v-else>Not yet rated</span>
      </p>

      <div v-if="!hideStatus">
        <label>Finding Status: &nbsp;</label>
        <FindingStatus :finding="finding"/>
      </div>

      <div v-if="finding.mergedToId">
        <label>Merged To:&nbsp;</label>
        <RouterLink :to="{ params: {id: finding.mergedTo.id} }">{{finding.mergedTo.title}}</RouterLink>
      </div>

      <div v-if="finding.mergedFrom?.length">
        <label>Merged from:&nbsp;</label>
        <template v-for="(f,i) in finding.mergedFrom">
          <RouterLink :to="{ params: {id: f.id} }">
            {{f.title}}
          </RouterLink>
          <template v-if="i + 1 < finding.mergedFrom?.length">, </template>
        </template>
      </div>
    </div>
  </div>
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

div {
  margin-bottom: 1rem;
}
</style>
