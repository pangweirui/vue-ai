<template>
  <div class="auth-layout">
    <div class="left-section">
      <div class="content">
        <div class="title">心晴倾听</div>
        <div class="text">在需要被理解的时刻，用温和的智能陪伴帮助您整理情绪、看见自己。</div>
        <div class="robot">
          <el-image 
            :src="robot" 
            alt="心晴倾听"
            style="width: 100px;height: 100px;"
          ></el-image>
        </div>
      </div>
    </div>
    <div class="right-section">
      <router-view></router-view>
    </div>
</div>
</template>

<script setup>
import robot from '@/assets/images/xinqing-logo.svg'
</script>

<style lang="scss" scoped>
.auth-layout {
    display: flex;
    min-height: 100vh;
    background: #ffffff;
    .left-section {
        position: relative;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        background: linear-gradient(135deg, #2563eb 0%, #14b8a6 100%);
        height: 100vh;

        &::before {
            content: '';
            position: absolute;
            inset: 0;
            background:
              linear-gradient(90deg, rgba(255, 255, 255, 0.12) 1px, transparent 1px),
              linear-gradient(180deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
            background-size: 44px 44px;
            opacity: 0.34;
        }

        .content {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: min(520px, 82%);
            text-align: center;
            .title {
                margin-bottom: 18px;
                font-size: 42px;
                font-weight: bold;
                color: #fff;
                line-height: 1.2;
            }
            .text {
                margin-bottom: 28px;
                width: 100%;
                font-size: 18px;
                line-height: 1.8;
                color: rgba(255, 255, 255, 0.86);
                text-align: center;
            }
            .robot {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 160px;
                height: 160px;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.24);
                background: rgba(255, 255, 255, 0.14);
                box-shadow: 0 20px 48px rgba(15, 23, 42, 0.16),inset 0 1px 0 rgba(255, 255, 255, 0.28);
                backdrop-filter: blur(10px);
            }
        }
    }
    .right-section {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        height: 100vh;
        padding: 32px;
        background-color: #ffffff;
    }
}

@media (max-width: 960px) {
    .auth-layout {
        .left-section {
            display: none;
        }

        .right-section {
            min-height: 100vh;
            height: auto;
        }
    }
}
</style>
