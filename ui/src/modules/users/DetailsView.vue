<script setup lang="ts">
import {onMounted, computed} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useUser} from "@/modules/users/useUser.ts";
import Message from "@/components/Message.vue";
import IconSave from "@/components/icons/IconSave.vue";
import {useEdit} from "@/composables/useEdit.ts";
import {useRoles} from "@/modules/roles/useRoles.ts";

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
  success,
  error
} = useUser();

onMounted(() => {
  loadRoles();
  loadUser(route.params.id as string, isNew.value);
});

async function save() {
  await saveUser(isNew.value);

  if (isNew.value) {
    router.push('/ratings');
  }
  edited.value = false;
}

const { edited } = useEdit();
</script>

<template>
  <form @submit.prevent="save" v-if="user.id || !error">
    <section class="sticky">
      <div>
        <RouterLink to="/users">Users</RouterLink> >
        <h1 v-if="user.id">User: {{user?.firstname}} {{user?.lastname}} ({{user?.username}})</h1>
        <h1 v-else>New User</h1>
      </div>
      <button><IconSave class="icon"/> Save</button>
    </section>
    <div>
      <label>Username</label>
      <input type="text" placeholder="Username" v-model="user.username" required />
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
      <label data-test="red">Lastname</label>
      <input type="text" placeholder="Lastname" v-model="user.lastname" />
    </div>
    <div>
      <label>Email</label>
      <input type="text" placeholder="Email" v-model="user.email" required />
    </div>
    <div>
      <label>Role</label>
      <select v-model="user.roleId" required>
        <option v-for="r in roles" :value="r.id">{{ r.title }}</option>
      </select>
    </div>
  </form>
  <Message :success="success" :error="error"/>
</template>
