<template>
  <div class="product-list">
    <el-card>
      <el-form :model="searchForm" inline>
        <el-form-item label="商品名称">
          <el-input v-model="searchForm.keyword" placeholder="请输入商品名称" clearable />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.category_id" placeholder="请选择分类" clearable>
            <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="上架" :value="1" />
            <el-option label="下架" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleAdd">添加商品</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-table :data="tableData" v-loading="loading" border stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="商品名称" min-width="150" />
        <el-table-column label="封面图" width="100">
          <template #default="{ row }">
            <el-image :src="row.cover" style="width: 60px; height: 60px" :preview-src-list="[row.cover]" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="100">
          <template #default="{ row }">
            ¥{{ row.price.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="80" />
        <el-table-column prop="sales" label="销量" width="80" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="标签" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.is_hot" type="danger" size="small">热门</el-tag>
            <el-tag v-if="row.is_new" type="success" size="small">新品</el-tag>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useTable } from '@/composables/useTable'
import { getProductList, deleteProduct as deleteProductApi } from '@/api/product'
import { getCategoryList } from '@/api/product'

const router = useRouter()
const searchForm = ref({
  keyword: '',
  category_id: undefined,
  status: undefined
})

const categories = ref<any[]>([])

const { tableData, loading, pagination, loadData, handlePageChange, handleSizeChange } = useTable(getProductList)

const handleSearch = () => {
  Object.assign(pagination, { page: 1 })
  loadData()
}

const handleReset = () => {
  searchForm.value = {
    keyword: '',
    category_id: undefined,
    status: undefined
  }
  handleSearch()
}

const handleAdd = () => {
  router.push('/product/edit')
}

const handleEdit = (row: any) => {
  router.push(`/product/edit/${row.id}`)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该商品吗？', '提示', { type: 'warning' })
    .then(async () => {
      await deleteProductApi(row.id)
      ElMessage.success('删除成功')
      loadData()
    })
    .catch(() => {})
}

const loadCategories = async () => {
  try {
    categories.value = await getCategoryList()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped lang="scss">
.product-list {
  .el-form {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
