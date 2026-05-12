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

export function uploadFile(file,businessInfo) {
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