<script setup lang="ts">
import { onMounted } from 'vue';
import { useSettings } from "@/modules/settings/useSettings.ts";
import IconSave from "@/components/icons/IconSave.vue";
import IconAdd from "@/components/icons/IconAdd.vue";
import IconRemove from "@/components/icons/IconRemove.vue";
import {useEdit} from "@/composables/useEdit.ts";

const {
  settings,
  loadSettings,
  saveSettings,
} = useSettings();

onMounted(() => {
  loadSettings();
});

async function save() {
  await saveSettings();
  edited.value = false;
}

const { edited } = useEdit();
</script>


<template>
  <h1>System Settings</h1>

  <p>
    System-wide settings can be defined here.
  </p>

  <form @submit.prevent="save" @input="edited = true">
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Key</th>
            <th>Value</th>
            <th>Description</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
        <tr v-for="setting in settings" :key="setting.id">
          <td><input v-model="setting.name"/></td>
          <td><input v-model="setting.key"/></td>
          <td><input v-model="setting.value"/></td>
          <td><textarea v-model="setting.description"/></td>
          <td>
            <button type="button" disabled><IconRemove class="icon icon-only"/></button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <button type="button" disabled><IconAdd class="icon"/> Add Setting</button>
    <button :disabled="!edited"><IconSave class="icon"/> Save</button>
  </form>
</template>


<style scoped>
table {
  border-collapse: collapse;
  margin-top: 2rem;

  thead tr, tbody {
    border-width: 1px 0;
    border-style: solid;
    border-color: var(--color-border);
  }

  th, td {
    min-width: 2.5rem;
    padding: .2rem;
    border-width: 0 1px;
    border-style: solid;
    border-color: var(--color-border);
  }

  tbody tr:nth-child(odd) {
    background-color: var(--color-background-mute);
  }

  tbody tr:nth-child(even) {
    background-color: var(--color-background);
  }

  thead, th {
    border-bottom: 1px solid var(--color-text);

    th {
      font-weight: bold;
    }
  }

  td:not(:first-child) {
    text-align: center;
  }

  button {
    margin: 0;
    font-size: 1rem;
  }
}
</style>
