<template>
  <div class="sidebar">
    <div class="logo">
      <h2>商城后台</h2>
    </div>
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409eff"
      router
    >
      <template v-for="item in menus" :key="item.path">
        <el-menu-item v-if="!item.meta?.hidden" :index="item.path">
          <el-icon v-if="item.meta?.icon">
            <component :is="item.meta.icon" />
          </el-icon>
          <template #title>{{ item.meta?.title }}</template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store'

const route = useRoute()
const appStore = useAppStore()

const menus = [
  { path: '/dashboard', meta: { title: '控制台', icon: 'DataAnalysis' } },
  { path: '/product', meta: { title: '商品管理', icon: 'Goods' } },
  { path: '/category', meta: { title: '分类管理', icon: 'Menu' } },
  { path: '/order', meta: { title: '订单管理', icon: 'List' } },
  { path: '/user', meta: { title: '用户管理', icon: 'User' } },
  { path: '/coupon', meta: { title: '优惠券管理', icon: 'Ticket' } },
  { path: '/banner', meta: { title: '轮播图管理', icon: 'Picture' } },
  { path: '/config', meta: { title: '系统配置', icon: 'Setting' } }
]

const activeMenu = computed(() => route.path)
const isCollapse = computed(() => !appStore.sidebar.opened)
</script>

<style scoped lang="scss">
.sidebar {
  height: 100%;
  background-color: #304156;

  .logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #1f2d3d;

    h2 {
      color: #fff;
      font-size: 18px;
      font-weight: 500;
    }
  }

  .el-menu {
    border-right: none;
  }
}
</style>
