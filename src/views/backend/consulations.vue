<template>
  <div class="consultation-page admin-list-page">
    <PageHead title="咨询记录" />

    <div
      ref="listRef"
      class="consultation-list table-panel"
    >
      <el-table
        v-loading="loading && tableData.length === 0"
        :data="tableData"
        class="consultation-table"
        @row-click="handleDetail"
      >
        <template #empty>
          <div class="table-empty">
            <el-empty v-show="!loading" description="暂无咨询记录" />
          </div>
        </template>
        <el-table-column label="用户" width="180" fixed="left" align="center">
          <template #default="scope">
            <div class="user-cell">
              <el-avatar class="user-avatar">
                {{ getAvatarText(scope.row) }}
              </el-avatar>
              <span>{{ getNickname(scope.row) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="会话内容" header-align="center" min-width="260">
          <template #default="scope">
            <div class="session-title">{{ scope.row.sessionTitle }}</div>
            <div class="session-preview">{{ scope.row.lastMessageContent }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="messageCount" label="消息数" width="100" align="center" />
        <el-table-column prop="lastMessageTime" label="咨询时间" width="160" align="center" />
      </el-table>

      <VueEternalLoading
        v-if="tableData.length > 0"
        v-model:isInitial="isInitial"
        :load="loadMore"
      >
        <template #loading>
          <div class="load-status">加载中...</div>
        </template>
        <template #no-more>
          <div class="load-status">{{ showNoMore ? '没有更多了' : '' }}</div>
        </template>
        <template #error="{ retry }">
          <div class="load-status">
            加载失败
            <el-button type="primary" text @click="retry">重试</el-button>
          </div>
        </template>
      </VueEternalLoading>
    </div>

    <ConsulationDialog
      v-model="dialogVisible"
      :session-detail="sessionDetail"
      :session-info="currentSession"
    />
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { VueEternalLoading } from '@ts-pro/vue-eternal-loading'
import {getConsulationsPage,getSessionDetail} from '@/apis/admin'
import PageHead from '@/components/backend/pageHead.vue'
import ConsulationDialog from '@/components/backend/ConsulationDialog.vue'

const tableData = ref([])
const hasLoadedData = ref(false)
const loading = ref(false)
const listRef = ref(null)
const pageNo = ref(1)
const pageSize = ref(10)
const hasMore = ref(true)
const loadedCount = ref(0)
const isInitial = ref(true)

const showNoMore = computed(() => {
  return hasMore.value || pageNo.value > 1
})

const getNickname = (row) => {
  return row.userNickname || row.nickname || '匿名用户'
}

const getAvatarText = (row) => {
  return String(getNickname(row)).slice(0, 1)
}

// 获取咨询记录列表
const getConsulationsList=async(page=1)=>{
  loadedCount.value = 0

  if (loading.value || (!hasMore.value && page > 1)) {
    return
  }

  if (page === 1 && hasLoadedData.value) {
    return
  }

  try {
    loading.value = true

    if (page === 1) {
      hasLoadedData.value = true
    }

    const res = await getConsulationsPage({
      currentPage: page,
      size: pageSize.value
    })
    const records = res.records ?? []
    loadedCount.value = records.length

    if (page === 1) {
      isInitial.value = false
      tableData.value = records
    } else {
      tableData.value.push(...records)
    }

    pageNo.value = page
    hasMore.value = records.length === pageSize.value
  } catch {
    if (page === 1) {
      hasLoadedData.value = false
    }
    hasMore.value = false
  } finally {
    loading.value = false
  }
}

const loadMore=async({ loaded, noMore, error })=>{
  if (!hasMore.value) {
    noMore()
    return
  }

  try {
    const nextPage = pageNo.value + 1
    const scrollTopBeforeLoad = listRef.value?.scrollTop ?? 0
    await getConsulationsList(nextPage)
    await nextTick()
    if (listRef.value) {
      listRef.value.scrollTop = scrollTopBeforeLoad
    }

    if (!hasMore.value) {
      noMore()
    } else {
      loaded(loadedCount.value, pageSize.value)
    }
  } catch {
    error()
  }
}

// 会话详情弹窗
const dialogVisible = ref(false)

// 获取会话详情
const sessionDetail = ref([])
const currentSession = ref({})
const handleDetail=(async (row)=>{
  dialogVisible.value = true
  currentSession.value = row
  sessionDetail.value = []
  const res = await getSessionDetail(row.id)
  sessionDetail.value = res
})

onMounted(() => {
  if (!hasLoadedData.value && !loading.value) {
    getConsulationsList(1)
  }
})
</script>

<style lang="scss" scoped>
.admin-list-page {
  min-height: 100%;
}

.consultation-page {
  height: calc(100vh - 154px);
  display: flex;
  flex-direction: column;
}

.consultation-list {
  flex: 1;
  overflow-y: auto;
  overflow-anchor: none;
}

.table-panel {
  border: 1px solid #e5edf7;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.045);
}

.consultation-table {
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
    cursor: pointer;
    transition: background-color 0.18s ease;
  }

  :deep(.el-table__row:hover > td.el-table__cell) {
    background: #f8fbff;
  }
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  color: #0f172a;
  font-weight: 600;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.user-avatar {
  flex: 0 0 auto;
  background: linear-gradient(135deg, #6366f1 0%, #14b8a6 100%);
  color: #ffffff;
  font-weight: 700;
}

.session-title {
  color: #0f172a;
  font-weight: 700;
}

.session-preview {
  display: -webkit-box;
  overflow: hidden;
  margin-top: 6px;
  color: #64748b;
  font-size: 13px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.load-status {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 13px;
}
.table-empty{
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
}
</style>
