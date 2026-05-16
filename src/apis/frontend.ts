import request from '@/utils/request'

export const register = (data: any) => {
  return request.post('/user/add', data)
}