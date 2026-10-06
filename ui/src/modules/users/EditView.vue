<script setup lang="ts">
import {onMounted, computed} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useUser} from "@/modules/users/useUser.ts";
import IconSave from "@/components/icons/IconSave.vue";
import {useEdit} from "@/composables/useEdit.ts";
import {useRoles} from "@/modules/roles/useRoles.ts";
import FormControl from "@/components/FormControl.vue";

const route = useRoute();
const router = useRouter();

const isNew = computed(() => route.params.id === 'new');

const {
  roles,
  loadRoles
} = useRoles();

const {
  user,
  loadUser,
  saveUser,
} = useUser();

onMounted(() => {
  loadRoles();
  loadUser(route.params.id as string, isNew.value);
});

async function save() {
  await saveUser(isNew.value);
  edited.value = false;
  router.push({name: 'userdetails', params: {id: user.value.id}});
}

const { edited } = useEdit();

const colorSchemes = [
  {id: "system", title: "System"},
  {id: "light", title: "Light"},
  {id: "dark", title: "Dark"},
];
</script>

<template>
  <form @submit.prevent="save" @input="edited = true" v-if="user.id || isNew">
    <section class="sticky">
      <div>
        <RouterLink to="/users">Users</RouterLink> >
        <h1 v-if="user.id">User: {{user?.firstname}} {{user?.lastname}} ({{user?.username}})</h1>
        <h1 v-else>New User</h1>
      </div>
      <button :disabled="!edited"><IconSave class="icon"/> Save</button>
    </section>

    <FormControl type="text" label="Username" v-model="user.username" required/>
    <FormControl type="text" label="Firstname" v-model="user.firstname"/>
    <FormControl type="text" label="Lastname" v-model="user.lastname"/>
    <FormControl type="text" label="Email" v-model="user.email" required/>
    <br/>
    <FormControl type="select" label="Role" v-model="user.roleId" :options="roles" required/>
    <FormControl type="select" label="Colour Scheme" v-model="user.colorScheme" :options="colorSchemes" required/>
    <br/>
    <FormControl type="password" label="Password" v-model="user.password" confirm="true"/>
  </form>
</template>
