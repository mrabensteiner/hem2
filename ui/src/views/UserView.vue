<script setup lang="ts">
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";

const route = useRoute();
const router = useRouter();
const user = ref({});
const status = ref({});
const newUser = route.params.id == "new";

if (!newUser) {
  console.log("get", route.params.id)
  try {
    fetch("http://localhost:3000/users/" + route.params.id)
      .then(response => response.json())
      .then(json => user.value = json);
  } catch (e) {
    console.log(e);
    status.value.msg = e;
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
      .then(json => status.value = json)
      .then(
        () => {
          if (newUser) {
            router.push(`/users`)
          }
        }
      );
  } catch (error) {
    console.log(error);
    console.log(error);
  }
}
</script>

<template>
  <h1>User: {{user?.firstname}} {{user?.lastname}} ({{user?.username}})</h1>
  <form @submit.prevent="save">
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
    <div>
      <label>Role</label>
      <select v-model="user.role">
        <option value="ADMIN">Admin</option>
        <option value="MANAGER">Manager</option>
        <option value="USER">User</option>
      </select>
    </div>

    <input type="submit" value="Save"/>
    <div v-if="status.msg">{{status.msg}}</div>
  </form>
</template>
