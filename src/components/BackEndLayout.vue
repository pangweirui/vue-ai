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
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
</script>

<style lang="scss" scoped>
.backend-layout {
  height: 100vh;
  .main-container{
    height: 100%;
    .el-header{
      height: 74px!important;
    }
    .content-container{
      padding: 20px;
      background-color: #fff;
      min-height: calc(100vh - 74px);
      
    }
  }
  .side-bar{
    height: 100%;
  }
}
</style>
