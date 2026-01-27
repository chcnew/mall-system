<template>
  <div class="system-config">
    <el-card>
      <el-form :model="formData" label-width="150px" style="max-width: 600px">
        <el-form-item label="商城名称">
          <el-input v-model="formData.mall_name" placeholder="请输入商城名称" />
        </el-form-item>
        <el-form-item label="商城Logo">
          <el-input v-model="formData.mall_logo" placeholder="请输入商城Logo地址" />
        </el-form-item>
        <el-form-item label="客服电话">
          <el-input v-model="formData.service_phone" placeholder="请输入客服电话" />
        </el-form-item>
        <el-form-item label="运费设置">
          <el-input-number v-model="formData.freight_amount" :min="0" :precision="2" :step="1" />
          <span style="margin-left: 10px">元</span>
        </el-form-item>
        <el-form-item label="免运费金额">
          <el-input-number v-model="formData.free_freight_amount" :min="0" :precision="2" :step="1" />
          <span style="margin-left: 10px">元</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSave">保存配置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getConfigList, updateConfig } from '@/api/system'

const loading = ref(false)
const formData = reactive({
  mall_name: '',
  mall_logo: '',
  service_phone: '',
  freight_amount: 0,
  free_freight_amount: 0
})

const loadData = async () => {
  try {
    const configs = await getConfigList()
    configs.forEach((item: any) => {
      if (formData.hasOwnProperty(item.config_key)) {
        formData[item.config_key as keyof typeof formData] = item.config_value
      }
    })
  } catch (error) {
    ElMessage.error('加载系统配置失败')
  }
}

const handleSave = async () => {
  loading.value = true
  try {
    for (const [key, value] of Object.entries(formData)) {
      await updateConfig(key, String(value))
    }
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.system-config {
}
</style>
