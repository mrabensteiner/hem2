import ListView from "@/modules/settings/ListView.vue";

export default [
  {
    path: '/settings',
    name: 'SettingsList',
    component: ListView,
    meta: {
      requiresAuth: true,
      requiredPrivilege: 'systemSettingsEdit'
    }
  }
];
