<template>
  <div class="frontend-layout">
    <div class="navbar-container">
      <div class="brand-section" @click="handleClickBrand">
        <el-image :src="logo" alt="心晴倾听" class="brand-logo" />
        <h1 class="brand-name">心晴倾听</h1>
      </div>
      <div class="nav-section">
          <router-link to="/front/home" active-class="active" class="nav-link" >首页</router-link>
          <router-link to="/front/consulation" active-class="active" class="nav-link" v-if="isLoggedIn" >AI咨询</router-link>
          <router-link to="/front/emotion-diary" active-class="active" class="nav-link" v-if="isLoggedIn" >情绪日记</router-link>
          <router-link to="/front/knowledge" active-class="active" class="nav-link" >知识库</router-link>
          <el-dropdown class="logout-btn" v-if="isLoggedIn" @command="handleCommand">
            <el-button class="user-btn">
              <el-icon> <User /></el-icon>
              <p class="user-name">用户</p>
              <el-icon> <ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
            <el-dropdown-menu >
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
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
import { useRouter } from 'vue-router'
import { logout } from '@/apis/admin'
import { useAdminStore } from '@/stores/admin'
import { ElMessage } from 'element-plus'
import logo from '@/assets/images/xinqing-logo.svg'

const isLoggedIn=computed(()=>localStorage.getItem('token')!==null)

const store=useAdminStore()

const router=useRouter()

const handleClickBrand=()=>{
    router.push('/front/home')
}

const handleCommand=async(command)=>{
  if (command === 'logout') {
    ElMessageBox.confirm('确定退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await logout()
      store.logout()
      ElMessage.success('退出登录成功')
    }).catch(() => {
      ElMessage.info('已取消退出登录')
    })
  }
}
</script>

<style lang="scss" scoped>
.frontend-layout {
  --frontend-nav-height: 64px;

  min-height: 100vh;
  background-color: #fff;
  .navbar-container {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      min-height: var(--frontend-nav-height);
      width: 100%;
      margin: 0;
      padding: 10px max(14px, calc((100vw - 1200px) / 2 + 10px));
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      background: rgba(255, 255, 255, 0.96);
      border-bottom: 1px solid rgba(226, 232, 240, 0.9);
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
      backdrop-filter: blur(12px);
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
          &:hover {
              cursor: pointer;
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

  .content-container {
      padding-top: var(--frontend-nav-height);
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

@media (max-width: 720px) {
  .frontend-layout {
    --frontend-nav-height: 116px;

    .navbar-container {
      flex-wrap: wrap;
      gap: 12px;
      padding: 10px 14px;
    }

    .navbar-container .brand-section .brand-name {
      font-size: 20px;
    }

    .navbar-container .nav-section {
      width: 100%;
      justify-content: center;
      flex-wrap: wrap;
      gap: 14px 20px;

      .nav-link {
        font-size: 14px;
      }

      :deep(.el-button) {
        height: 32px;
        padding: 8px 14px;
      }
    }
  }
}
</style>
