import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

export function useForm(defaultValues: any = {}) {
  const formRef = ref()
  const formData = reactive({ ...defaultValues })
  const loading = ref(false)

  const resetForm = () => {
    if (formRef.value) {
      formRef.value.resetFields()
    }
    Object.assign(formData, defaultValues)
  }

  const validateForm = async () => {
    if (!formRef.value) return false
    const valid = await formRef.value.validate().catch(() => false)
    return valid
  }

  const setFormData = (data: any) => {
    Object.assign(formData, data)
  }

  return {
    formRef,
    formData,
    loading,
    resetForm,
    validateForm,
    setFormData
  }
}
