import request from '@/utils/request'

export const register = (data: any) => {
  return request.post('/user/add', data)
}

export const startSession = (data: any) => {  
  return request.post('/psychological-chat/session/start', data)
}

export const getSession = (params: any) => {
  return request.get('/psychological-chat/sessions', { params })
}

export const deleteSession = (sessionId: string) => {
  return request.delete(`/psychological-chat/sessions/${sessionId}`)
}

export const getSessionDatail = (sessionId: string) => {
  return request.get(`/psychological-chat/sessions/${sessionId}/messages`)
}

export const gwtSessionEmotion = (sessionId: string) => {
  return request.get(`/psychological-chat/session/${sessionId}/emotion`)
}

export const submitEmotionDairy = (data: any) => {
  return request.post('/emotion-diary', data)
}

export const getKnowledgeArticlePage = (params: any) => {
  return request.get('/knowledge/article/page', { params })
}

export const getKnowledgeArticleDetail = (id: string) => {
  return request.get(`/knowledge/article/${id}`)
}