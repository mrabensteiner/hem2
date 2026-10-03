import ListView from "./ListView.vue";
import DetailsView from "./EditView.vue";

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
    name: 'useredit',
    component: EditView,
    meta: {
      title: 'User',
      requiresAuth: true
    }
  }
];
