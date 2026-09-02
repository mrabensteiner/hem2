<script setup lang="ts">
import {onMounted, ref} from 'vue';
import Message from "@/components/Message.vue";
import {useRoute, useRouter} from "vue-router";
import {useProjectDetail} from "@/modules/projects/useProjectDetail.ts";
import IconSave from "@/components/icons/IconSave.vue";

const route = useRoute();
const router = useRouter();

const {
  project,
  managers,
  members,
  statuses,
  heuristicSets,
  ratingSets,
  users,
  success,
  error,
  loadProject,
  saveProject
} = useProjectDetail();

onMounted(() => {
  loadProject(route.params.id as string);
});

async function save() {
  await saveProject();
  router.push({ name: 'ProjectDetails', params: {id: route.params.id} });
}

const edited = ref<boolean>(false);
const searchManager = ref<string>(" ");
</script>


<template>
  <form @submit.prevent="save" @input="edited = true">
    <section class="sticky">
      <h1>Edit Project</h1>
      <RouterLink class="button" :to="{ name: 'ProjectDetails', params: {pid: route.params.pid, id: route.params.id} }">Cancel</RouterLink>
      <button role="submit" :disabled="!edited"><IconSave class="icon"/> Save</button>
    </section>

    <div>
      <label>Title</label>
      <input type="text" placeholder="Title" v-model="project.title" />
    </div>

    <div>
      <label>Description</label>
      <textarea type="text" placeholder="Description" v-model="project.description"></textarea>
    </div>

    <div>
      <label for="status">Status</label>
      <select id="status" v-model="project.statusId" required>
        <option v-for="status in statuses" :key="status.id" :value="status.id">
          {{ status.title }}
        </option>
      </select>
    </div>

    <div>
      <label for="heuristic">Heuristic Set</label>
      <select id="heuristic" v-model="project.heuristicsetId" required>
        <option v-for="h in heuristicSets" :key="h.id" :value="h.id">
          {{ h.title }}
        </option>
      </select>
    </div>

    <div>
      <label for="rating">Rating Set</label>
      <select id="rating" v-model="project.ratingsetId" required>
        <option v-for="s in ratingSets" :key="s.id" :value="s.id">
          {{ s.title }}
        </option>
      </select>
    </div>

    <div>
      <label>Managers</label>
      <label class="inlinesearchbox" for="managersearch">
        <template v-for="u in users">
          <div class="searchchip">
            <label><input type="checkbox" :value="u.id" v-model="managers" :id="'mgm-' + u.id"/></label>
            {{ u.firstname }} {{ u.lastname }}
          </div>
        </template>
        <div>
          <input type="search" id="managersearch" v-model="searchManager" autocomplete="off"/>
          <div class="suggestions" v-if="searchManager != ''">
            <label v-for="u in users.filter((uf:any) => !managers.includes(uf.id) && (uf.firstname + ' ' + uf.lastname).toLowerCase().search(searchManager.toLowerCase()) != -1)" :for="'mgm-' + u.id" tabindex="0">
              {{ u.firstname }} {{ u.lastname }}
            </label>
          </div>
        </div>
      </label>
    </div>

    <div>
      <label>Reviewers</label>
      <label v-for="u in users" :key="'form-mbr-' + u.id" class="checkbox-label">
        <input type="checkbox" :value="u.id" v-model="members" :disabled="managers.includes(u.id)" />
        {{ u.firstname }} {{ u.lastname }}
      </label>
    </div>
  </form>
  <Message :success="success" :error="error" />
</template>

<style scoped>
.inlinesearchbox {
  display: flex;
  flex-wrap: wrap;
  cursor: text;
  border: 2px solid var(--color-border);
  background-color: var(--color-background-soft);
  gap: .5rem;

  input[type=search] {
    border: none;
    height: 100%;
  }

  :focus {
    outline: none;
  }

  &:has(:focus) {
    border-color: var(--app-primary);
  }

  &:not(:has(:focus)) .suggestions {
    display: none;
  }

  .suggestions {
    background-color: var(--color-background-mute);
    width: fit-content;
    display: flex;
    flex-direction: column;
    position: absolute;
    margin-top: .5rem;

    label {
      border: 1px solid var(--color-border);
      margin: 0;
      font-weight: normal;

      &:hover {
        background-color: var(--color-background-soft);
        cursor: pointer;
      }
    }
  }

  .searchchip {
    background-color: var(--color-border);
    height: 2.5rem;
    border-radius: 1.25rem;
    padding-right: 1rem;
    width: fit-content;

    &:has(input:not(:checked)) {
      display: none;
    }

    label {
      display: inline-flex;
      background-color: var(--color-border-hover);
      border-radius: 1.25rem;
      height: 2.5rem;
      width: 2.5rem;

      &:hover, input:hover {
        background-color: var(--color-border);
        cursor: pointer;
      }
      &::before {
        content: 'x';
        margin-left: 0.5rem;
      }
      input[type=checkbox] {
        opacity: 0;
      }
    }
  }
}
</style>
