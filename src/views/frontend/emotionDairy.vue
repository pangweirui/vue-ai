<template>
  <main class="emotionDiary-container">
    <section class="header-section">
      <div class="header-content">
        <div class="header-copy">
          <p class="eyebrow">
            <el-icon><Calendar /></el-icon>
            {{ formatDateLabel }}
          </p>
          <h1>情绪日记</h1>
          <p class="subtitle">给今天的感受留一盏灯，慢慢看见情绪的来处和去处。</p>
        </div>

        <div class="header-panel">
          <div class="logo-wrap">
            <el-image :src="logo" alt="情绪日记" fit="contain" />
          </div>
          <div class="today-state">
            <span>今日状态</span>
            <strong>{{ dairyForm.dominantEmotion || '待记录' }}</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="content">
      <article class="diary-card score-card">
        <div class="card-heading">
          <span class="step-index">01</span>
          <div>
            <h2>今日情绪评分</h2>
            <p>先给今天一个整体分数，不必精确，只要诚实。</p>
          </div>
        </div>

        <div class="score-body">
          <div class="score-display">
            <strong>{{ dairyForm.moodScore || 0 }}</strong>
            <span>/ 10</span>
          </div>
          <el-rate
            v-model="dairyForm.moodScore"
            :texts="emotionStatus"
            :colors="rateColors"
            show-text
            :max="10"
          />
        </div>
      </article>

      <article class="diary-card">
        <div class="card-heading">
          <span class="step-index">02</span>
          <div>
            <h2>主要情绪</h2>
            <p>选择最贴近今天的一个感受。</p>
          </div>
        </div>

        <div class="emotion-grid">
          <button
            v-for="item in emotionOptions"
            :key="item.name"
            class="emotion-card"
            :class="{ selected: item.name === dairyForm.dominantEmotion }"
            type="button"
            @click="dairyForm.dominantEmotion = item.name"
          >
            <el-image :src="item.value" :alt="item.name" class="emotion-icon" fit="contain" />
            <span class="emotion-name">{{ item.name }}</span>
          </button>
        </div>
      </article>

      <article class="diary-card">
        <div class="card-heading">
          <span class="step-index">03</span>
          <div>
            <h2>详细记录</h2>
            <p>把触发点、身体状态和想法记下来，方便之后回看。</p>
          </div>
        </div>

        <div class="detail-form">
          <div class="form-group">
            <label class="form-label">情绪触发事件</label>
            <el-input
              v-model="dairyForm.emotionTriggers"
              type="textarea"
              placeholder="是什么事情、场景或念头触发了今天的情绪？"
              :rows="4"
              maxlength="1000"
              show-word-limit
            />
          </div>

          <div class="form-group">
            <label class="form-label">今日感想</label>
            <el-input
              v-model="dairyForm.diaryContent"
              type="textarea"
              placeholder="写下此刻想对自己说的话。"
              :rows="4"
              maxlength="1000"
              show-word-limit
            />
          </div>

          <div class="life-indicators">
            <div class="indicator-group">
              <label class="indicator-label">睡眠质量</label>
              <el-select v-model="dairyForm.sleepQuality" placeholder="请选择睡眠质量">
                <el-option label="优秀" value="5" />
                <el-option label="良好" value="4" />
                <el-option label="一般" value="3" />
                <el-option label="较差" value="2" />
                <el-option label="很差" value="1" />
              </el-select>
            </div>

            <div class="indicator-group">
              <label class="indicator-label">压力等级</label>
              <el-select v-model="dairyForm.stressLevel" placeholder="请选择压力等级">
                <el-option label="很高" value="5" />
                <el-option label="较高" value="4" />
                <el-option label="中等" value="3" />
                <el-option label="较低" value="2" />
                <el-option label="很低" value="1" />
              </el-select>
            </div>
          </div>

          <div class="action-buttons">
            <el-button type="primary" size="large" @click="submitForm">
              <el-icon><Check /></el-icon>
              提交记录
            </el-button>
            <el-button size="large" @click="resetForm">
              <el-icon><RefreshLeft /></el-icon>
              重新填写
            </el-button>
          </div>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup>
