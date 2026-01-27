<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item, index) in stats" :key="index">
        <el-card class="stat-card">
          <div class="stat-icon" :style="{ backgroundColor: item.color }">
            <el-icon :size="24" :color="item.iconColor">
              <component :is="item.icon" />
            </el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ item.value }}</div>
            <div class="stat-label">{{ item.label }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>销售趋势</span>
            </div>
          </template>
          <div ref="chartRef" style="width: 100%; height: 350px"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>商品销量排行</span>
            </div>
          </template>
          <div ref="topChartRef" style="width: 100%; height: 350px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { getOverview, getSalesTrend, getTopProducts } from '@/api/statistics'

const chartRef = ref()
const topChartRef = ref()

const stats = ref([
  { label: '今日订单', value: 0, icon: 'List', color: 'rgba(64, 158, 255, 0.1)', iconColor: '#409eff' },
  { label: '今日销售额', value: '¥0', icon: 'Money', color: 'rgba(103, 194, 58, 0.1)', iconColor: '#67c23a' },
  { label: '新增用户', value: 0, icon: 'User', color: 'rgba(230, 162, 60, 0.1)', iconColor: '#e6a23c' },
  { label: '商品浏览', value: 0, icon: 'View', color: 'rgba(245, 108, 108, 0.1)', iconColor: '#f56c6c' }
])

const loadData = async () => {
  try {
    const overview = await getOverview()
    stats.value[0].value = overview.today_orders
    stats.value[1].value = `¥${overview.today_sales.toFixed(2)}`
    stats.value[2].value = overview.new_users
    stats.value[3].value = overview.product_views
  } catch (error) {
    console.error(error)
  }
}

const initCharts = async () => {
  try {
    const salesData = await getSalesTrend(7)
    const topProducts = await getTopProducts(10)

    if (chartRef.value) {
      const chart = echarts.init(chartRef.value)
      chart.setOption({
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: salesData.map(item => item.date)
        },
        yAxis: { type: 'value' },
        series: [{
          name: '销售额',
          type: 'line',
          data: salesData.map(item => item.amount),
          smooth: true,
          areaStyle: { color: 'rgba(64, 158, 255, 0.1)' }
        }]
      })
    }

    if (topChartRef.value) {
      const topChart = echarts.init(topChartRef.value)
      topChart.setOption({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        xAxis: { type: 'value' },
        yAxis: {
          type: 'category',
          data: topProducts.map((item: any) => item.name).reverse()
        },
        series: [{
          type: 'bar',
          data: topProducts.map((item: any) => item.sales).reverse(),
          itemStyle: { color: '#409eff' }
        }]
      })
    }
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  loadData()
  initCharts()
})
</script>

<style scoped lang="scss">
.dashboard {
  .stat-card {
    display: flex;
    align-items: center;
    padding: 20px;

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-content {
      flex: 1;
      margin-left: 20px;

      .stat-value {
        font-size: 24px;
        font-weight: 500;
        color: #303133;
        margin-bottom: 8px;
      }

      .stat-label {
        font-size: 14px;
        color: #909399;
      }
    }
  }

  .chart-card {
    .card-header {
      font-size: 16px;
      font-weight: 500;
      color: #303133;
    }
  }
}
</style>
