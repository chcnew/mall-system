<template>
  <div class="banner-list">
    <el-card>
      <el-button type="primary" @click="handleAdd">添加轮播图</el-button>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-table :data="tableData" v-loading="loading" border stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="150" />
        <el-table-column label="图片" width="150">
          <template #default="{ row }">
            <el-image :src="row.image" style="width: 120px; height: 60px" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column label="链接类型" width="100">
          <template #default="{ row }">
            <el-tag>{{ getLinkTypeText(row.link_type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="link_value" label="链接值" min-width="150" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getBannerList, deleteBanner } from '@/api/system'

const tableData = ref<any[]>([])
const loading = ref(false)

const loadData = async () => {
  loading.value = true
  try {
    tableData.value = await getBannerList()
  } catch (error) {
    ElMessage.error('加载轮播图列表失败')
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  ElMessage.info('功能开发中')
}

const handleEdit = (row: any) => {
  ElMessage.info('功能开发中')
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该轮播图吗？', '提示', { type: 'warning' })
    .then(async () => {
      await deleteBanner(row.id)
      ElMessage.success('删除成功')
      loadData()
    })
    .catch(() => {})
}

const getLinkTypeText = (type: number) => {
  const texts: Record<number, string> = {
    1: '商品',
    2: '分类',
    3: '页面',
    4: '外链'
  }
  return texts[type] || '未知'
}

loadData()
</script>

<style scoped lang="scss">
.banner-list {
}
</style>
