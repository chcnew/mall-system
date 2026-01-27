<template>
  <el-upload
    v-model:file-list="fileList"
    :action="uploadUrl"
    :headers="headers"
    :list-type="listType"
    :limit="limit"
    :before-upload="beforeUpload"
    :on-success="handleSuccess"
    :on-exceed="handleExceed"
    :on-remove="handleRemove"
  >
    <el-button type="primary">
      <el-icon><Upload /></el-icon>
      上传图片
    </el-button>
    <template #tip>
      <div class="el-upload__tip">只能上传jpg/png文件，且不超过5MB</div>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { UploadUserFile } from 'element-plus'
import { ElMessage } from 'element-plus'

interface Props {
  modelValue: string[]
  limit?: number
  listType?: 'text' | 'picture' | 'picture-card'
}

const props = withDefaults(defineProps<Props>(), {
  limit: 5,
  listType: 'picture-card'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const uploadUrl = import.meta.env.VITE_API_URL + '/api/upload'
const headers = computed(() => ({
  Authorization: `Bearer ${localStorage.getItem('admin_token')}`
}))

const fileList = ref<UploadUserFile[]>(props.modelValue.map(url => ({ name: url, url })))

const beforeUpload = (file: File) => {
  const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传 JPG/PNG/GIF 格式的图片!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    return false
  }
  return true
}

const handleSuccess = (response: any) => {
  if (response.code === 0) {
    ElMessage.success('上传成功')
    const urls = fileList.value.map(item => item.url || '').filter(Boolean)
    emit('update:modelValue', urls)
  }
}

const handleExceed = () => {
  ElMessage.warning(`最多只能上传 ${props.limit} 张图片`)
}

const handleRemove = () => {
  const urls = fileList.value.map(item => item.url || '').filter(Boolean)
  emit('update:modelValue', urls)
}
</script>
