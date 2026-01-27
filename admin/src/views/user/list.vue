<template>
  <div class="user-list">
    <el-card>
      <el-form :model="searchForm" inline>
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="请输入昵称或手机号" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-table :data="tableData" v-loading="loading" border stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="头像" width="100">
          <template #default="{ row }">
            <el-avatar :src="row.avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="balance" label="余额" width="100">
          <template #default="{ row }">
            ¥{{ row.balance.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="points" label="积分" width="80" />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="注册时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleDetail(row)">详情</el-button>
            <el-button v-if="row.status === 1" type="warning" size="small" @click="handleDisable(row)">禁用</el-button>
            <el-button v-else type="success" size="small" @click="handleEnable(row)">启用</el-button>
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
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useTable } from '@/composables/useTable'
import { getUserList, updateUserStatus } from '@/api/user'

const router = useRouter()
const searchForm = reactive({
  keyword: '',
  status: undefined
})

const { tableData, loading, pagination, loadData, handlePageChange, handleSizeChange } = useTable(getUserList)

const handleSearch = () => {
  Object.assign(pagination, { page: 1 })
  loadData()
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.status = undefined
  handleSearch()
}

const handleDetail = (row: any) => {
  router.push(`/user/detail/${row.id}`)
}

const handleDisable = (row: any) => {
  ElMessageBox.confirm('确认禁用该用户吗？', '提示', { type: 'warning' })
    .then(async () => {
      await updateUserStatus(row.id, 0)
      ElMessage.success('禁用成功')
      loadData()
    })
    .catch(() => {})
}

const handleEnable = (row: any) => {
  ElMessageBox.confirm('确认启用该用户吗？', '提示', { type: 'success' })
    .then(async () => {
      await updateUserStatus(row.id, 1)
      ElMessage.success('启用成功')
      loadData()
    })
    .catch(() => {})
}
</script>

<style scoped lang="scss">
.user-list {
  .el-form {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
