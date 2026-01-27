<template>
  <div class="product-edit">
    <el-card>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品副标题">
          <el-input v-model="formData.subtitle" placeholder="请输入商品副标题" />
        </el-form-item>
        <el-form-item label="商品分类" prop="category_id">
          <el-select v-model="formData.category_id" placeholder="请选择商品分类">
            <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input-number v-model="formData.price" :min="0" :precision="2" :step="0.01" />
        </el-form-item>
        <el-form-item label="商品原价">
          <el-input-number v-model="formData.original_price" :min="0" :precision="2" :step="0.01" />
        </el-form-item>
        <el-form-item label="商品库存" prop="stock">
          <el-input-number v-model="formData.stock" :min="0" />
        </el-form-item>
        <el-form-item label="商品图片">
          <UploadImage v-model="formData.images" :limit="5" />
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input v-model="formData.description" type="textarea" :rows="5" placeholder="请输入商品描述" />
        </el-form-item>
        <el-form-item label="商品标签">
          <el-checkbox v-model="formData.is_hot">热门商品</el-checkbox>
          <el-checkbox v-model="formData.is_new">新品推荐</el-checkbox>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" active-text="上架" inactive-text="下架" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="formData.sort" :min="0" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSave">保存</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createProduct, updateProduct, getProductDetail } from '@/api/product'
import { getCategoryList } from '@/api/product'
import UploadImage from '@/components/UploadImage.vue'

const router = useRouter()
const route = useRoute()
const formRef = ref()
const loading = ref(false)
const categories = ref<any[]>([])

const formData = reactive({
  name: '',
  subtitle: '',
  category_id: undefined,
  price: 0,
  original_price: 0,
  stock: 0,
  images: [],
  description: '',
  is_hot: 0,
  is_new: 0,
  status: 1,
  sort: 0
})

const rules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  category_id: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入商品库存', trigger: 'blur' }]
}

const handleSave = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    if (formData.images.length > 0) {
      formData.cover = formData.images[0]
    }

    if (route.params.id) {
      await updateProduct(Number(route.params.id), formData)
      ElMessage.success('更新成功')
    } else {
      await createProduct(formData)
      ElMessage.success('创建成功')
    }
    router.push('/product')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.back()
}

const loadDetail = async () => {
  if (route.params.id) {
    try {
      const data = await getProductDetail(Number(route.params.id))
      Object.assign(formData, data)
    } catch (error) {
      ElMessage.error('加载商品详情失败')
    }
  }
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
  loadDetail()
})
</script>

<style scoped lang="scss">
.product-edit {
  :deep(.el-form-item__content) {
    width: 600px;
  }
}
</style>
