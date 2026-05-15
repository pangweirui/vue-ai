<template>
  <div class="dashboard-container">
    <el-row :gutter="20" class="overview-row">
      <el-col :xs="24" :sm="12" :md="12" :lg="6">
        <el-card v-if="aiData.systemOverview" class="overview-card">
          <div class="card-content">
            <div class="avatar users">
              <el-image :src="users" alt="用户头像" style="width: 40px; height: 40px;" />
            </div>
            <div class="info">
              <p class="title">总用户数</p>
              <p class="number">{{ aiData.systemOverview.totalUsers }}</p>
              <p class="subtitle-title">活跃用户：{{ aiData.systemOverview.activeUsers }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6">
        <el-card v-if="aiData.systemOverview" class="overview-card">
          <div class="card-content">
            <div class="avatar like">
              <el-image :src="like" alt="用户头像" style="width: 40px; height: 40px;" />
            </div>
            <div class="info">
              <p class="title">情绪日志</p>
              <p class="number">{{ aiData.systemOverview.totalDiary }}  </p>
              <p class="subtitle-title">今日新增: {{ aiData.systemOverview.todayNewDiaries }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6">
        <el-card v-if="aiData.systemOverview" class="overview-card">
          <div class="card-content">
            <div class="avatar comments">
              <el-image :src="comments" alt="用户头像" style="width: 40px; height: 40px;" />
            </div>
            <div class="info">
              <p class="title">咨询会话</p>
              <p class="number">{{ aiData.systemOverview.totalSessions }}  </p>
              <p class="subtitle-title">今日新增: {{ aiData.systemOverview.todayNewSessions }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6">
        <el-card v-if="aiData.systemOverview" class="overview-card">
          <div class="card-content">
            <div class="avatar smile">
              <el-image :src="smile" alt="用户头像" style="width: 40px; height: 40px;" />
            </div>
            <div class="info">
              <p class="title">平均情绪</p>
              <p class="number">{{ aiData.systemOverview.avgMoodScore }} /10 </p>
              <p class="subtitle-title">情绪健康指数</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">情绪趋势分析</div>
          </template>
          <div class="chart-content">
            <div ref="emotionChartRef" class="emotion-chart"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">咨询会话统计</div>
          </template>
          <div class="chart-content">
            <div class="consultation-stats">
              <div class="stat-item session">
                <div class="stat-label">总会话数</div>
                <div class="stat-value">{{ aiData.consultationStats.totalSessions }}</div>
              </div>
              <div class="stat-item duration">
                <div class="stat-label">平均时长</div>
                <div class="stat-value">{{ aiData.consultationStats.avgDurationMinutes }} 分钟</div>
              </div>
              <div class="stat-item user">
                <div class="stat-label">活跃用户</div>
                <div class="stat-value">{{ aiData.systemOverview.activeUsers }}</div>
              </div>
            </div>
            <div ref="consultationChartRef" class="consultation-chart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :sm="24" :md="24" :lg="24">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">用户活跃度趋势分析</div>
          </template>
          <div class="chart-content user-activity-content">
            <div ref="userActivityChartRef" class="user-activity-chart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getAnalyticsOverview } from '@/apis/admin'
import { init, use, graphic } from 'echarts/core'
import { LineChart, BarChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption } from 'echarts'
import type { EChartsType } from 'echarts/core'
import users from '@/assets/images/users.png'
import like from '@/assets/images/like.png'
import comments from '@/assets/images/comments.png'
import smile from '@/assets/images/smile.png'

use([
  LineChart,
  BarChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer
])

const loading = ref(true)

type SystemOverview = {
  totalUsers: number
  activeUsers: number
  totalDiary: number
  todayNewDiaries: number
  totalSessions: number
  todayNewSessions: number
  avgMoodScore: number
}
type EmotionTrendItem = {
  date: string
  avgMoodScore: number
  recordCount: number
}
type ConsultationDailyTrendItem = {
  date: string
  sessionCount: number
  userCount: number
}
type ConsultationStats = {
  totalSessions: number
  avgDurationMinutes: number
  dailyTrend: ConsultationDailyTrendItem[]
}
type UserActivityItem={
  date: string
  //活跃用户
  activeUsers: number
  //日记用户
  dailyUsers: number
  //咨询用户
  consultationUsers: number
  //新增用户
  newUsers: number
}
type AnalyticsOverview = {
  consultationStats: ConsultationStats
  emotionHeatmap: Record<string, unknown>
  systemOverview: SystemOverview
  emotionTrend: EmotionTrendItem[]
  userActivity: UserActivityItem[]
}
//表格数据
const aiData = ref<AnalyticsOverview>({
  consultationStats: {
    totalSessions: 0,
    avgDurationMinutes: 0,
    dailyTrend: []
  },
  emotionHeatmap: {},
  systemOverview: {
    totalUsers: 0,
    activeUsers: 0,
    totalDiary: 0,
    todayNewDiaries: 0,
    totalSessions: 0,
    todayNewSessions: 0,
    avgMoodScore: 0
  },
  emotionTrend: [],
  userActivity: []
})

//情绪图表
const emotionChartRef = ref<HTMLDivElement | null>(null)
let emotionChart: EChartsType | null = null
//咨询会话统计
let consultationChart: EChartsType | null = null
const consultationChartRef = ref<HTMLDivElement | null>(null)

//初始化情绪图表
const initEmotionChart = () => {
  if(!emotionChartRef.value) return
  if(emotionChart){
    emotionChart.dispose()
  }
  const chart = init(emotionChartRef.value)
  emotionChart = chart
  const emotionTrend  =  aiData.value.emotionTrend
  const dates = emotionTrend.map(item => item.date)
  const moodScores = emotionTrend.map(item => item.avgMoodScore)
  const recordCounts = emotionTrend.map(item => item.recordCount)
  const options: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      borderWidth: 0,
      padding: [10, 12],
      extraCssText: 'box-shadow: 0 14px 34px rgba(15, 23, 42, 0.12); border-radius: 10px;',
      textStyle: {
        color: '#334155'
      },
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#cbd5e1',
          width: 1,
          type: 'dashed'
        }
      }
    },
    legend: {
      data: ['平均情绪评分','记录数量'],
      top: 4,
      right: 8,
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 8,
      textStyle: {
        color: '#64748b',
        fontSize: 12
      }
    },
    grid: {
      top: 76,
      bottom: 12,
      left: 10,
      right: 12,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#e2e8f0'
        }
      },
      axisLabel: {
        color: '#64748b',
        margin: 14
      }
    },
    yAxis:[{
      type: 'value',
      name:'情绪评分',
      min: 0,
      max: 10,
      splitNumber: 5,
      position:'left',
      nameTextStyle: {
        color: '#64748b',
        padding: [0, 0, 8, 0]
      },
      axisLabel: {
        color: '#64748b'
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: '#edf2f7',
          type: 'dashed'
        }
      },
    },{
      type: 'value',
      name:'记录数',
      position:'right',
      alignTicks: true,
      nameTextStyle: {
        color: '#64748b',
        padding: [0, 0, 8, 0]
      },
      axisLabel: {
        color: '#64748b'
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
    }],
    series: [
      {
        name:'平均情绪评分',
        type: 'line',
        yAxisIndex: 0,
        data: moodScores,
        smooth: true,
        showSymbol: false,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: '#6366f1',
          shadowColor: 'rgba(99, 102, 241, 0.28)',
          shadowBlur: 10,
          shadowOffsetY: 6
        },
        itemStyle: {
          color: '#6366f1',
          borderColor: '#ffffff',
          borderWidth: 2
        },
        areaStyle: {
          opacity: 0.18,
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(99, 102, 241, 0.42)' },
            { offset: 1, color: 'rgba(99, 102, 241, 0.02)' }
          ])
        }
      },
      {
        name:'记录数量',
        type: 'bar',
        yAxisIndex: 1,
        data: recordCounts,
        barWidth: 14,
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#f59e0b' },
            { offset: 1, color: 'rgba(245, 158, 11, 0.18)' }
          ])
        },
        emphasis: {
          itemStyle: {
            color: '#f97316'
          }
        }
      }
    ]
  }
  chart.setOption(options)
}

