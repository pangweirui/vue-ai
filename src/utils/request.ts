import axios from 'axios'
import { ElMessage } from 'element-plus'
import {router} from '@/router'

const request = axios.create({
  baseURL: '/api',
  timeout: 15000
})

request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.token = token
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  response => {
    const {data}=response
    if(data.code==='200'){
      if(data.data?.token){
        localStorage.setItem('token',data.data.token)
      }
      return data.data
    }else if(data.code==='-1'){
        router.push('/auth/login')
        return Promise.reject(data)
    }else{
      ElMessage.error(data.msg)
      return Promise.reject(data)
    }
  },
  error => {
    const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout')
    const message = isTimeout
      ? '请求超时，请稍后重试'
      : error.response?.data?.msg || error.response?.data?.message || error.message
    if (message) {
      ElMessage.error(message)
    }
    return Promise.reject(error)
  }
)

export default request