import { reactive } from 'vue'
import { Calendar, Check, RefreshLeft } from '@element-plus/icons-vue'
import { submitEmotionDairy } from '@/apis/frontend'
import { dayjs } from 'element-plus'
import logo from '@/assets/images/like.png'
import happy from '@/assets/images/开心.png'
import calm from '@/assets/images/平静.png'
import anxiety from '@/assets/images/焦虑.png'
import sad from '@/assets/images/悲伤.png'
import excited from '@/assets/images/兴奋.png'
import tired from '@/assets/images/疲惫.png'
import surprised from '@/assets/images/惊讶.png'
import confused from '@/assets/images/困惑.png'

const createInitialDairyForm = () => ({
  diaryDate: dayjs().format('YYYY-MM-DD'),
  moodScore: 0,
  dominantEmotion: '',
  emotionTriggers: '',
  diaryContent: '',
  sleepQuality: '',
  stressLevel: '',
})

const formatDateLabel = dayjs().format('YYYY年MM月DD日')
const dairyForm = reactive(createInitialDairyForm())

const rateColors = ['#ef4444', '#f97316', '#f59e0b', '#14b8a6', '#2563eb']
const emotionStatus = ['崩溃', '低落', '焦虑', '疲惫', '平静', '放松', '愉悦', '满足', '兴奋', '幸福']
const emotionOptions = [
  { name: '开心', value: happy },
  { name: '平静', value: calm },
  { name: '焦虑', value: anxiety },
  { name: '悲伤', value: sad },
  { name: '兴奋', value: excited },
  { name: '疲惫', value: tired },
  { name: '惊讶', value: surprised },
  { name: '困惑', value: confused },
]

const submitForm = async () => {
  try {
    await submitEmotionDairy(dairyForm)
    ElMessage.success('提交成功')
    resetForm()
  } catch (err) {
    ElMessage.error('提交失败')
  }
}

const resetForm = () => {
  Object.assign(dairyForm, createInitialDairyForm())
}
</script>

<style lang="scss" scoped>
.emotionDiary-container {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  min-height: calc(100vh - 142px);
  background:
    linear-gradient(180deg, rgba(240, 253, 250, 0.82) 0%, rgba(255, 247, 237, 0.56) 48%, #f8fafc 100%),
    #f8fafc;
}

.header-section {
  position: relative;
  overflow: hidden;
  color: #ffffff;
  background: linear-gradient(120deg, #0f766e 0%, #2563eb 62%, #f59e0b 100%);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgba(255, 255, 255, 0.14) 1px, transparent 1px),
      linear-gradient(180deg, rgba(255, 255, 255, 0.12) 1px, transparent 1px);
    background-size: 58px 58px;
    opacity: 0.18;
  }
}

.header-content {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  align-items: center;
  gap: 40px;
  min-width: 0;
  max-width: 1080px;
  margin: 0 auto;
  padding: 64px 24px 78px;
}

.header-copy {
  min-width: 0;

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 34px;
    padding: 0 14px;
    margin-bottom: 18px;
    border: 1px solid rgba(255, 255, 255, 0.34);
    border-radius: 999px;
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    font-weight: 700;
    background: rgba(255, 255, 255, 0.13);
  }

  h1 {
    margin-bottom: 16px;
    font-size: 48px;
    line-height: 1.12;
    letter-spacing: 0;
  }

  .subtitle {
    max-width: 560px;
    color: rgba(255, 255, 255, 0.84);
    font-size: 18px;
    line-height: 1.8;
  }
}

.header-panel {
  display: flex;
  align-items: center;
  gap: 18px;
  justify-self: end;
  width: 100%;
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.14);
  box-shadow: 0 22px 60px rgba(15, 23, 42, 0.2);
  backdrop-filter: blur(14px);

  .logo-wrap {
    display: grid;
    place-items: center;
    flex: 0 0 74px;
    height: 74px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
  }

  :deep(.el-image) {
    width: 48px;
    height: 48px;
  }

  .today-state {
    display: flex;
    flex-direction: column;
    gap: 8px;

    span {
      color: rgba(255, 255, 255, 0.72);
      font-size: 14px;
    }

    strong {
      font-size: 24px;
      line-height: 1.2;
      color: #ffffff;
    }
  }
}

