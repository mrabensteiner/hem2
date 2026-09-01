import DetailsView from "@/modules/findings/DetailsView.vue";
import NewView from "@/modules/findings/NewView.vue";
import EditView from "@/modules/findings/EditView.vue";
import RatingView from "@/modules/findings/RatingView.vue";

export default [
  {
    path: '/project/:pid/findings/:id',
    name: 'FindingsDetails',
    component: DetailsView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/project/:pid/findings/new',
    name: 'FindingsNew',
    component: NewView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/project/:pid/findings/:id/edit',
    name: 'FindingsEdit',
    component: EditView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/project/:pid/findings/rate/:id?',
    name: 'FindingsRate',
    component: RatingView,
    meta: {
      requiresAuth: true
    }
  },
];
