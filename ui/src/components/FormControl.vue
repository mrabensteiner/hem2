<script setup lang="ts">
import PasswordInput from "@/components/PasswordInput.vue";
import IconWarningYellow from "@/components/icons/IconWarningYellow.vue";

const value = defineModel<any>();

defineProps<{
  label?: string | '';
  type?: string | null;
  options?: any[] | null;
  required?: boolean | null;
  error?: string | null;
  info?: string | null;
}>();
</script>


<template>
  <template v-if="type == 'select'">
    <label>
      <div>{{ label }} <span v-if="!required">- (optional)</span></div>
      <select v-model="value" required @click="console.log($event.target)">
        <option v-for="o in options" :value="o.id">{{ o.title }}</option>
      </select>
    </label>
  </template>

  <template v-else-if="type == 'password'">
    <label>
      <div>{{ label }} <abbr title="Entering a new password will override the old one."><IconWarningYellow class="icon"/></abbr></div>
      <PasswordInput v-model="value"/>
    </label>
  </template>

  <template v-else>
    <label>
      <div>{{ label }} <span v-if="!required">- (optional)</span></div>
      <input placeholder="" v-model="value" />
    </label>
  </template>
</template>


<style scoped>
label:has(input, select, textarea) {
  padding: .5rem;
  background-color: var(--color-background);
  font-size: 1rem;
  cursor: text;
  display: flex;
  flex-direction: column;
  min-height: 4rem;
  width: 100%;
  border-radius: 0.5rem;
  border: 2px solid var(--color-border);
  margin: .75rem 0;

  &:has(input:focus, select:focus) {
    border-color: var(--app-primary);
  }

  * {
    transition: font-size .2s ease;
  }

  div {
    font-weight: bold;
    font-size: .75rem;

    span {
      font-size: .75rem;
      font-style: italic;
    }
  }

  input, select {
    border: none;
    padding: 0;
    margin: 0;
    flex: 1;
    background: transparent;
    outline: none;
  }

  input, select, div.password *:first-child {
    border: none;
    background: transparent;
    outline: none;
    font-size: 1rem;
  }

  select {
    border: 1px solid var(--color-border);
    border-radius: 0.25rem;
    padding: 0.5rem;
    margin: 0.1rem 0;
    &:hover, &:focus {
      outline: none;
    }
  }

  /* empty field and not focused */
  &:has(input:placeholder-shown:not(:focus)) {
    background-color: var(--color-background-mute);

    div {
      flex: 1;
      align-content: center;
      font-size: 1rem;
    }
    input {
      flex: 0;
      font-size: 0;
    }
    div.password {
      margin: -1rem;
    }
    /* can't access the password show button directly due to scoped styling*/
    div.password *:last-child {
      display: none;
    }
  }
}
.icon {
  margin-bottom: -.25rem;
}
</style>
