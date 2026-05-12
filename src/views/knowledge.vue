<template>
  <div>
    <PageHead #buttons title="知识文章">
      <el-button type="primary">新增</el-button>
      <el-button type="primary">编辑</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { categoryList,articlePage } from '@/apis/admin'
import PageHead from '@/components/pageHead.vue'
import TableSearch from '@/components/TableSearch.vue'

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

const pagination=reactive({
  currentPage:1,
  size:10,
  total:0
})
const tableData=ref<any[]>([])
const handleSearch=async (formData:any)=>{
  const params=Object.fromEntries(Object.entries({
    ...pagination,
    ...formData
  }).filter(([, value]) => value !== ''))
  const data = await articlePage(params)
  tableData.value=data.records
}

const categories=ref<SearchOption[]>([])
const categoryMap=reactive<Record<string | number, string>>({})

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
