import ListView from "@/modules/roles/ListView.vue";

export default [
  {
    path: '/roles',
    name: 'RolesList',
    component: ListView,
    meta: {
      requiresAuth: true,
      requiredPrivilege: 'roleEdit'
    }
  }
];
