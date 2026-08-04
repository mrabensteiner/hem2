import ListView from "@/modules/projects/ListView.vue";
import DetailsView from "@/modules/projects/DetailsView.vue";
import NewView from "@/modules/projects/NewView.vue";
import EditView from "@/modules/projects/EditView.vue";

export default [
  {
    path: '/projects',
    name: 'ProjectsList',
    component: ListView,
    meta: {
      title: 'Projects',
      requiresAuth: true
    }
  },
  {
    path: '/project/:id',
    name: 'ProjectDetails',
    component: DetailsView,
    meta: {
      title: 'Project',
      requiresAuth: true
    }
  },
  {
    path: '/project/new',
    name: 'ProjectNew',
    component: NewView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/project/:id/edit',
    name: 'ProjectEdit',
    component: EditView,
    meta: {
      requiresAuth: true
    }
  }
];
