import request from '@/utils/request'

export type Category = {
  id: string | number
  categoryName: string
}

export type ArticlePageResult = {
  records: any[]
  total: number
  size: number
  current: number
  pages: number
}

export const login = (data: any) => {
  return request.post('/user/login', data)
}

//分类
export const categoryList = () => {
  return request.get<unknown, Category[]>('/knowledge/category/tree')
}

//查询
export const articlePage = (params: any) => {
  return request.get<unknown, ArticlePageResult>('/knowledge/article/page',{params})
} 

//上传文件
export function uploadFile(file:File,businessInfo:any) {
  const formData=new FormData()
  formData.append('file',file)
  formData.append('businessType','ARTICLE')
  formData.append('businessId',businessInfo.businessId)
  formData.append('businessFeild','cover')
  return request.post('/file/upload', formData,{
    headers:{
      'Content-Type':'multipart/form-data'
    }
  })
}

//新增文章
export function createArticle(data:any) {
  return request.post('/knowledge/article', data)
}

//获取文章详情
export function  getArticleDetail(id:string | number) {
  return request.get<unknown, any>(`/knowledge/article/${id}`)
}

export type PageResult<T = any> = {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

//更新文章
export function updateArticle(id:string | number,data:any) {
  return request.put(`/knowledge/article/${id}`, data)
}

export function changeArticleStatus(id:string | number,status:number) {
  return request.put(`/knowledge/article/${id}/status`, { status }, {
    params: { status }
  })
}

export function deleteArticle(id:string | number) {
  return request.delete(`/knowledge/article/${id}`)
}

//咨询记录
export function getConsulationsPage(params:any) {
  return request.get<unknown, PageResult>('/psychological-chat/sessions',{params})
}

//获取会话列表
export function getSessionDetail(sessionId:string | number) {
  return request.get<unknown, PageResult>(`/psychological-chat/sessions/${sessionId}/messages`)
}

//获取情绪日志列表
export function getEmotionalLogPage(params:any) {
  return request.get<unknown, PageResult>('/emotion-diary/admin/page',{params})
}

//删除情绪日志
export function deleteEmotionalLog(id:string) {
  return request.delete(`/emotion-diary/admin/${id}`)
}

//数据分析
export function getAnalyticsOverview(){
  return request.get<unknown, any>('/data-analytics/overview')
}