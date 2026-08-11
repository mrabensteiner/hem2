import ListView from "@/modules/ratings/ListView.vue";
import DetailsView from "@/modules/ratings/DetailsView.vue";

export default [

  {
    path: '/ratings',
    name: 'ratinglist',
    component: ListView,
    meta: {
      title: 'Rating Sets',
      requiresAuth: true
    }
  },
  {
    path: '/ratings/:id',
    name: 'ratingdetails',
    component: DetailsView,
    meta: {
      title: 'Rating Set',
      requiresAuth: true
    }
  }
];
