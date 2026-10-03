import ListView from "./ListView.vue";
import DetailsView from "./DetailsView.vue";
import EditView from "./EditView.vue";

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
  },
  {
    path: '/users/:id/edit',
    name: 'useredit',
    component: EditView,
    meta: {
      title: 'User',
      requiresAuth: true,
      requiredPrivilege: 'userEdit'
    }
  }
];
