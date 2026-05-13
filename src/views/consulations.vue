<template>
  <div>
    <PageHead title="咨询记录" />
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="会话ID" width="200" >
        <template #default="scope">
          <el-avatar :src="scope.row.userAvatar" size="medium"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="情绪日志" width="200" >
        <template #default="scope">
          <div class="session-title">{{ scope.row.sessionTitle }}</div>
          <div class="session-preview">{{ scope.row.lastMessageContent}}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import {getConsulationsPage} from '@/apis/admin'
import PageHead from '@/components/pageHead.vue'


const tableData = ref([])

const pagination = reactive({
  currentPage: 1,
  total: 0,
  size: 10
})

const getConsulationsList=async()=>{
  const res = await getConsulationsPage({
    currentPage: pagination.currentPage,
    size: pagination.size
  })
  tableData.value = res.records
  pagination.total = res.total
}
onMounted(() => {
  getConsulationsList()
})
</script>

<style lang="scss" scoped>

</style>