//初始化咨询图表
const initConsultationChart = () => {
  if(!consultationChartRef.value) return
  if(consultationChart){
    consultationChart.dispose()
  }
  const chart = init(consultationChartRef.value)
  consultationChart = chart

  const dailyTrend = aiData.value.consultationStats.dailyTrend
  const dates = dailyTrend.map(item => item.date)
  const sessionCounts = dailyTrend.map(item => item.sessionCount)
  const userCounts = dailyTrend.map(item => item.userCount)
  const options: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      borderWidth: 0,
      padding: [10, 12],
      extraCssText: 'box-shadow: 0 14px 34px rgba(15, 23, 42, 0.12); border-radius: 10px;',
      textStyle: {
        color: '#334155'
      },
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: 'rgba(20, 184, 166, 0.08)'
        }
      }
    },
    legend: {
      data: ['会话数','用户数'],
      top: 4,
      right: 8,
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 8,
      textStyle: {
        color: '#64748b',
        fontSize: 12
      }
    },
    grid: {
      top: 76,
      bottom: 18,
      left: 10,
      right: 12,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: dates,
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#e2e8f0'
        }
      },
      axisLabel: {
        color: '#64748b',
        margin: 14
      }
    },
    yAxis:[{
      type: 'value',
      name:'会话数',
      min: 0,
      splitNumber: 5,
      position:'left',
      nameTextStyle: {
        color: '#64748b',
        padding: [0, 0, 8, 0]
      },
      axisLabel: {
        color: '#64748b'
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: '#edf2f7',
          type: 'dashed'
        }
      },
    },{
      type: 'value',
      name:'用户数',
      position:'right',
      min: 0,
      alignTicks: true,
      nameTextStyle: {
        color: '#64748b',
        padding: [0, 0, 8, 0]
      },
      axisLabel: {
        color: '#64748b'
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
    }],
    series: [
      {
        name:'会话数',
        type: 'bar',
        yAxisIndex: 0,
        data: sessionCounts,
        barWidth: 16,
        barMaxWidth: 20,
        z: 2,
        itemStyle: {
          borderRadius: [8, 8, 3, 3],
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#2dd4bf' },
            { offset: 1, color: 'rgba(20, 184, 166, 0.18)' }
          ])
        },
        emphasis: {
          itemStyle: {
            color: '#0f766e'
          }
        }
      },
      {
        name:'用户数',
        type: 'line',
        yAxisIndex: 1,
        data: userCounts,
        smooth: true,
        showSymbol: false,
        symbol: 'circle',
        symbolSize: 8,
        z: 3,
        lineStyle: {
          width: 3,
          color: '#2563eb',
          shadowColor: 'rgba(37, 99, 235, 0.24)',
          shadowBlur: 10,
          shadowOffsetY: 6
        },
        itemStyle: {
          color: '#2563eb',
          borderColor: '#ffffff',
          borderWidth: 2
        },
        areaStyle: {
          opacity: 0.12,
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(37, 99, 235, 0.34)' },
            { offset: 1, color: 'rgba(37, 99, 235, 0.01)' }
          ])
        }
      }
    ]
  }
  chart.setOption(options)
}

