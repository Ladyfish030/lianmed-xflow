import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      children: [
        {
          path: '/flow',
          name: 'flow',
          component: () => import('../views/Flow.vue'),
        },
        {
          path: '/home',
          name: 'home',
          component: () => import('../views/Home.vue'),
        },
      ],
    },
  ],
})

export default router
