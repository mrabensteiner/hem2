<script setup lang="ts">
import {ref, watch} from "vue";
import {useProjects} from "@/modules/projects/useProjects.ts";
import Chip from "@/components/Chip.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import IconClock from "@/components/icons/IconClock.vue";
import IconUser from "@/components/icons/IconUser.vue";
import IconCheck from "@/components/icons/IconCheck.vue";
import IconOpen from "@/components/icons/IconOpen.vue";
import Thumbnails from "@/components/Thumbnails.vue";
import IconTriangle from "@/components/icons/IconTriangle.vue";
import IconEdit from "@/components/icons/IconEdit.vue";
import IconSave from "@/components/icons/IconSave.vue";
import IconCancel from "@/components/icons/IconCancel.vue";

const model = defineModel<any>();

const { finding, commit } = defineProps<{
  finding: any,
  commit?: () => void
}>();

const isEditing = ref<boolean>(false);
const editedFinding = ref<any>({});

const { project } = useProjects();

watch(
  () => isEditing.value,
  (newVal) => {
    if (newVal) {
      model.value.isEditing = true;
      editedFinding.value = {
        ...model.value,
        userIds: model.value.user?.map((u: any) => u.id),
        heuristicIds: model.value.heuristics?.map((i: any) => i.id),
        imageIds: model.value.images?.map((i: any) => i.id),
      };
    } else {
      delete model.value.isEditing;
      editedFinding.value = {};
    }
  }
)

function save() {
  const allUsers = project.value.UserInProject;
  const allHeuristics = project.value.heuristicset.heuristics;
  const allImages = model.value.images;

  model.value = {
    ...editedFinding.value,
    user: editedFinding.value.userIds.map((id: string) => allUsers.find((u: any) => u.userId === id).user),
    heuristics: editedFinding.value.heuristicIds.map((id: string) => allHeuristics.find((h: any) => h.id === id)),
    images: editedFinding.value.imageIds.map((id: string) => allImages.find((i: any) => i.id === id)),
    updatedat: new Date().toISOString()
  };

  isEditing.value = false;
  if (commit) commit();
}
</script>

<template>
  <details>
    <summary>
      <IconTriangle class="icon"/>
      <input v-if="isEditing" v-model="editedFinding.title"/>
      <span v-else class="title">{{finding.title}}</span>
      <img v-if="finding.images.length && !isEditing" :src="'http://localhost:3000/' + finding.images[0]?.path"/>
      <button type="button" v-if="isEditing" @click="save"><IconSave class="icon"/></button>
      <button v-if="model" type="button" @click="isEditing = !isEditing">
        <template v-if="isEditing"><IconCancel type="button" class="icon"/></template>
        <template v-else><IconEdit type="button" class="icon"/></template>
      </button>
    </summary>
    <section>
      <ul>
        <li>
          <IconClock class="icon"/>
          <TimeAgo :date="finding.updatedat"/>
        </li>
        <li>
          <IconUser class="icon"/>
          <template v-if="isEditing">
            Reviewers
            <select v-if="isEditing" v-model="editedFinding.userIds" multiple>
              <option v-for="uip in project.UserInProject" :value="uip.userId">
                {{uip.user.firstname}} {{uip.user.lastname}}
              </option>
            </select>
          </template>
          <template v-else>
            {{ finding.user.map(u => `${u.firstname} ${u.lastname}`).join(", ") }}
            <span v-if="!finding.user?.length">no reviewer</span>
          </template>
        </li>
        <li>
          <IconCheck class="icon"/>
          <template v-if="isEditing">
            Heuristics
            <select v-if="isEditing" v-model="editedFinding.heuristicIds" multiple>
              <option v-for="h in project.heuristicset?.heuristics" :value="h.id"><Chip :chip="h"/></option>
            </select>
          </template>
          <template v-else>
            <Chip v-for="h in finding.heuristics" :chip="h"/>
            <span v-if="!finding.heuristics?.length">no heuristic</span>
          </template>
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

      <label>Description</label>
      <textarea v-if="isEditing" v-model="finding.description"/>
      <p v-else-if="finding.description.length">{{finding.description}}</p>
      <p v-else>-</p>

      <label>Remarks</label>
      <textarea v-if="isEditing" v-model="finding.remarks"/>
      <p v-else-if="finding.remarks.length">{{finding.remarks}}</p>
      <p v-else>-</p>

      <Thumbnails :images="finding.images" v-model="editedFinding.imageIds"/>
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
    padding: .75rem;
  }

  summary {
    display: flex;
    align-items: center;
    border-radius: .5rem;
    background-color: var(--color-background);

    :nth-child(2) {
      flex: 1;
    }

    > img {
      height: 2.5rem;
      width: 3.5rem;
      object-fit: cover;
      border: 1px solid var(--color-border);
      border-radius: .25rem;
    }

    > .icon {
      cursor: pointer;
      transition: .2s all ease-in-out;
    }

    button {
      margin: 0 0 0 .5rem;
      padding: .25rem;
      width: 2.5rem;
      text-align: center;

      .icon {
        pointer-events: none;
        margin: 0;
      }
    }

    .title {
      line-height: 1.3;
    }
  }

  &:open > summary > .icon {
    rotate: 90deg;
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
  height: 1rem;
  margin-right: .5em;
  vertical-align: center;

  &.icon-right {
    margin-right: 0;
  }
}
</style>
