<template>
  <el-aside :width="isCollapse?'64px':'264px'">
    <el-menu
      class="menu-style"
      :collapse="isCollapse"
      :collapse-transition="false"
      :default-active="activeMenu"
      router
    >
      <div class="brand">
        <el-image
          :src="robotIcon" 
          :style="brandStyle"
          alt="logo" 
        />
        <div class="info-card" v-if="!isCollapse">
          <div class="brand-title">心理健康助手</div>
          <div class="brand-subTitle">管理后台</div>
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
const brandStyle=computed(()=>isCollapse.value?'width: 25px; height: 25px;':'width: 50px; height: 50px;margin-right:15px;')
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
.menu-style{
  height: 100%;
  .brand{
    display: flex;
    align-items: center;
    padding: 20px;
    background-color: #f5f7fa;
    .brand-title{
      font-size: 20px;
      font-weight: bold;
      margin-left: 5px;
      color: #1f2937;
    }
    .brand-subTitle{
      font-size: 14px;
      font-weight: normal;
      margin-left: 5px;
      color: #1f2937;
    }
  }
}

</style>
