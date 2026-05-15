<template>
  <div class="nav-bar">
    <div class="flex-box">
      <el-button class="collapse-btn" @click="handleCollapse">
        <el-icon> <Expand /></el-icon>
      </el-button>
      <div class="page-title">{{ route.meta.title }}</div>
    </div>
    <div class="flex-box">
      <el-dropdown @command="handleCommand">
        <el-button class="user-btn">
          <el-icon> <User /></el-icon>
          <p class="user-name">管理员</p>
          <el-icon> <ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu >
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { logout } from '@/apis/admin'
import { useAdminStore } from '@/stores/admin'
import { ElMessageBox ,ElMessage} from 'element-plus'

const adminStore=useAdminStore()

const route = useRoute()

const handleCollapse=()=>{
  adminStore.toggleCollapse()
}

const handleCommand = (command: string) => {
  if (command === 'logout') {
    ElMessageBox.confirm('确定退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await logout()
      adminStore.logout()
      ElMessage.success('退出登录成功')
    }).catch(() => {
      ElMessage.info('已取消退出登录')
    })
  }
}

</script>

<style lang="scss" scoped>
.nav-bar{
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding:0 20px;
  background:#ffffff;
  border-bottom:1px solid #e5edf7;
  .page-title{
    font-size: 18px;
    font-weight: 700;
    margin-left: 12px;
    color: #0f172a;
  }
  .flex-box{
    display: flex;
    align-items: center;
  }

  .collapse-btn {
    width: 38px;
    height: 38px;
    padding: 0;
    border-radius: 8px;
    border-color: #dbe6f4;
    color: #475569;
    background: #ffffff;
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.04);
  }

  .user-btn {
    height: 38px;
    border-radius: 8px;
    border-color: #dbe6f4;
    color: #475569;
    background: #ffffff;
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.04);
  }

  .collapse-btn:hover,
  .user-btn:hover {
    border-color: #bfdbfe;
    color: #2563eb;
    background: #f8fbff;
  }

  .user-name {
    margin: 0 6px;
    color: #334155;
    font-weight: 600;
  }
}
</style>
