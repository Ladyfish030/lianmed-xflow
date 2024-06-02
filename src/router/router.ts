import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
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
          path: '/home',
          name: 'home',
          component: () => import('../views/Home.vue'),
        },
        {
          path: '/flow',
          name: 'flow',
          component: () => import('../views/Flow.vue'),
        },
      ],
    },
  ],
})
router.beforeEach(function (to, from, next) {
  if (to.path == '/login' || to.path == '/') {
    next()
  } else if (sessionStorage.getItem('login')) {
    next()
  } else {
    next(false)
    ElMessage({
      message: '请先登录',
      type: 'warning',
    })
    router.push('/')
  }
})
export default router
