import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

export function useTable<T>(apiFunction: Function) {
  const tableData = ref<T[]>([])
  const loading = ref(false)
  const pagination = reactive({
    page: 1,
    size: 20,
    total: 0
  })
  const queryParams = reactive<any>({})

  const loadData = async () => {
    loading.value = true
    try {
      const data = await apiFunction({
        ...queryParams,
        page: pagination.page,
        size: pagination.size
      })
      tableData.value = data.items
      pagination.total = data.total
    } catch (error) {
      ElMessage.error('加载数据失败')
    } finally {
      loading.value = false
    }
  }

  const handlePageChange = (page: number) => {
    pagination.page = page
    loadData()
  }

  const handleSizeChange = (size: number) => {
    pagination.size = size
    pagination.page = 1
    loadData()
  }

  const handleSearch = (params: any) => {
    Object.assign(queryParams, params)
    pagination.page = 1
    loadData()
  }

  const handleReset = () => {
    Object.keys(queryParams).forEach(key => {
      delete queryParams[key]
    })
    pagination.page = 1
    loadData()
  }

  onMounted(() => {
    loadData()
  })

  return {
    tableData,
    loading,
    pagination,
    queryParams,
    loadData,
    handlePageChange,
    handleSizeChange,
    handleSearch,
    handleReset
  }
}
