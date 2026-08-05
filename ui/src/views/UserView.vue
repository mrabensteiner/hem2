<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import Message from "@/components/Message.vue";
import {useRoles} from "@/modules/roles/useRoles.ts";

const route = useRoute();
const router = useRouter();
const success = ref("");
const error = ref("");
const user = ref({});
const newUser = route.params.id == "new";

const {
  roles,
  loadRoles
} = useRoles();

onMounted(() => {
  loadRoles();
});

if (!newUser) {
  console.log("get", route.params.id)
  try {
    fetch("http://localhost:3000/users/" + route.params.id)
      .then(response => response.json())
      .then(json => {
        user.value = json;

        if (json == null) {
          error.value = "User not found";
          user.value = {};
        }
        else if (json.success) {
          success.value = json.success;
        }
      });
  } catch (e) {
    error.value = e.error;
  }
}

async function save() {
  const requestOptions = {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(user.value)
  };

  if (newUser) {
    requestOptions.method = "POST";
  }

  try {
    await fetch("http://localhost:3000/users", requestOptions)
      .then(response => response.json())
      .then(json => {
        user.value = json ?? {};
        success.value = json.success ?? "";
        error.value = json.error ?? "";
      })
      .then(
        () => {
          if (newUser) {
            router.push(`/users`)
          }
        }
      );
  } catch (e) {
    error.value = e.error;
  }
}
</script>

<template>
  <h1>User: {{user?.firstname}} {{user?.lastname}} ({{user?.username}})</h1>
  <form @submit.prevent="save" v-if="user.id || !error">
    <div>
      <label>Email</label>
      <input type="text" placeholder="Email" v-model="user.email" />
    </div>
    <div>
      <label>Username</label>
      <input type="text" placeholder="Username" v-model="user.username" />
    </div>
    <div>
      <label>Password</label>
      <input type="password" placeholder="Password" v-model="user.password" />
    </div>
    <div>
      <label>Firstname</label>
      <input type="text" placeholder="Firstname" v-model="user.firstname" />
    </div>
    <div>
      <label>Lastname</label>
      <input type="text" placeholder="Lastname" v-model="user.lastname" />
    </div>
    <div v-if="user.role">
      <label>Role</label>
      <select v-model="user.role.id">
        <option v-for="r in roles" :value="r.id">{{ r.title }}</option>
      </select>
    </div>
    <input type="submit" value="Save"/>
  </form>
  <Message :success="success" :error="error"/>
</template>
