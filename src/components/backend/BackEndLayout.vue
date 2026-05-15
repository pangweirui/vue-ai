<template>
  <div class="backend-layout">
    <el-container class="main-container">
      <SideBar class="side-bar" />
      <el-container>
        <el-header>
          <NavBar />
        </el-header>
        <el-main class="content-container">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import SideBar from '@/components/backend/SideBar.vue'
import NavBar from '@/components/backend/NavBar.vue'
</script>

<style lang="scss" scoped>
.backend-layout {
  height: 100vh;
  .main-container{
    height: 100%;
    background: #ffffff;
    .el-header{
      height: 74px!important;
    }
    .content-container{
      position: relative;
      padding: 24px;
      background: #ffffff;
      min-height: calc(100vh - 74px);
      overflow: auto;
    }
  }
  .side-bar{
    height: 100%;
  }
}

@media (max-width: 768px) {
  .backend-layout {
    .main-container {
      .content-container {
        padding: 16px;
      }
    }
  }
}
</style>
