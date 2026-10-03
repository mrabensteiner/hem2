<script setup lang="ts">
import {onMounted} from 'vue';
import {useRoute} from 'vue-router';
import {useUser} from "@/modules/users/useUser.ts";
import IconEdit from "@/components/icons/IconEdit.vue";
import IconUser from "@/components/icons/IconUser.vue";

const route = useRoute();

const {
  user,
  loadUser
} = useUser();

onMounted(() => {
  loadUser(route.params.id as string);
});
</script>


<template>
   <section class="sticky">
    <div>
      <RouterLink to="/users">Users</RouterLink> >
      <h1>User: {{user?.firstname}} {{user?.lastname}} ({{user?.username}})</h1>
    </div>
     <RouterLink class="button" :to="{name: 'useredit'}"><IconEdit class="icon"/> Edit</RouterLink>
  </section>

  <div class="flex">
    <div>
      <div class="user-image">
        <IconUser/>
      </div>
    </div>
    <div>
      <div>
        <label>Firstname:</label> {{user.firstname}}
      </div>
      <div>
        <label>Lastname:</label> {{user.lastname}}
      </div>
      <div>
        <label>Role:</label> {{user.role?.title}}
      </div>
      <div>
        <label>Email:</label> <a :href="'mailto:' + user.email">{{user.email}}</a>
      </div>
    </div>
  </div>
</template>


<style scoped>
.flex > :first-child {
  flex: 0 1 300px;
  min-width: 100px;
}

.flex > :last-child {
  flex: 1 0 400px;
}

.user-image svg {
  max-height: 300px;
  background-color: var(--color-background-mute);
  border-radius: 50%;
  overflow: hidden;
  padding: 1rem 0 0;
}
</style>
