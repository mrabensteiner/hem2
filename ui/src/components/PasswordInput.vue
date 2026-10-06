<script setup lang="ts">
import {ref} from "vue";
import IconEye from "@/components/icons/IconEye.vue";

const value = defineModel<any>();
const showPassword = ref<boolean>(false);

defineProps<{
  required?: boolean | null;
}>();
</script>


<template>
  <div class="password">
    <input placeholder="" :type="showPassword ? 'text' : 'password'" v-model="value" @mousedown="" />
    <button type="button" @click="showPassword = !showPassword"><IconEye class="icon"/></button>
  </div>
</template>


<style scoped>
.password {
  display: flex;

  * {
    transition: border-color 0s;
  }

  &:hover * {
    border-color: var(--app-primary);
  }

  input {
    border-right: 0;
  }

  button {
    margin: 0;
    .icon {
      margin-right: 0;
    }
  }

  &:has(input[type="text"]) {
    .icon {
      opacity: .5;
    }
  }
}
</style>
