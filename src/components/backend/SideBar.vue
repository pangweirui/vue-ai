<template>
  <el-aside class="backend-aside" :class="{ 'is-collapse': isCollapse }" :width="asideWidth">
    <el-menu
      class="menu-style"
      :collapse="isCollapse"
      :collapse-transition="false"
      :default-active="activeMenu"
      router
    >
      <div class="brand" :class="{ 'is-collapse': isCollapse }">
        <el-image
          class="brand-logo"
          :src="robotIcon" 
          alt="logo" 
        />
        <div class="info-card" v-if="!isCollapse">
          <div class="brand-title">心理健康数据中台</div>
          <div class="brand-subTitle">智能管理后台</div>
        </div>
      </div>
      <el-menu-item 
        v-for="item in menuItems"
        :key="item.path"
        :index="`${backendRoute.path}/${item.path}`"
        :title="item.meta?.title"
        >
        <el-icon v-if="getIcon(item.meta?.icon)">
          <component :is="getIcon(item.meta?.icon)" />
        </el-icon>
        <span>{{item.meta?.title}}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>
<script setup lang="ts">
import {computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import { ChatLineSquare, Message, PieChart, User } from '@element-plus/icons-vue'
import { useAdminStore } from '@/stores/admin'

const adminStore=useAdminStore()
const isCollapse=computed(()=>adminStore.isCollapse)
const asideWidth=computed(()=>isCollapse.value?'96px':'316px')
const route = useRoute()
const router = useRouter()
const backendRoute = router.options.routes[0]
const menuItems = backendRoute.children ?? []
const activeMenu = computed(() => route.path)

const iconMap = {
  PieChart,
  ChatLineSquare,
  Message,
  User,
}

const getIcon = (icon: unknown) => {
  if (typeof icon !== 'string') {
    return undefined
  }

  return iconMap[icon as keyof typeof iconMap]
}

const robotIcon = new URL('@/assets/images/robot.png', import.meta.url).href

</script>
<style lang="scss" scoped>
.backend-aside {
  background: #ffffff;
  border-right: 1px solid rgba(226, 232, 240, 0.92);
  box-shadow: 10px 0 30px rgba(15, 23, 42, 0.035);
  transition: width 0.2s ease;
  overflow: hidden;
}

.menu-style{
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 16px 14px;
  border-right: 0;
  background: #ffffff;
  .brand{
    display: flex;
    align-items: center;
    min-height: 108px;
    margin-bottom: 22px;
    padding: 18px;
    border: 1px solid #e5edf7;
    border-radius: 8px;
    background: linear-gradient(145deg, #ffffff 0%, #f8fbff 100%);
    box-shadow: 0 12px 28px rgba(30, 64, 175, 0.06);

    .brand-logo {
      flex: 0 0 auto;
      width: 58px;
      height: 58px;
      margin-right: 16px;
    }

    .info-card {
      min-width: 0;
    }

    .brand-title{
      font-size: 19px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.25;
      white-space: nowrap;
    }
    .brand-subTitle{
      font-size: 12px;
      font-weight: 500;
      margin-top: 6px;
      color: #64748b;
      letter-spacing: 0;
    }
  }

  :deep(.el-menu-item) {
    height: 48px;
    margin: 7px 0;
    padding: 0 18px !important;
    border-radius: 8px;
    color: #64748b;
    font-weight: 500;
    transition: background-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;
  }

  :deep(.el-menu-item:hover) {
    background: #f6f9fe;
    color: #2563eb;
  }

  :deep(.el-menu-item.is-active) {
    background: linear-gradient(90deg, #eff6ff 0%, #eef2ff 100%);
    color: #2563eb;
    font-weight: 700;
    box-shadow: inset 3px 0 0 #3b82f6;
  }

  :deep(.el-menu-item .el-icon) {
    margin-right: 12px;
    font-size: 19px;
  }
}

.backend-aside.is-collapse {
  .menu-style {
    padding: 16px 12px;
  }

  .brand {
    justify-content: center;
    min-height: 108px;
    padding: 0;

    .brand-logo {
      width: 38px;
      height: 38px;
      margin-right: 0;
    }
  }

  :deep(.el-menu--collapse) {
    width: 100%;
  }

  :deep(.el-menu-item) {
    width: 100%;
    height: 56px;
    justify-content: center;
    margin: 10px 0;
    padding: 0 !important;
    border-radius: 10px;
  }

  :deep(.el-menu-item.is-active) {
    box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.14);
  }

  :deep(.el-menu-item .el-icon) {
    margin: 0;
    font-size: 22px;
  }

  :deep(.el-menu-item span) {
    display: none;
  }
}

</style>
