<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="情绪日志详情"
      width="70%"
    >
      <div v-if="currentDetail">
        <div class="detail-section">
          <h4>用户信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户名">{{ currentDetail.username }}</el-descriptions-item> 
            <el-descriptions-item label="昵称">{{ currentDetail.nickname ?? '无'  }}</el-descriptions-item> 
            <el-descriptions-item label="用户ID">{{ currentDetail.userId }}</el-descriptions-item> 
            <el-descriptions-item label="记录日期">{{ currentDetail.updatedAt }}</el-descriptions-item> 
          </el-descriptions>
        </div>
        <div class="detail-section">
          <h4>情绪状态</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="情绪评分">
              <el-rate v-model="currentDetail.moodScore" disabled :max="10"/>
            </el-descriptions-item> 
            <el-descriptions-item label="主要情绪">
              <el-tag :type="getEmotionTagType(currentDetail.dominantEmotion)">{{ currentDetail.dominantEmotion ??'无' }}</el-tag>
            </el-descriptions-item> 
            <el-descriptions-item label="睡眠质量">{{ currentDetail.sleepQuality ??'无' }}/5</el-descriptions-item> 
            <el-descriptions-item label="压力水平">{{ currentDetail.stressLevel ??'无' }}/5</el-descriptions-item> 
          </el-descriptions>
        </div>
        <div class="detail-section">
          <h4>日记内容</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="情绪触发因素">
              {{ currentDetail.triggerFactors ??'无' }}
            </el-descriptions-item> 
            <el-descriptions-item label="日记内容">
              {{ currentDetail.content ??'无' }}
            </el-descriptions-item> 
          </el-descriptions>
        </div>
        <div class="detail-section">
          <h4>AI情绪分析结果</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="主要情绪">
              <el-rate v-model="currentDetail.moodScore" disabled :max="10"/>
            </el-descriptions-item> 
            <el-descriptions-item label="风险等级">
              <el-tag :type="getRiskLevelTagType(currentDetail.riskLevel)">{{ currentDetail.riskLevel ??'无' }}</el-tag>
            </el-descriptions-item> 
            <el-descriptions-item label="睡眠质量">{{ currentDetail.sleepQuality ??'无' }}/5</el-descriptions-item> 
            <el-descriptions-item label="压力水平">{{ currentDetail.stressLevel ??'无' }}/5</el-descriptions-item> 
          </el-descriptions>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref,computed } from 'vue'

const props=defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  currentDetail: {
    type: Object,
    default: () => ({})
  }
})

const emit=defineEmits(['update:modelValue'])

const dialogVisible=computed({
  get:()=>props.modelValue,
  set:(val)=>emit('update:modelValue',val)
})

const getEmotionTagType = (emotion) => {
  const emotionTypes = {
    '快乐': 'success',
    '平静': 'info',
    '兴奋': 'warning',
    '愤怒': 'danger',
    '悲伤': 'info',
    '焦虑': 'warning'
  }
  return emotionTypes[emotion] || 'info'
}

const getAiEmotionTagType = (emotion) => {
  const emotionTagMap = {
    '快乐': 'success',
    '平静': 'success',
    '兴奋': 'warning',
    '满足': 'success',
    '愤怒': 'danger',
    '悲伤': 'info',
    '焦虑': 'warning',
    '恐惧': 'danger',
    '沮丧': 'info',
    '压力': 'warning'
  }
  return emotionTagMap[emotion] || 'info'
}

const getEmotionScoreColor = (score) => {
  if (score >= 80) return '#f56c6c'
  if (score >= 60) return '#e6a23c'
  if (score >= 40) return '#909399'
  return '#67c23a'
}

const getRiskLevelTagType = (riskLevel) => {
  const riskTagMap = {
    0: 'success',
    1: 'info',
    2: 'warning',
    3: 'danger'
  }
  return riskTagMap[riskLevel] || 'info'
}

const getRiskLevelText = (riskLevel) => {
  const riskTextMap = {
    0: '正常',
    1: '关注',
    2: '预警',
    3: '危机'
  }
  return riskTextMap[riskLevel] || '未知风险等级'
}
</script>

<style lang="scss" scoped>
.detail-content {
  .detail-section {
    margin-bottom: 24px;
    
    h4 {
      margin: 0 0 16px 0;
      color: #303133;
      font-size: 16px;
      
      i {
        margin-right: 8px;
        color: #409eff;
      }
    }
  }
}
.ai-analysis-status {
  .ai-status-tag {
    margin-bottom: 4px;
    
    i {
      margin-right: 4px;
    }
  }
  
  .ai-analysis-preview {
    font-size: 11px;
    color: #909399;
    margin-top: 2px;
  }
}

.ai-analysis-result {
  .ai-keywords-section,
  .ai-suggestion-section,
  .ai-risk-section,
  .ai-improvements-section {
    margin-top: 16px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 4px;
    
    h5 {
      margin: 0 0 8px 0;
      color: #606266;
      font-size: 14px;
      font-weight: 600;
      
      i {
        margin-right: 6px;
        color: #909399;
      }
    }
  }
  
  .keywords-container {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    
    .keyword-tag {
      background-color: #e1f3d8;
      color: #67c23a;
      border-color: #b3d8a4;
    }
  }
  
  .suggestion-content,
  .risk-content {
    line-height: 1.6;
    color: #606266;
    background-color: white;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ebeef5;
  }
  
  .improvement-list {
    margin: 0;
    padding-left: 20px;
    
    li {
      margin-bottom: 4px;
      color: #606266;
      line-height: 1.5;
    }
  }
  
  .ai-analysis-meta {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #ebeef5;
    
    .analysis-time {
      margin: 0;
      font-size: 12px;
      color: #909399;
      
      i {
        margin-right: 4px;
      }
    }
  }
  
  .el-progress {
    .el-progress__text {
      font-size: 12px !important;
    }
  }
}
</style>