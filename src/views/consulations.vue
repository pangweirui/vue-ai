<template>
  <div style="position: relative;">
    <PageHead title="咨询记录" />
    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <template #empty>
        <div class="table-empty">
          <el-empty v-show="!loading" description="暂无咨询记录" />
        </div>
      </template>
      <el-table-column label="会话ID" width="150" fixed="left" align="center">
        <template #default="scope">
          <el-avatar>{{ scope.row.userNickname }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="情绪日志" header-align="center">
        <template #default="scope">
          <div class="session-title">{{ scope.row.sessionTitle }}</div>
          <div class="session-preview">{{ scope.row.lastMessageContent}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="messageCount" label="消息数" width="100" align="center" />
      <el-table-column prop="lastMessageTime" label="咨询时间" width="100" align="center" />
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template #default="scope">
          <el-button type="primary" text size="mini" @click="handleDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout=" prev, pager, next"
      :total="pagination.total"
      :page-size.sync="pagination.size"
      @current-change="handleConsulationsList"
      style="position: absolute;right: 0;"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import {getConsulationsPage} from '@/apis/admin'
import PageHead from '@/components/pageHead.vue'


const tableData = ref([])
const loading = ref(true)

const pagination = reactive({
  currentPage: 1,
  total: 0,
  size: 10
})

const getConsulationsList=async()=>{
  loading.value = true
  try {
    const res = await getConsulationsPage({
      currentPage: pagination.currentPage,
      size: pagination.size
    })
    tableData.value = res.records
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}

const handleDetail=(row)=>{
  console.log(row)
}

const handleConsulationsList=(val)=>{
  pagination.currentPage=val
  getConsulationsList()
}

onMounted(() => {
  getConsulationsList()
})
</script>

<style lang="scss" scoped>

</style>
