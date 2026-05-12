<template>
  <div>
    <PageHead #buttons title="知识文章">
      <el-button type="primary" @click="dialogVisible=true">新增</el-button>
    </PageHead>
    <TableSearch :formItem="formItem" @search="handleSearch"/>
    <el-table :data="tableData" style="width: 100%;margin-top: 25px;">
      <el-table-column prop="title" label="文章标题" fixed="left" width="300" header-align="center">
        <template #default="scope">
          <div style="display: flex;align-items: center;">
            <el-icon><Timer/></el-icon>
            <span>{{scope.row.title}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="categoryId" label="分类" width="200" header-align="center">
        <template #default="scope">
          <div style="display: flex;align-items: center;justify-content: center;">
            <span>{{categoryMap[scope.row.categoryId]}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="authName" label="作者" width="150" header-align="center">
        <template #default="scope">
          <div style="display: flex;align-items: center;justify-content: center;">
            <span>{{scope.row.authorName}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="readCount" label="阅读量" width="150" header-align="center">
        <template #default="scope">
          <div style="display: flex;align-items: center;justify-content: center;">
            <span>{{scope.row.readCount}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="发布时间" width="200" header-align="center">
        <template #default="scope">
          <div style="display: flex;align-items: center;justify-content: center;">
            <span>{{scope.row.createdAt}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="操作" fixed="right" width="180" header-align="center">
        <template #default="scope">
          <div style="display: flex;align-items: center;justify-content: center;">
            <el-button text type="primary">编辑</el-button>
            <el-button v-if="scope.row.status===0||scope.row.status===2" text type="primary">发布</el-button>
            <el-button v-if="scope.row.status===1" text type="warning" >下线</el-button>
            <el-button v-if="scope.row.status===2" text type="danger" >删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 25px;position: absolute;right: 0;"
      layout=" prev, pager, next"
      :total="pagination.total"
      :page-size="pagination.size"
      @change="handleChange"
    />
    <ArticleDialog v-model="dialogVisible" :categories="categories" :tagArray="commonTags" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { categoryList,articlePage } from '@/apis/admin'
import PageHead from '@/components/pageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import ArticleDialog from '@/components/ArticleDialog.vue'

// 搜索表单
type SearchOption = {
  label: string
  value: string | number
}
type FormItem = {
  comp: 'input' | 'select'
  prop: string
  label: string
  placeholder?: string
  options?: SearchOption[]
}
const formItem=reactive<FormItem[]>([
  {comp:'input',prop:'title',label:'文章标题',placeholder:'请输入文章标题'},
  {comp:'select',prop:'categoryId',label:'分类',placeholder:'请选择分类'},
  {comp:'select',prop:'status',label:'状态',placeholder:'请选择状态',options:[
    {label:'草稿',value:0},
    {label:'已发布',value:1},
    {label:'已下线',value:2}
  ]}
])

// 分页
const pagination=reactive({
  currentPage:1,
  size:10,
  total:0
})
const tableData=ref<any[]>([])
// 搜索
const handleSearch=async (formData:any)=>{
  const params=Object.fromEntries(Object.entries({
    ...pagination,
    ...formData
  }).filter(([, value]) => value !== '' && value !== 'all'))
  const data = await articlePage(params)
  tableData.value=data.records
  pagination.total=data.total
  pagination.currentPage=data.current
  pagination.size=data.size
}
// 分页
const handleChange=(val:number)=>{
  pagination.currentPage=val
  handleSearch({})
}

// 分类
const categories=ref<SearchOption[]>([])
const categoryMap=reactive<Record<string | number, string>>({})

//新增和编辑文章
const dialogVisible=ref(false)
//文章标签
const commonTags = [
  '情绪管理', '焦虑', '抑郁', '压力', '睡眠', 
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧'
]
onMounted(async ()=>{
  const res = await categoryList()
  categories.value=(res ?? []).map((item)=>{
    categoryMap[item.id]=item.categoryName
    return {
      label:item.categoryName,
      value:item.id
    }
  })
  formItem[1].options=categories.value
})
</script>

<style lang="scss" scoped>

</style>