.content {
  display: grid;
  gap: 20px;
  min-width: 0;
  max-width: 1080px;
  margin: -42px auto 0;
  padding: 0 24px 56px;
}

.diary-card {
  position: relative;
  min-width: 0;
  padding: 28px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}

.card-heading {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;

  .step-index {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 42px;
    width: 42px;
    height: 42px;
    border-radius: 8px;
    color: #0f766e;
    font-size: 14px;
    font-weight: 800;
    background: #ccfbf1;
  }

  h2 {
    margin-bottom: 6px;
    color: #111827;
    font-size: 22px;
    line-height: 1.32;
    letter-spacing: 0;
  }

  p {
    color: #64748b;
    font-size: 15px;
    line-height: 1.7;
  }
}

.score-card {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(320px, 1.05fr);
  align-items: center;
  gap: 30px;
  min-width: 0;
}

.score-body {
  display: flex;
  align-items: center;
  gap: 24px;
  min-width: 0;
  padding: 20px 22px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%);

  .score-display {
    display: flex;
    align-items: baseline;
    flex: 0 0 auto;

    strong {
      color: #0f766e;
      font-size: 42px;
      line-height: 1;
    }

    span {
      margin-left: 6px;
      color: #64748b;
      font-size: 16px;
      font-weight: 700;
    }
  }

  :deep(.el-rate) {
    flex-wrap: wrap;
    height: auto;
    min-width: 0;
    max-width: 100%;
    gap: 4px 0;
  }

  :deep(.el-rate__text) {
    margin-left: 10px;
    color: #334155;
    font-weight: 700;
  }
}

.emotion-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.emotion-card {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 76px;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #334155;
  font: inherit;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
  background: #ffffff;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: #99f6e4;
    background: #f0fdfa;
    box-shadow: 0 12px 24px rgba(15, 118, 110, 0.12);
  }

  &.selected {
    border-color: #14b8a6;
    color: #0f766e;
    background: #ecfeff;
    box-shadow: 0 12px 28px rgba(20, 184, 166, 0.18);
  }

  .emotion-icon {
    flex: 0 0 42px;
    width: 42px;
    height: 42px;
  }

  .emotion-name {
    overflow-wrap: anywhere;
  }
}

.detail-form {
  display: grid;
  gap: 20px;
}

.form-group,
.indicator-group {
  display: grid;
  gap: 10px;
}

.form-label,
.indicator-label {
  color: #334155;
  font-size: 15px;
  font-weight: 700;
}

:deep(.el-textarea__inner),
:deep(.el-select__wrapper) {
  border-radius: 8px;
  box-shadow: 0 0 0 1px #dbe4ef inset;
}

:deep(.el-textarea__inner) {
  padding: 14px 16px;
  line-height: 1.75;
  background: #fbfdff;
}

.life-indicators {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;

  :deep(.el-select) {
    width: 100%;
  }
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;

  :deep(.el-button) {
    min-width: 124px;
    border-radius: 8px;
    font-weight: 700;
  }

  :deep(.el-button--primary) {
    border-color: #0f766e;
    background: #0f766e;
    box-shadow: 0 12px 22px rgba(15, 118, 110, 0.18);
  }
}

@media (max-width: 900px) {
  .header-content {
    grid-template-columns: 1fr;
    padding: 52px 20px 68px;
  }

  .header-panel {
    justify-self: stretch;
    max-width: 360px;
  }

  .score-card {
    grid-template-columns: 1fr;
  }

  .emotion-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .header-copy {
    h1 {
      font-size: 38px;
    }

    .subtitle {
      font-size: 16px;
    }
  }

  .content {
    margin-top: -30px;
    padding: 0 14px 42px;
  }

  .diary-card {
    padding: 20px;
  }

  .card-heading {
    gap: 12px;
  }

  .score-body {
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
  }

  .life-indicators,
  .emotion-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
    align-items: stretch;

    :deep(.el-button) {
      width: 100%;
      margin-left: 0;
    }
  }
}
</style>
