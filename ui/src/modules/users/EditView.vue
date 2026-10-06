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
  newImage,
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

const uploadImageHandler = (event: Event) => {
  const target = (event.target as HTMLInputElement);
  const image = (target.previousElementSibling as HTMLImageElement);
  const file = target ? (target.files ? target.files[0] : null) : null;

  if (!file || !image) return;

  newImage.value = file;
  console.log("do", newImage.value, file, image);
  const reader = new FileReader();
  reader.onload = (e) => {
    image.src = (e.target?.result as string);
  }
  reader.readAsDataURL(file);
};

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

    <div>
      <label>Image</label>
      <div>
        <img class="inline-logo" v-if="user.image" :alt="user.image.title" :src="'http://localhost:3000/'+user.image.path"/>
        <img class="inline-logo" v-else alt="No User Image" src="http://localhost:3000/examples/"/>
        <input type="file" @change="uploadImageHandler" accept="image/png, image/jpeg, image/gif, image/svg+xml">
      </div>
    </div>

    <FormControl type="select" label="Role" v-model="user.roleId" :options="roles" required/>
    <FormControl type="select" label="Colour Scheme" v-model="user.colorScheme" :options="colorSchemes" required/>
    <br/>
    <FormControl type="password" label="Password" v-model="user.password" confirm="true"/>
  </form>
</template>


<style scoped>
img {
  height: 2rem;
}
</style>
