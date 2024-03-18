import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      children: [
        {
          path: '/flow',
          name: 'flow',
          component: () => import('../views/Flow.vue'),
        },
      ],
    },
  ],
})

export default router
