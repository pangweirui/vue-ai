<template>
  <div class="frontend-layout">
    <div class="navbar-container">
      <div class="brand-section">
        <el-image :src="logo" alt="心晴倾听" class="brand-logo" />
        <h1 class="brand-name">心晴倾听</h1>
      </div>
      <div class="nav-section">
          <router-link to="/front/home" active-class="active" class="nav-link" >首页</router-link>
          <router-link to="/front/consulation" active-class="active" class="nav-link" v-if="isLoggedIn" >AI咨询</router-link>
          <router-link to="/front/emotion-diary" active-class="active" class="nav-link" v-if="isLoggedIn" >情绪日记</router-link>
          <router-link to="/front/knowledge" active-class="active" class="nav-link" >知识库</router-link>
          <el-button class="logout-btn" v-if="isLoggedIn">退出登录</el-button>
          <template v-else>
            <router-link to="/auth/login" active-class="active" class="nav-link">登录</router-link>
            <router-link to="/auth/register" active-class="active" class="nav-link">
              <el-button type="primary">注册</el-button>
            </router-link>
          </template>
        </div>
    </div>
    <div class="content-container">
      <router-view></router-view>
    </div>
    <div class="footer-container">
      <div class="footer-bottom">
        <div class="footer-text">
          &copy; 2026 心晴倾听. All rights reserved.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import logo from '@/assets/images/xinqing-logo.svg'

const isLoggedIn=computed(()=>localStorage.getItem('token')!==null)
</script>

<style lang="scss" scoped>
.frontend-layout {
  background-color: #fff;
  .navbar-container {
      max-width: 1200px;
      height: 100%;
      margin: 0 auto;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .brand-section {
          display: flex;
          align-items: center;
          .brand-logo {
              width: 40px;
              height: 40px;
          }
          .brand-name {
              margin-left: 10px;
              font-size: 24px;
              font-weight: 600;
              color: #333;
          }
      }
      .nav-section {
          display: flex;
          align-items: center;
          gap: 40px;
          .nav-link {
              color: #4b5563;
              font-size: 16px;
              font-weight: 500;
              padding-bottom: 4px;
              border-bottom: 2px solid transparent;
              transition: color 0.18s ease, border-color 0.18s ease;
              &:hover {
                  color: #4A90E2;
              }
              &.active {
                  color: #2563eb;
                  border-bottom-color: #2563eb;
                  font-weight: 700;
              }
          }
      }
  }

  .footer-container {
      background: #1f2937;
      color: white;
      padding: 15px 0;
      margin-top: auto;
      .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 10px;
          text-align: center;
      }
  }
}
</style>
