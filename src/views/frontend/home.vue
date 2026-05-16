<template>
  <main class="home-container">
    <section class="hero-section">
      <div class="content">
        <div class="text">
          <p class="eyebrow">心晴倾听 · AI 情绪陪伴</p>
          <h2 class="title">
            让每一次倾诉<br>
            <span>都被温柔接住</span>
          </h2>
          <p class="description">
            通过智能对话、情绪记录和轻量知识内容，陪伴你整理情绪、理解自己，把难开口的话慢慢说出来。
          </p>
          <div class="hero-actions">
            <router-link to="/front/consulation">
              <el-button class="primary-action" size="large" type="primary">开始倾诉</el-button>
            </router-link>
            <router-link to="/front/emotion-diary">
              <el-button class="secondary-action" size="large">记录心情</el-button>
            </router-link>
          </div>
        </div>

        <div class="visual-panel">
          <div class="robot">
            <el-image :src="logo" alt="心晴倾听" fit="contain" />
          </div>
          <div class="status-list">
            <div class="status-item">
              <span class="status-label">今日陪伴</span>
              <strong>24h</strong>
            </div>
            <div class="status-item">
              <span class="status-label">情绪记录</span>
              <strong>可追踪</strong>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="feature-grid">
      <div class="feature-item">
        <span class="feature-index">01</span>
        <h3>AI 倾诉陪伴</h3>
        <p>在焦虑、孤独或压力时刻，提供及时、温和的对话支持。</p>
      </div>
      <div class="feature-item">
        <span class="feature-index">02</span>
        <h3>情绪日记</h3>
        <p>记录每日感受，帮助用户看见情绪变化和触发因素。</p>
      </div>
      <div class="feature-item">
        <span class="feature-index">03</span>
        <h3>轻量知识库</h3>
        <p>沉淀心理健康内容，提供更易理解的自助阅读材料。</p>
      </div>
    </section>
  </main>
</template>

<script setup>
import logo from '@/assets/images/xinqing-logo.svg'
</script>

<style lang="scss" scoped>
.home-container {
  min-height: calc(100vh - 142px);
  background: #f7fbff;
}

.hero-section {
  position: relative;
  overflow: hidden;
  min-height: 560px;
  padding: 78px 24px 64px;
  color: #ffffff;
  background: linear-gradient(115deg, rgba(12, 74, 110, 0.95) 0%, rgba(20, 116, 111, 0.9) 54%, rgba(30, 64, 175, 0.86) 100%);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgba(255, 255, 255, 0.12) 1px, transparent 1px),
      linear-gradient(180deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 56px 56px;
    opacity: 0.22;
  }

  .content {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(300px, 0.7fr);
    align-items: center;
    gap: 64px;
    max-width: 1180px;
    margin: 0 auto;
  }
}

.text {
  max-width: 650px;

  .eyebrow {
    display: inline-flex;
    align-items: center;
    height: 32px;
    padding: 0 14px;
    margin-bottom: 22px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 999px;
    color: rgba(255, 255, 255, 0.88);
    font-size: 14px;
    font-weight: 700;
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(12px);
  }

  .title {
    margin-bottom: 22px;
    font-size: 56px;
    line-height: 1.14;
    font-weight: 800;
    letter-spacing: 0;

    span {
      color: #fde68a;
    }
  }

  .description {
    max-width: 570px;
    color: rgba(255, 255, 255, 0.84);
    font-size: 18px;
    line-height: 1.9;
  }

  .hero-actions {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: 34px;

    a {
      display: inline-flex;
    }

    :deep(.el-button) {
      min-width: 132px;
      height: 46px;
      border-radius: 8px;
      font-weight: 700;
    }

    .primary-action {
      border: 0;
      background: #ffffff;
      color: #0f766e;
      box-shadow: 0 16px 30px rgba(15, 23, 42, 0.22);
    }

    .secondary-action {
      border-color: rgba(255, 255, 255, 0.58);
      color: #ffffff;
      background: rgba(255, 255, 255, 0.08);
    }
  }
}

.visual-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-self: end;
  width: min(360px, 100%);
  padding: 34px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 26px 70px rgba(15, 23, 42, 0.22);
  backdrop-filter: blur(14px);

  .robot {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 210px;
    height: 210px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.18);

    :deep(.el-image) {
      width: 148px;
      height: 148px;
    }
  }

  .status-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    width: 100%;
    margin-top: 28px;
  }

  .status-item {
    padding: 16px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.12);

    .status-label {
      display: block;
      margin-bottom: 8px;
      color: rgba(255, 255, 255, 0.72);
      font-size: 13px;
    }

    strong {
      font-size: 22px;
      line-height: 1;
    }
  }
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  max-width: 1180px;
  margin: -34px auto 0;
  padding: 0 24px 68px;
  position: relative;
  z-index: 2;
}

.feature-item {
  min-height: 172px;
  padding: 26px;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 18px 44px rgba(15, 23, 42, 0.08);

  .feature-index {
    display: block;
    margin-bottom: 18px;
    color: #0f766e;
    font-size: 13px;
    font-weight: 800;
  }

  h3 {
    margin-bottom: 10px;
    color: #0f172a;
    font-size: 20px;
    line-height: 1.3;
  }

  p {
    color: #64748b;
    font-size: 15px;
    line-height: 1.7;
  }
}

@media (max-width: 960px) {
  .hero-section {
    min-height: auto;
    padding: 56px 20px 88px;
    background: linear-gradient(120deg, rgba(12, 74, 110, 0.96) 0%, rgba(20, 116, 111, 0.9) 58%, rgba(30, 64, 175, 0.86) 100%);

    .content {
      grid-template-columns: 1fr;
      gap: 34px;
    }
  }

  .text {
    .title {
      font-size: 42px;
    }

    .description {
      font-size: 16px;
    }
  }

  .visual-panel {
    justify-self: stretch;
    width: 100%;
  }

  .feature-grid {
    grid-template-columns: 1fr;
    margin-top: -48px;
  }
}

@media (max-width: 560px) {
  .hero-section {
    padding: 44px 18px 82px;
  }

  .text {
    .eyebrow {
      max-width: 100%;
    }

    .title {
      font-size: 34px;
    }

    .hero-actions {
      flex-direction: column;
      align-items: stretch;

      a,
      :deep(.el-button) {
        width: 100%;
      }
    }
  }

  .visual-panel {
    padding: 24px;

    .status-list {
      grid-template-columns: 1fr;
    }
  }

  .feature-grid {
    padding: 0 18px 48px;
  }
}
</style>
