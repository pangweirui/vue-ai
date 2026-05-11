<template>
  <div class="nav-bar">
    <div class="flex-box">
      <el-button @click="handleCollapse">
        <el-icon> <Expand /></el-icon>
      </el-button>
      <div class="page-title">导航栏</div>
    </div>
    <div class="flex-box">
      <el-dropdown @command="handleCommand">
        <el-button>
          <el-icon> <User /></el-icon>
          <p class="user-name">用户</p>
          <el-icon> <ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAdminStore } from '@/stores/admin'

const adminStore=useAdminStore()

const handleCollapse=()=>{
  adminStore.toggleCollapse()
}

const handleCommand = (command: string) => {
  console.log(command)
}

</script>

<style lang="scss" scoped>
.nav-bar{
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding:0 15px;
  background:white;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  border-bottom:1px solid #e5e7eb;
  .page-title{
    font-size: 20px;
    font-weight: bold;
    margin-left: 10px;
  }
  .flex-box{
    display: flex;
    align-items: center;
  }
}
</style>
