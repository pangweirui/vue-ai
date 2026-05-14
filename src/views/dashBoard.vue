template
<template>
  <div>
    <h1>Dashboard</h1>
  </div>
</template>
<script setup lang="ts">
import { ref ,reactive,onMounted} from 'vue'
import { getAnalyticsOverview } from '@/apis/admin'

//v-loading
const loading=ref(true)

//表格数据
const aiData=ref({})

//获取数据分析
const getAnalyticsOverviewList=async() => {
  loading.value=true
  try {
    const res=await getAnalyticsOverview()
    aiData.value=res
  } finally {
    loading.value=false
  }
}

onMounted(async ()=>{
  await getAnalyticsOverviewList()
})
</script>
<style lang="scss" scoped>
</style>