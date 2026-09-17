import ListView from "./ListView.vue";
import DetailsView from "./DetailsView.vue";

export default [

  {
    path: '/users',
    name: 'userlist',
    component: ListView,
    meta: {
      title: 'Users',
      requiresAuth: true
    }
  },
  {
    path: '/users/:id',
    name: 'userdetails',
    component: DetailsView,
    meta: {
      title: 'User',
      requiresAuth: true
    }
  }
];