//用户活跃度趋势分析
const userActivityChartRef = ref<HTMLDivElement | null>(null)
let userActivityChart: EChartsType | null = null
//初始化用户活跃度趋势分析图表
const initUserActivityChart = () => {
  if(!userActivityChartRef.value) return
  if(userActivityChart){
    userActivityChart.dispose()
  }
  const chart = init(userActivityChartRef.value)
  userActivityChart = chart
  const userActivityData = aiData.value.userActivity
  const dates = userActivityData.map(item => item.date)
  const activeUsers = userActivityData.map(item => item.activeUsers)
  const dailyUsers = userActivityData.map(item => item.dailyUsers)
  const consultationUsers = userActivityData.map(item => item.consultationUsers)
  const newUsers = userActivityData.map(item => item.newUsers)
  const options: EChartsOption = {
    color: ['#0f766e', '#3b82f6', '#8b5cf6', '#f59e0b'],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      borderWidth: 0,
      padding: [10, 12],
      extraCssText: 'box-shadow: 0 14px 34px rgba(15, 23, 42, 0.12); border-radius: 10px;',
      textStyle: {
        color: '#334155'
      },
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#94a3b8'
        },
        lineStyle: {
          color: '#cbd5e1',
          type: 'dashed'
        }
      }
    },
    legend: {
      data: ['活跃用户','日记用户','咨询用户','新增用户'],
      top: 0,
      right: 8,
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 8,
      textStyle: {
        color: '#64748b',
        fontSize: 12
      }
    },
    grid: {
      top: 54,
      bottom: 16,
      left: 10,
      right: 12,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: dates,
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#e2e8f0'
        }
      },
      axisLabel: {
        color: '#64748b',
        margin: 14,
        hideOverlap: true
      }
    },
    yAxis: {
      type: 'value',
      name:'用户数',
      min: 0,
      splitNumber: 5,
      nameTextStyle: {
        color: '#64748b',
        padding: [0, 0, 8, 0]
      },
      axisLabel: {
        color: '#64748b'
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: '#edf2f7',
          type: 'dashed'
        }
      },
    },
    series: [
      {
        name:'活跃用户',
        type: 'line',
        data: activeUsers,
        smooth: true,
        showSymbol: false,
        symbol: 'circle',
        symbolSize: 8,
        z: 5,
        lineStyle: {
          width: 3,
          color: '#0f766e',
          shadowColor: 'rgba(15, 118, 110, 0.22)',
          shadowBlur: 10,
          shadowOffsetY: 6
        },
        itemStyle: {
          color: '#0f766e',
          borderColor: '#ffffff',
          borderWidth: 2
        },
        areaStyle: {
          opacity: 0.16,
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(15, 118, 110, 0.34)' },
            { offset: 1, color: 'rgba(15, 118, 110, 0.01)' }
          ])
        }
      },
      {
        name:'日记用户',
        type: 'bar',
        data: dailyUsers,
        barWidth: 12,
        barMaxWidth: 16,
        z: 2,
        itemStyle: {
          borderRadius: [7, 7, 2, 2],
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#60a5fa' },
            { offset: 1, color: 'rgba(59, 130, 246, 0.16)' }
          ])
        },
        emphasis: {
          itemStyle: {
            color: '#2563eb'
          }
        }
      },
      {
        name:'咨询用户',
        type: 'bar',
        data: consultationUsers,
        barWidth: 12,
        barMaxWidth: 16,
        z: 2,
        itemStyle: {
          borderRadius: [7, 7, 2, 2],
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#a78bfa' },
            { offset: 1, color: 'rgba(139, 92, 246, 0.16)' }
          ])
        },
        emphasis: {
          itemStyle: {
            color: '#7c3aed'
          }
        }
      },
      {
        name:'新增用户',
        type: 'line',
        data: newUsers,
        smooth: true,
        showSymbol: false,
        symbol: 'circle',
        symbolSize: 7,
        z: 4,
        lineStyle: {
          width: 2,
          color: '#f59e0b',
          type: 'dashed'
        },
        itemStyle: {
          color: '#f59e0b',
          borderColor: '#ffffff',
          borderWidth: 2
        }
      }
    ]
  }
  chart.setOption(options)
}

