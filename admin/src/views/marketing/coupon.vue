<template>
  <div class="coupon-list">
    <el-card>
      <el-form :model="searchForm" inline>
        <el-form-item label="类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
            <el-option label="满减券" :value="1" />
            <el-option label="折扣券" :value="2" />
            <el-option label="无门槛券" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleAdd">添加优惠券</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-table :data="tableData" v-loading="loading" border stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="优惠券名称" min-width="150" />
        <el-table-column label="类型" width="100">
          <template #default="{ row }">
            <el-tag>{{ getTypeText(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="优惠值" width="120">
          <template #default="{ row }">
            {{ row.type === 2 ? `${row.value * 10}折` : `¥${row.value}` }}
          </template>
        </el-table-column>
        <el-table-column prop="min_amount" label="最低消费" width="100">
          <template #default="{ row }">
            {{ row.min_amount > 0 ? `¥${row.min_amount}` : '无门槛' }}
          </template>
        </el-table-column>
        <el-table-column prop="total_count" label="发放总量" width="100" />
        <el-table-column prop="remain_count" label="剩余数量" width="100" />
        <el-table-column prop="per_limit" label="每人限领" width="100" />
        <el-table-column label="有效期" width="300">
          <template #default="{ row }">
            {{ row.start_time }} ~ {{ row.end_time }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.size"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; justify-content: flex-end"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useTable } from '@/composables/useTable'
import { getCouponList, deleteCoupon } from '@/api/coupon'

const searchForm = reactive({
  type: undefined,
  status: undefined
})

const { tableData, loading, pagination, loadData, handlePageChange, handleSizeChange } = useTable(getCouponList)

const handleSearch = () => {
  Object.assign(pagination, { page: 1 })
  loadData()
}

const handleReset = () => {
  searchForm.type = undefined
  searchForm.status = undefined
  handleSearch()
}

const handleAdd = () => {
  ElMessage.info('功能开发中')
}

const handleEdit = (row: any) => {
  ElMessage.info('功能开发中')
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该优惠券吗？', '提示', { type: 'warning' })
    .then(async () => {
      await deleteCoupon(row.id)
      ElMessage.success('删除成功')
      loadData()
    })
    .catch(() => {})
}

const getTypeText = (type: number) => {
  const texts: Record<number, string> = {
    1: '满减券',
    2: '折扣券',
    3: '无门槛券'
  }
  return texts[type] || '未知'
}
</script>

<style scoped lang="scss">
.coupon-list {
  .el-form {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
