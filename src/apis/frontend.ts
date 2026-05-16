import request from '@/utils/request'

export const register = (data: any) => {
  return request.post('/user/add', data)
}

export const startSession = (data: any) => {  
  return request.post('/psychological-chat/session/start', data)
}