const resizeCharts = () => {
  emotionChart?.resize()
  consultationChart?.resize()
  userActivityChart?.resize()
}

const initCharts = () => {
  initEmotionChart()
  initConsultationChart()
  initUserActivityChart()
}
//获取数据分析
const getAnalyticsOverviewList = async () => {
  loading.value = true
  try {
    const res = await getAnalyticsOverview()
    aiData.value = res
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getAnalyticsOverviewList()
  initCharts()
  window.addEventListener('resize', resizeCharts)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCharts)
  emotionChart?.dispose()
  consultationChart?.dispose()
  userActivityChart?.dispose()
  emotionChart = null
  consultationChart = null
  userActivityChart = null
})
</script>
<style lang="scss" scoped>
.dashboard-container {
    .overview-row {
      row-gap: 20px;
    }

    .overview-card {
      height: 100%;
      border: 1px solid #e5edf7;
      border-radius: 8px;
      background: #ffffff;
      box-shadow: 0 12px 28px rgba(15, 23, 42, 0.045);

      :deep(.el-card__body) {
        height: 100%;
        padding: 20px;
      }
    }

    .card-content {
      display: flex;
      align-items: center;
      height: 100%;
      .avatar {
        margin-right: 12px;
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        &.users {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        &.like {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        &.comments {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        &.smile {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
      }
      .info {
        min-width: 0;
        .title {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 4px;
        }
        .number {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.2;
          margin-bottom: 4px;
        }
        .subtitle-title {
          font-size: 12px;
          color: #94a3b8;
        }
      }
    }
    .chart-row {
      margin-top: 20px;
    }
    .chart-card {
      width: 100%;
      border: 1px solid #e5edf7;
      border-radius: 8px;
      background: #ffffff;
      box-shadow: 0 12px 28px rgba(15, 23, 42, 0.045);

      :deep(.el-card__header) {
        padding: 16px 20px 0;
        border-bottom: 0;
      }

      :deep(.el-card__body) {
        padding: 0;
      }

      .card-header {
        font-size: 16px;
        font-weight: 700;
        color: #0f172a;
      }
    }
    .chart-content {
      height: 360px;
      padding: 18px 18px 16px;
      position: relative;
      border-radius: 8px;

      .emotion-chart {
        width: 100%;
        height: 100%;
      }

      .consultation-chart {
        width: 100%;
        height: calc(100% - 78px);
        min-height: 240px;
      }

      .user-activity-chart {
        width: 100%;
        height: 100%;
      }

      &.user-activity-content {
        height: 400px;
      }

      canvas {
        width: 100% !important;
        height: 100% !important;
      }

      .consultation-stats {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
        margin-bottom: 14px;

        .stat-item {
          position: relative;
          overflow: hidden;
          padding: 12px 14px;
          border: 1px solid #e5edf7;
          border-radius: 8px;
          background: #fbfdff;

          &::before {
            content: '';
            position: absolute;
            top: 12px;
            bottom: 12px;
            left: 0;
            width: 3px;
            border-radius: 0 3px 3px 0;
            background: #14b8a6;
          }

          &.duration::before {
            background: #f59e0b;
          }

          &.user::before {
            background: #2563eb;
          }

          .stat-label {
            font-size: 12px;
            color: #64748b;
            margin-bottom: 6px;
          }

          .stat-value {
            font-size: 20px;
            font-weight: 700;
            line-height: 1.1;
            color: #0f172a;
          }
        }
      }
    }
  }

@media (max-width: 768px) {
  .dashboard-container {
    .chart-content {
      height: 320px;
      padding: 16px 12px;

      &.user-activity-content {
        height: 360px;
      }

      .consultation-stats {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>
