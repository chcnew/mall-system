<template>
  <div class="app-layout">
    <div class="sidebar-container">
      <Sidebar />
    </div>
    <div class="main-container">
      <div class="fixed-header">
        <Header />
      </div>
      <div class="app-main">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
</script>

<style scoped lang="scss">
.app-layout {
  display: flex;
  width: 100%;
  height: 100%;

  .sidebar-container {
    width: 220px;
    height: 100%;
    background-color: #304156;
    transition: width 0.3s;
  }

  .main-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: #f0f2f5;

    .fixed-header {
      height: 60px;
      background-color: #fff;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    }

    .app-main {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
    }
  }
}
</style>
