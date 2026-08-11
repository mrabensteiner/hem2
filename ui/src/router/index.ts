import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserView from "@/views/UserView.vue";
import UsersView from "@/views/UsersView.vue";
import LoginView from "@/views/LoginView.vue";
import {useAuth} from "@/composables/useAuth.ts";

import projectRoutes from '@/modules/projects/routes';
import statusRoutes from '@/modules/statuses/routes';
import roleRoutes from '@/modules/roles/routes';
import heuristicRoutes from '@/modules/heuristics/routes';
import ratingRoutes from '@/modules/ratings/routes';
import findingRoutes from '@/modules/findings/routes';

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
      path: '/users',
      name: 'users',
      component: UsersView,
      meta: { title: 'Users', requiresAuth: true }
    },
    ...projectRoutes,
    ...statusRoutes,
    ...roleRoutes,
    ...heuristicRoutes,
    ...ratingRoutes,
    ...findingRoutes,
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
  const { isAuthenticated, hasPrivilege } = useAuth();

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return { name: 'login' };
  } else if (to.meta.authView && isAuthenticated.value) {
    return { name: 'projects' };
  }
  if (isAuthenticated.value && to.meta.requiredPrivilege && !hasPrivilege.value(to.meta.requiredPrivilege as string)) {
    return { name: 'projects' };
  }

  document.title = to.meta?.title ? to.meta?.title + ' - HEM2' : 'HEM2';
});

export default router
