<script setup lang="ts">
import {ref} from "vue";
import IconAdd from "@/components/icons/IconAdd.vue";

const selected = defineModel<string[]>();
const search = ref<string>("");

const { prefix, users } = defineProps<{
  prefix?: string,
  users: any[],
}>();
</script>

<template>
  <label class="inlinesearchbox" :for="prefix">
    <template v-for="u in users">
      <div class="searchchip">
        <label><input @change="search = ''" type="checkbox" :value="u.id" v-model="selected" :id="prefix + '-' + u.id"/></label>
        {{ u.firstname }} {{ u.lastname }}
      </div>
    </template>
    <div style="anchor-name: --input;">
      <input type="search" :id="prefix" v-model="search" autocomplete="off"/>
      <IconAdd class="floating-icon"/>
      <div class="suggestions" v-if="search != ''">
        <label v-for="u in users.filter((uf:any) => !selected?.includes(uf.id) && (uf.firstname + ' ' + uf.lastname).toLowerCase().search(search.toLowerCase()) != -1)"
         :for="prefix + '-' + u.id"
         tabindex="0">
          {{ u.firstname }} {{ u.lastname }}
        </label>
      </div>
    </div>
  </label>
</template>


<style scoped>
.inlinesearchbox {
  anchor-scope: --search;
  display: flex;
  flex-wrap: wrap;
  cursor: text;
  gap: .5rem;

  input[type=search] {
    anchor-name: --search;
    border: none;
    height: 100%;
  }

  :focus {
    outline: none;
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
    position-anchor: --search;
    top: anchor(bottom);
    margin-left: 1rem;

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


  &:not(:has(:focus)) {
    input[type=search], .floating-icon {
      cursor: pointer;
    }

    input[type=search] {
      width: 2.5rem;
      background-color: var(--color-text);
    }

    .floating-icon {
      height: 1.5rem;
      margin: -.45rem -2rem;
      color: var(--color-background);
    }
  }


  &:has(:focus) .floating-icon {
    display: none;
  }

  input[type=search] {
    transition: width .2s ease-in-out;
    padding-left: 1rem;
    width: fit-content;
  }

  input[type=search], .searchchip {
    background-color: var(--color-border);
    height: 2.5rem;
    border-radius: 1.25rem;
    padding-right: 1rem;

    &:has(input:not(:checked)) {
      display: none;
    }

    label {
      display: inline-flex;
      background-color: var(--color-border-hover);
      border-radius: 1.25rem;
      height: 2.5rem;
      width: 2.5rem;

      &:hover, &:focus, input:hover {
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
