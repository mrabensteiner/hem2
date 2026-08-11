import ListView from "@/modules/heuristics/ListView.vue";
import DetailsView from "@/modules/heuristics/DetailsView.vue";

export default [

  {
    path: '/heuristics',
    name: 'heuristiclist',
    component: ListView,
    meta: {
      title: 'Heuristic Sets',
      requiresAuth: true
    }
  },
  {
    path: '/heuristics/:id',
    name: 'heuristicdetails',
    component: DetailsView,
    meta: {
      title: 'Heuristic Set',
      requiresAuth: true
    }
  }
];
