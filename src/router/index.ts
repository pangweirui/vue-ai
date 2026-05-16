import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import BackEndLayout from '@/components/backend/BackEndLayout.vue'
import AuthLayout from '@/components/backend/AuthLayout.vue'
import FrontendLayout from '@/components/frontend/FrontendLayout.vue'

const backendRoutes: RouteRecordRaw[] = [
  {
    path: '/back',
    component: BackEndLayout,
    redirect: '/back/dashboard',
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/backend/dashBoard.vue'),
        meta:{
          title:'数据分析',
          icon:'PieChart'
        }
      },
      {
        path:'knowledge',
        component: () => import('@/views/backend/knowledge.vue'),
        meta:{
          title:'知识文章',
          icon:'ChatLineSquare'
        }
      },
      {
        path:'consulations',
        component: () => import('@/views/backend/consulations.vue'),
        meta:{
          title:'咨询记录',
          icon:'Message'
        }
      },
      {
        path:'emotional',
        component: () => import('@/views/backend/emotional.vue'),
        meta:{
          title:'情绪日志',
          icon:'User'
        }
      }
    ]
  }
]

const frontendRoutes: RouteRecordRaw[] = [
  {
    path:'/front',
    component: FrontendLayout,
    redirect: '/front/home',
    children: [
      {
        path:'home',
        component: () => import('@/views/frontend/home.vue'),
        meta:{
          title:'首页',
          icon:'Home'
        }
      },
      {
        path:'consulation',
        component: () => import('@/views/frontend/consulation.vue'),
        meta:{
          title:'咨询记录',
          icon:'Message'
        }
      },
      {
        path:'knowledge',
        component: () => import('@/views/frontend/frontendKnowlege.vue'),
        meta:{
          title:'知识库',
          icon:'ChatLineSquare'
        }
      },
      {
        path:'emotion-diary',
        component: () => import('@/views/frontend/emotionDairy.vue'),
        meta:{
          title:'情绪日志',
          icon:'User'
        }
      }
    ]
  }
]

const authRoutes: RouteRecordRaw[] = [
  {
    path:'/auth',
    component: AuthLayout,
    redirect: '/auth/login',
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
  }
]

const routes: RouteRecordRaw[] = [
  {
    path:'/',
    redirect:'/front/home',
    meta:{
      title:'首页',
      icon:'Home'
    }
  },
  ...frontendRoutes,
  ...authRoutes,
  ...backendRoutes,
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const hasToken = Boolean(localStorage.getItem('token'))
  const isBackRoute = to.path.startsWith('/back')

  if(!hasToken){
    if(isBackRoute){
      next('/auth/login')
      return
    }
    next()
    return
  }

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  const userType = Number(userInfo.userType)

  if(userType === 2){
    if(isBackRoute){
      next()
    }else{
      next('/back/dashboard')
    }
    return
  }

  if(userType === 1){
    if(isBackRoute){
      next('/front/home')
    }else{
      next()
    }
    return
  }

  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  localStorage.removeItem('username')
  if(to.path === '/auth/login'){
    next()
  }else{
    next('/auth/login')
  }
})
