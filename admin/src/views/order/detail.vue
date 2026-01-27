<template>
  <div class="order-detail">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>订单详情</span>
          <el-button @click="router.back()">返回</el-button>
        </div>
      </template>

      <el-descriptions v-if="orderData" :column="2" border>
        <el-descriptions-item label="订单ID">{{ orderData.id }}</el-descriptions-item>
        <el-descriptions-item label="订单号">{{ orderData.order_no }}</el-descriptions-item>
        <el-descriptions-item label="用户">{{ orderData.user_nickname }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="getStatusType(orderData.status)">
            {{ getStatusText(orderData.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="订单总额">¥{{ orderData.total_amount.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="实付金额">¥{{ orderData.pay_amount.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="运费">¥{{ orderData.freight_amount.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="优惠金额">¥{{ orderData.discount_amount.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="支付时间">{{ orderData.pay_time || '-' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ orderData.created_at }}</el-descriptions-item>
      </el-descriptions>

      <div v-if="orderData.address_snapshot" style="margin-top: 20px">
        <h3>收货地址</h3>
        <p>{{ orderData.address_snapshot.name }} {{ orderData.address_snapshot.phone }}</p>
        <p>{{ orderData.address_snapshot.province }} {{ orderData.address_snapshot.city }} {{ orderData.address_snapshot.district }} {{ orderData.address_snapshot.detail }}</p>
      </div>

      <div style="margin-top: 20px">
        <h3>商品信息</h3>
        <el-table :data="orderData.items" border stripe>
          <el-table-column prop="product_name" label="商品名称" />
          <el-table-column prop="specs" label="规格" />
          <el-table-column prop="price" label="单价" width="100">
            <template #default="{ row }">
              ¥{{ row.price.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="80" />
          <el-table-column label="小计" width="100">
            <template #default="{ row }">
              ¥{{ (row.price * row.quantity).toFixed(2) }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-if="orderData.remark" style="margin-top: 20px">
        <h3>订单备注</h3>
        <p>{{ orderData.remark }}</p>
      </div>

      <div v-if="orderData.status === 1" style="margin-top: 20px">
        <el-button type="primary" @click="showShipDialog = true">发货</el-button>
      </div>
    </el-card>

    <el-dialog v-model="showShipDialog" title="发货" width="500px">
      <el-form :model="shipForm" label-width="100px">
        <el-form-item label="物流公司">
          <el-input v-model="shipForm.company" placeholder="请输入物流公司" />
        </el-form-item>
        <el-form-item label="物流单号">
          <el-input v-model="shipForm.tracking_no" placeholder="请输入物流单号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showShipDialog = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleShip">确认发货</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getOrderDetail, shipOrder } from '@/api/order'

const router = useRouter()
const route = useRoute()

const orderData = ref<any>(null)
const showShipDialog = ref(false)
const loading = ref(false)
const shipForm = reactive({
  company: '',
  tracking_no: ''
})

const loadDetail = async () => {
  try {
    orderData.value = await getOrderDetail(Number(route.params.id))
  } catch (error) {
    ElMessage.error('加载订单详情失败')
  }
}

const handleShip = async () => {
  if (!shipForm.company || !shipForm.tracking_no) {
    ElMessage.warning('请填写物流信息')
    return
  }

  loading.value = true
  try {
    await shipOrder(Number(route.params.id), shipForm)
    ElMessage.success('发货成功')
    showShipDialog.value = false
    loadDetail()
  } catch (error) {
    ElMessage.error('发货失败')
  } finally {
    loading.value = false
  }
}

const getStatusType = (status: number) => {
  const types: Record<number, any> = {
    0: 'warning',
    1: 'warning',
    2: 'primary',
    3: 'success',
    4: 'info',
    5: 'danger'
  }
  return types[status] || 'info'
}

const getStatusText = (status: number) => {
  const texts: Record<number, string> = {
    0: '待付款',
    1: '待发货',
    2: '待收货',
    3: '已完成',
    4: '已取消',
    5: '已退款'
  }
  return texts[status] || '未知'
}

onMounted(() => {
  loadDetail()
})
</script>

<style scoped lang="scss">
.order-detail {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h3 {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
