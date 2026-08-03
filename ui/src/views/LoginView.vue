<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {useAuth} from "@/composables/useAuth.ts";
import Message from "@/components/Message.vue";

const router = useRouter();
const { login, isLoading, error } = useAuth();

const username = ref('');
const password = ref('');

async function handleLogin() {
  await login({ username: username.value, password: password.value });
  router.push('/projects');
}
</script>

<template>
  <h2>Login</h2>
  <form @submit.prevent="handleLogin">
    <div>
      <label>Username</label>
      <input type="text" v-model="username" required />
    </div>
    <div>
      <label>Password</label>
      <input type="password" v-model="password" required />
    </div>
    <button type="submit" :disabled="isLoading">Login</button>
    <Message :error="error" />
  </form>
</template>
