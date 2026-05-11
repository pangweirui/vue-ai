<template>
  <div>
    <PageHead #buttons title="知识文章">
      <el-button type="primary">新增</el-button>
      <el-button type="primary">编辑</el-button>
    </PageHead>
    <TableSearch :formItem="formItem" @search="handleSearch"/>
  </div>
</template>

<script setup lang="ts">
import PageHead from '@/components/pageHead.vue'
import TableSearch from '@/components/TableSearch.vue'

const formItem=[
  {comp:'input',prop:'title',label:'文章标题',placeholder:'请输入文章标题'},
  {comp:'select',prop:'categoryId',label:'分类',options:[
      {label:'心理健康基础',value:'1'},
      {label:'情绪管理',value:'2'},
    ],
    placeholder:'请选择分类'
  },
]

const handleSearch=(formData:any)=>{
  console.log(formData)
}
</script>

<style lang="scss" scoped>

</style>
