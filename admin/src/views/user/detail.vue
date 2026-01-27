<template>
  <div class="user-detail">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户详情</span>
          <el-button @click="router.back()">返回</el-button>
        </div>
      </template>

      <el-descriptions v-if="userData" :column="2" border>
        <el-descriptions-item label="用户ID">{{ userData.id }}</el-descriptions-item>
        <el-descriptions-item label="昵称">{{ userData.nickname || '-' }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ userData.phone || '-' }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ getGenderText(userData.gender) }}</el-descriptions-item>
        <el-descriptions-item label="余额">¥{{ userData.balance.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="积分">{{ userData.points }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="userData.status === 1 ? 'success' : 'info'">
            {{ userData.status === 1 ? '正常' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="注册时间">{{ userData.created_at }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getUserDetail } from '@/api/user'

const router = useRouter()
const route = useRoute()

const userData = ref<any>(null)

const loadDetail = async () => {
  try {
    userData.value = await getUserDetail(Number(route.params.id))
  } catch (error) {
    ElMessage.error('加载用户详情失败')
  }
}

const getGenderText = (gender: number) => {
  const texts: Record<number, string> = {
    0: '未知',
    1: '男',
    2: '女'
  }
  return texts[gender] || '未知'
}

onMounted(() => {
  loadDetail()
})
</script>

<style scoped lang="scss">
.user-detail {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
