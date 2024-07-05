import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      children: [
        {
          path: '',
          name: 'homeDefault',
          component: () => import('../views/Home.vue'),
        },
        {
          path: '/flow',
          name: 'flow',
          component: () => import('../views/Flow.vue'),
        },
        {
          path: '/global_config',
          name: 'global_config',
          component: () => import('../views/GlobalConfig.vue'),
        },
      ],
    },
  ],
})

router.beforeEach(function (to, from, next) {
  if (to.path === '/login' || to.path === '/register') {
    next()
  } else if (sessionStorage.getItem('login')) {
    next()
  } else {
    ElMessage({
      message: '请先登录',
      type: 'warning',
    })
    next('/login')
  }
})

export default router
