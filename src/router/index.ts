import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import BackEndLayout from '@/components/BackEndLayout.vue'
import AuthLayout from '@/components/AuthLayout.vue'
import FrontendLayout from '@/components/FrontendLayout.vue'

const backendRoutes: RouteRecordRaw[] = [
  {
    path: '/back',
    component: BackEndLayout,
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

const frontendRoutes: RouteRecordRaw[] = [
  {
    path:'',
    component: FrontendLayout,
    children: [
      {
        path:'',
        component: () => import('@/views/frontend/home.vue'),
        meta:{
          title:'首页',
          icon:'Home'
        }
      },
      {
        path:'/consulation',
        component: () => import('@/views/frontend/consulation.vue'),
        meta:{
          title:'咨询记录',
          icon:'Message'
        }
      },
      {
        path:'/knowledge',
        component: () => import('@/views/frontend/frontendKnowlege.vue'),
        meta:{
          title:'知识库',
          icon:'ChatLineSquare'
        }
      },
      {
        path:'/emotion-diary',
        component: () => import('@/views/frontend/emotionDairy.vue'),
        meta:{
          title:'情绪日志',
          icon:'User'
        }
      }
    ]
  }
]
export const router = createRouter({
  history: createWebHistory(),
  routes: [...backendRoutes,...frontendRoutes],
})

router.beforeEach((to, _from, next) => {
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
