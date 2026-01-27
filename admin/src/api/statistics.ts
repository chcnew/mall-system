import request from '@/utils/request'
import type { ApiResponse } from '@/utils/types'

export interface StatisticsOverview {
  today_orders: number
  today_sales: number
  new_users: number
  product_views: number
}

export interface SalesData {
  date: string
  amount: number
  orders: number
}

export interface StatisticsData {
  overview: StatisticsOverview
  sales_trend: SalesData[]
  top_products: any[]
}

export const getOverview = () => {
  return request.get<ApiResponse<StatisticsOverview>>('/admin/statistics/overview')
}

export const getSalesTrend = (days: number = 7) => {
  return request.get<ApiResponse<SalesData[]>>('/admin/statistics/sales', { params: { days } })
}

export const getTopProducts = (limit: number = 10) => {
  return request.get<ApiResponse<any[]>>('/admin/statistics/top-products', { params: { limit } })
}
