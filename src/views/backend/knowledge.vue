<template>
  <div class="admin-list-page knowledge-page">
    <PageHead #buttons title="知识文章">
      <el-button type="primary" @click="handleCreate">新增文章</el-button>
    </PageHead>
    <TableSearch :formItem="formItem" @search="handleSearch" @reset="handleReset" />
    <div class="table-panel">
      <el-table v-loading="loading" :data="tableData" class="admin-table">
        <template #empty>
          <div class="table-empty">
            <el-empty v-show="!loading" description="暂无知识文章" />
          </div>
        </template>
        <el-table-column prop="title" label="文章标题" fixed="left" min-width="300" header-align="center">
          <template #default="scope">
            <div class="title-cell">
              <el-icon><Timer /></el-icon>
              <span>{{ scope.row.title }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="categoryId" label="分类" min-width="160" align="center">
          <template #default="scope">
            <el-tag round effect="light">{{ categoryMap[scope.row.categoryId] || '未分类' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="authName" label="作者" min-width="140" align="center">
          <template #default="scope">
            <span class="muted-text">{{ scope.row.authorName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="readCount" label="阅读量" min-width="120" align="center">
          <template #default="scope">
            <span class="metric-text">{{ scope.row.readCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="发布时间" min-width="180" align="center">
          <template #default="scope">
            <span class="muted-text">{{ scope.row.updatedAt }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="操作" fixed="right" width="190" align="center">
          <template #default="scope">
            <div class="table-actions">
              <el-button text type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button v-if="scope.row.status===0||scope.row.status===2" @click="handlePublish(scope.row)" text type="primary">发布</el-button>
              <el-button v-if="scope.row.status===1" @click="handleDown(scope.row)" text type="warning">下线</el-button>
              <el-button v-if="scope.row.status===2" @click="handleDelete(scope.row)" text type="danger">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="page-pagination"
        layout="total, prev, pager, next"
        :total="pagination.total"
        :page-size="pagination.size"
        :current-page="pagination.currentPage"
        @change="handleChange"
      />
    </div>
    <ArticleDialog v-model="dialogVisible" :categories="categories" :tagArray="commonTags" :currentArticle="currentArticle" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { categoryList,articlePage,getArticleDetail ,changeArticleStatus,deleteArticle} from '@/apis/admin'
import PageHead from '@/components/backend/pageHead.vue'
import TableSearch from '@/components/backend/TableSearch.vue'
import ArticleDialog from '@/components/backend/ArticleDialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

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

// 加载中
const loading=ref(true)

// 分页
const pagination=reactive({
  currentPage:1,
  size:10,
  total:0
})
const tableData=ref<any[]>([])

const searchParams=reactive<Record<string, any>>({})
const getList=async()=>{
  loading.value=true
  try {
    const params={
      ...pagination,
      ...searchParams
    }
    const data = await articlePage(params)
    tableData.value=data.records
    pagination.total=data.total
    pagination.currentPage=data.current
    pagination.size=data.size
  } finally {
    loading.value=false
  }
}
// 搜索
const handleSearch=async (formData:any)=>{
  pagination.currentPage=1  
  Object.assign(searchParams,formData)
  await getList()
}
// 重置搜索表单
const handleReset=async ()=>{
  Object.keys(searchParams).forEach((key) => {
    delete searchParams[key]
  })
  pagination.currentPage=1
  await getList()
}
// 分页
const handleChange=async (val:number)=>{
  pagination.currentPage=val
  await getList()
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

const currentArticle=ref<any>({})
const getArticleId=(row:any)=>row.id ?? row.articleId
const hasArticleId=(id:any)=>id!==undefined&&id!==null&&id!==''
// 新增文章
const handleCreate=()=>{
  currentArticle.value={}
  dialogVisible.value=true
}
// 编辑文章
const handleEdit=(async (row:any)=>{
  const articleId=getArticleId(row)
  if(!hasArticleId(articleId)){
    ElMessage.error('文章ID不存在')
    return
  }
  currentArticle.value={}
  const data = await getArticleDetail(articleId)
  currentArticle.value=data
  dialogVisible.value=true
  await getList()
})
// 发布文章
const handlePublish=(async (row:any)=>{
  try {
    await ElMessageBox.confirm('确认发布文章吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    })
    const articleId=getArticleId(row)
    if(!hasArticleId(articleId)){
      ElMessage.error('文章ID不存在')
      return
    }
    await changeArticleStatus(articleId,1)
    ElMessage.success('发布成功')
    await getList()
  } catch {
  }
})
// 下线文章
const handleDown=(async (row:any)=>{
  try {
    await ElMessageBox.confirm('确认下线文章吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    })
    const articleId=getArticleId(row)
    if(!hasArticleId(articleId)){
      ElMessage.error('文章ID不存在')
      return
    }
    await changeArticleStatus(articleId,2)
    ElMessage.success('下线成功')
    await getList()
  } catch {
  }
})
// 删除文章
const handleDelete=(async (row:any)=>{
  try {
    await ElMessageBox.confirm('确认删除文章吗？', 
    '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const articleId=getArticleId(row)
    if(!hasArticleId(articleId)){
      ElMessage.error('文章ID不存在')
      return
    }
    await deleteArticle(articleId)
    ElMessage.success('删除成功')
    await getList()
  } catch {
  }
})


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
  await getList()
})
</script>

<style lang="scss" scoped>
.admin-list-page {
  min-height: 100%;
}

.table-panel {
  overflow: hidden;
  border: 1px solid #e5edf7;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.045);
}

.admin-table {
  width: 100%;

  :deep(.el-table__header th.el-table__cell) {
    background: #fbfdff;
    color: #475569;
    font-weight: 700;
  }

  :deep(.el-table__body td.el-table__cell) {
    padding: 14px 0;
  }

  :deep(.el-table__row) {
    transition: background-color 0.18s ease;
  }

  :deep(.el-table__row:hover > td.el-table__cell) {
    background: #f8fbff;
  }
}

.title-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: #0f172a;
  font-weight: 600;

  .el-icon {
    flex: 0 0 auto;
    color: #6366f1;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.metric-text {
  color: #0f172a;
  font-weight: 700;
}

.muted-text {
  color: #64748b;
}

.table-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.page-pagination {
  justify-content: flex-end;
  padding: 18px 20px;
}

.table-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
}
</style>
