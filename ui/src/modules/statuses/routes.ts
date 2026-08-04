import ListView from "@/modules/statuses/ListView.vue";

export default [
  {
    path: '/statuses',
    name: 'StatusList',
    component: ListView,
    meta: {
      requiresAuth: true,
      requiredPrivilege: 'statusEdit'
    }
  }
];
