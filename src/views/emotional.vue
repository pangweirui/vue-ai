<template>
  <div>
    <PageHead title="情绪日志" />
    <TableSearch :formItem="formItem" @search="handleSearch" @reset="handleReset" style="margin-bottom: 20px;"/>
    <el-table :data="tableData" width="100%" v-loading="loading">
      <template #empty>
        <div style="text-align: center;">
          <el-empty v-show="!loading" description="暂无数据" />
        </div>
      </template>
      <el-table-column prop="userId" label="ID" width="80"/>
      <el-table-column prop="userId" label="会话ID" width="80">
        <template #default="scope">
          <el-avatar :size="40">
            {{scope.row.username}}
          </el-avatar> 
        </template>
      </el-table-column>
      <el-table-column prop="diaryDate" label="记录日期" width="100" align="center"/>
      <el-table-column prop="diaryDate" label="情绪评分" width="220" align="center">
        <template #default="scope">
          <el-rate v-model="scope.row.moodScore" disabled :max="10"></el-rate>
        </template>
      </el-table-column>
      <el-table-column label="生活指标" width="150" align="center">
        <template #default="scope">
          <div>
            <p>
              睡眠：{{ scope.row.sleepQuality }}/5
            </p>
            <p>
              压力：{{ scope.row.stressLevel }}/5
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="emotionTriggers" label="情绪触发因素" width="200" align="center"/>
      <el-table-column prop="diaryContent" label="日记内容" width="250" align="center"/>
      <el-table-column prop="status" label="操作" fixed="right" width="180" header-align="center">
        <template #default="scope">
          <div>
            <el-button text type="primary" @click="handleDetail(scope.row)">详情</el-button>
            <el-button text type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
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

</style>
