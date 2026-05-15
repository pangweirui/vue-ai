<template>
  <div class="admin-list-page emotional-page">
    <PageHead title="情绪日志" />
    <TableSearch :formItem="formItem" @search="handleSearch" @reset="handleReset" />
    <div class="table-panel">
      <el-table :data="tableData" class="admin-table" v-loading="loading">
        <template #empty>
          <div class="table-empty">
            <el-empty v-show="!loading" description="暂无数据" />
          </div>
        </template>
        <el-table-column prop="userId" label="ID" width="80" align="center" />
        <el-table-column prop="userId" label="用户" width="110" align="center">
          <template #default="scope">
            <el-avatar class="user-avatar" :size="40">
              {{ scope.row.username }}
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="diaryDate" label="记录日期" min-width="120" align="center" />
        <el-table-column prop="diaryDate" label="情绪评分" min-width="220" align="center">
          <template #default="scope">
            <el-rate v-model="scope.row.moodScore" disabled :max="10"></el-rate>
          </template>
        </el-table-column>
        <el-table-column label="生活指标" min-width="150" align="center">
          <template #default="scope">
            <div class="life-metrics">
              <span>睡眠：{{ scope.row.sleepQuality }}/5</span>
              <span>压力：{{ scope.row.stressLevel }}/5</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="emotionTriggers" label="情绪触发因素" min-width="200" align="center" />
        <el-table-column prop="diaryContent" label="日记内容" min-width="260" align="center">
          <template #default="scope">
            <div class="diary-content">{{ scope.row.diaryContent || '-' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="操作" fixed="right" width="160" align="center">
          <template #default="scope">
            <div class="table-actions">
              <el-button text type="primary" @click="handleDetail(scope.row)">详情</el-button>
              <el-button text type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
    <EmotionalDialog v-model="dialogVisible" :currentDetail="currentDetail"/>
  </div>
</template>

<script setup>
import { ref,reactive,onMounted } from 'vue'
import { getEmotionalLogPage,deleteEmotionalLog } from '@/apis/admin'
import PageHead from '@/components/pageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import EmotionalDialog from '@/components/EmotionalDialog.vue'
import {ElMessage,ElMessageBox} from 'element-plus'

const loading=ref(true)

//表格数据
const tableData=ref([])

//搜索表单
const formItem = ref([
  {comp:'input',prop:'userId',label:'用户ID',placeholder:'请输入用户ID'},
  {comp:'select',prop:'moodScoreRange',label:'情绪评分',placeholder:'请选择评分范围',options:[
    {label:'低分(1-3)',value:'1-3'},
    {label:'中分(4-6)',value:'4-6'},
    {label:'高分(7-10)',value:'7-10'},
  ]},
])

//分页
const pagination=reactive({
  total:0,
  size:10,
  currentPage:1,
})

const searchParams=reactive({})

//获取情绪日志列表
const getEmotionalLogList=async() => {
  loading.value=true
  try {
    const params={
      current:pagination.currentPage,
      size:pagination.size,
      ...searchParams
    }
    const res=await getEmotionalLogPage(params)
    tableData.value=res.records ?? []
    pagination.total=res.total
    pagination.currentPage=res.current
    pagination.size=res.size
  } finally {
    loading.value=false
  }
}

//搜索
const handleSearch = async(formData) => {
  pagination.currentPage=1
  Object.assign(searchParams,{
    userId:formData.userId,
    minMoodScore:formData.moodScoreRange?.split('-')[0],
    maxMoodScore:formData.moodScoreRange?.split('-')[1],
  })
  await getEmotionalLogList()
}

//重置
const handleReset = async() => {
  Object.keys(searchParams).forEach((key) => {
    delete searchParams[key]
  })
  pagination.currentPage=1
  await getEmotionalLogList()
}

const handleChange = async(val) => {
  pagination.currentPage=val
  await getEmotionalLogList()
}
//详情
const currentDetail=ref({})

const handleDetail = async(record) => {
  dialogVisible.value=true
  currentDetail.value=record
}

//删除
const handleDelete = async(record) => {
  const confirm=await ElMessageBox.confirm('确认删除吗？','提示',{
    confirmButtonText:'确定',
    cancelButtonText:'取消',
    type:'warning',
  })
  if(!confirm){
    return
  }
  try {
    await deleteEmotionalLog(record.id)
    await getEmotionalLogList()
    ElMessage.success('删除成功')
  } catch {
    ElMessage.error('删除失败')
  }
}

const dialogVisible=ref(false)

onMounted(async ()=>{
  await getEmotionalLogList()
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

  :deep(.el-table__row:hover > td.el-table__cell) {
    background: #f8fbff;
  }
}

.user-avatar {
  background: linear-gradient(135deg, #6366f1 0%, #14b8a6 100%);
  color: #ffffff;
  font-weight: 700;
}

.life-metrics {
  display: grid;
  gap: 4px;
  color: #64748b;
  font-size: 13px;
}

.diary-content {
  display: -webkit-box;
  overflow: hidden;
  color: #475569;
  text-align: left;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
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
