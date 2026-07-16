import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProjectsView from "@/views/ProjectsView.vue";
import ProjectView from "@/views/ProjectView.vue";
import UserView from "@/views/UserView.vue";
import UsersView from "@/views/UsersView.vue";
import FindingView from "@/views/FindingView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsView,
    },
    {
      path: '/project/:id',
      name: 'project',
      component: ProjectView,
    },
    {
      path: '/project/:pid/finding/:id',
      name: 'finding',
      component: FindingView,
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
    },
    {
      path: '/user/:id',
      name: 'User',
      component: UserView,
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

export default router
