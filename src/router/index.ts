import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import BackEndLayout from '@/components/BackEndLayout.vue'
import AuthLayout from '@/components/AuthLayout.vue'

const backendRoutes: RouteRecordRaw[] = [
  {
    path: '/back',
    component: BackEndLayout,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashBoard.vue'),
        meta:{
          title:'数据分析',
          icon:'PieChart'
        }
      },
      {
        path:'knowledge',
        component: () => import('@/views/knowledge.vue'),
        meta:{
          title:'知识文章',
          icon:'ChatLineSquare'
        }
      },
      {
        path:'consulations',
        component: () => import('@/views/consulations.vue'),
        meta:{
          title:'咨询记录',
          icon:'Message'
        }
      },
      {
        path:'emotional',
        component: () => import('@/views/emotional.vue'),
        meta:{
          title:'情绪日志',
          icon:'User'
        }
      }
    ]
  },
  {
    path:'/auth',
    component: AuthLayout,
    children: [
      {
        path:'login',
        component: () => import('@/views/login.vue'),
        meta:{
          title:'登录',
          icon:'Login'
        }
      },
      {
        path:'register',
        component: () => import('@/views/register.vue'),
        meta:{
          title:'注册',
          icon:'User'
        }
      }
    ]
  },
  {
    path:'/',
    redirect:'/back/dashboard',
      meta:{
      title:'首页',
      icon:'Home'
    }
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes: [...backendRoutes],
})

router.beforeEach((to,from, next) => {
  if(localStorage.getItem('token')){
    next()
  }else{
    if(to.path.startsWith('/back/dashboard')){
      next('/auth/login')
    }else{
      next()
    }
  }
})