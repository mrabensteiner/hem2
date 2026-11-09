import ListView from "@/modules/projects/ListView.vue";
import DetailsView from "@/modules/projects/DetailsView.vue";
import NewView from "@/modules/projects/NewView.vue";
import EditView from "@/modules/projects/EditView.vue";
import RatingsView from "@/modules/projects/RatingsView.vue";
import ImportView from "@/modules/projects/ImportView.vue";
import ExportView from "@/modules/projects/ExportView.vue";

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
      context: 'project',
      requiresAuth: true,
      requiredProjectPrivilege: 'projectViewDetails'
    }
  },
  {
    path: '/project/:id/ratings',
    name: 'ProjectRatings',
    component: RatingsView,
    meta: {
      title: 'Project Ratings',
      context: 'project',
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
    path: '/project/import',
    name: 'ProjectImport',
    component: ImportView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/project/:id/export',
    name: 'ProjectExport',
    component: ExportView,
    meta: {
      context: 'project',
      requiresAuth: true
    }
  },
  {
    path: '/project/:id/edit',
    name: 'ProjectEdit',
    component: EditView,
    meta: {
      context: 'project',
      requiresAuth: true
    }
  }
];
