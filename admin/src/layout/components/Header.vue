<template>
  <div class="header">
    <div class="hamburger" @click="toggleSidebar">
      <el-icon :size="20"><Fold /></el-icon>
    </div>
    <div class="right-menu">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <el-avatar :size="32" :src="userStore.user?.avatar">
            {{ userStore.user?.nickname?.charAt(0) || 'A' }}
          </el-avatar>
          <span class="username">{{ userStore.user?.nickname || '管理员' }}</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人中心</el-dropdown-item>
            <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore, useAppStore } from '@/store'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const appStore = useAppStore()
const router = useRouter()

const toggleSidebar = () => {
  appStore.toggleSidebar()
}

const handleCommand = (command: string) => {
  if (command === 'logout') {
    userStore.logout()
    router.push('/login')
  } else if (command === 'profile') {
    router.push('/profile')
  }
}
</script>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;

  .hamburger {
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .right-menu {
    display: flex;
    align-items: center;

    .el-dropdown-link {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;

      .username {
        font-size: 14px;
        color: #606266;
      }
    }
  }
}
</style>
