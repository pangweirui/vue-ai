import { defineStore } from 'pinia'
import {ref} from 'vue'
import {router} from '@/router'

export const useAdminStore = defineStore('admin', ()=>{
  const isCollapse=ref(false)

  const toggleCollapse=()=>{
    isCollapse.value=!isCollapse.value
  }
  
  const logout=()=>{
    localStorage.removeItem('token')
    router.push('/auth/login')
  }
  return{
    isCollapse,
    toggleCollapse,
    logout
  }
})
