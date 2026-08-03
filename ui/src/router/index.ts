import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProjectsView from "@/views/ProjectsView.vue";
import ProjectView from "@/views/ProjectView.vue";
import UserView from "@/views/UserView.vue";
import UsersView from "@/views/UsersView.vue";
import FindingView from "@/views/FindingView.vue";
import StatusView from "@/views/StatusView.vue";
import HeuristicSetsView from "@/views/HeuristicSetsView.vue";
import HeuristicSetView from "@/views/HeuristicSetView.vue";
import SeverityListView from "@/views/SeverityListView.vue";
import SeverityDetailsView from "@/views/SeverityDetailsView.vue";
import LoginView from "@/views/LoginView.vue";
import {useAuth} from "@/composables/useAuth.ts";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Start' }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: 'Login', authView: true }
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsView,
      meta: { title: 'Projects', requiresAuth: true }
    },
    {
      path: '/project/:id',
      name: 'project',
      component: ProjectView,
      meta: {  title: 'Project', requiresAuth: true }
    },
    {
      path: '/project/:pid/finding/:id',
      name: 'finding',
      component: FindingView,
      meta: { title: 'Finding', requiresAuth: true }
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
      meta: { title: 'Users', requiresAuth: true }
    },
    {
      path: '/status',
      name: 'status',
      component: StatusView,
      meta: { title: 'Status', requiresAuth: true }
    },
    {
      path: '/heuristics',
      name: 'heuristicsets',
      component: HeuristicSetsView,
      meta: { title: 'Heuristic Sets', requiresAuth: true }
    },
    {
      path: '/heuristics/:id',
      name: 'heuristics',
      component: HeuristicSetView,
      meta: { title: 'Heuristics', requiresAuth: true }
    },
    {
      path: '/severities',
      name: 'severitylist',
      component: SeverityListView,
      meta: { title: 'Severity Sets', requiresAuth: true }
    },
    {
      path: '/severities/:id',
      name: 'severitydetails',
      component: SeverityDetailsView,
      meta: { title: 'Severity Set', requiresAuth: true }
    },
    {
      path: '/user/:id',
      name: 'User',
      component: UserView,
      meta: { title: 'User', requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const { isAuthenticated } = useAuth();

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return { name: 'login' };
  } else if (to.meta.authView && isAuthenticated.value) {
    return { name: 'projects' };
  }

  document.title = to.meta?.title ? to.meta?.title + ' - HEM2' : 'HEM2';
});

export default router
