import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/AppLayout.vue'
import { useUserStore } from '@/store'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { requiresAuth: false, title: '登录' }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '控制台', icon: 'DataAnalysis' }
      },
      {
        path: 'product',
        name: 'Product',
        component: () => import('@/views/product/list.vue'),
        meta: { title: '商品管理', icon: 'Goods' }
      },
      {
        path: 'product/edit/:id?',
               name: 'ProductEdit',
        component: () => import('@/views/product/edit.vue'),
        meta: { title: '商品编辑', hidden: true }
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/product/category.vue'),
        meta: { title: '分类管理', icon: 'Menu' }
      },
      {
        path: 'order',
        name: 'Order',
        component: () => import('@/views/order/list.vue'),
        meta: { title: '订单管理', icon: 'List' }
      },
      {
        path: 'order/detail/:id',
        name: 'OrderDetail',
        component: () => import('@/views/order/detail.vue'),
        meta: { title: '订单详情', hidden: true }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/list.vue'),
        meta: { title: '用户管理', icon: 'User' }
      },
      {
        path: 'user/detail/:id',
        name: 'UserDetail',
        component: () => import('@/views/user/detail.vue'),
        meta: { title: '用户详情', hidden: true }
      },
      {
        path: 'coupon',
        name: 'Coupon',
        component: () => import('@/views/marketing/coupon.vue'),
        meta: { title: '优惠券管理', icon: 'Ticket' }
      },
      {
        path: 'banner',
        name: 'Banner',
        component: () => import('@/views/system/banner.vue'),
        meta: { title: '轮播图管理', icon: 'Picture' }
      },
      {
        path: 'config',
        name: 'Config',
        component: () => import('@/views/system/config.vue'),
        meta: { title: '系统配置', icon: 'Setting' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const requiresAuth = to.meta.requiresAuth !== false

  if (requiresAuth && !userStore.token) {
    next('/login')
  } else if (to.path === '/login' && userStore.token) {
    next('/')
  } else {
    next()
  }
})

export default router
