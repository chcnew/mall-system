import request from '@/utils/request'
import type { ApiResponse, PageResult } from '@/utils/types'

export interface Order {
  id: number
  order_no: string
  user_id: number
  user_nickname?: string
  user_avatar?: string
  total_amount: number
  pay_amount: number
  freight_amount: number
  discount_amount: number
  status: number
  pay_time?: string
  ship_time?: string
  receive_time?: string
  address_snapshot: any
  remark?: string
  created_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  product_name: string
  product_image: string
  specs?: string
  price: number
  quantity: number
}

export interface OrderParams {
  page?: number
  size?: number
  status?: number
  keyword?: string
  start_time?: string
  end_time?: string
}

export const getOrderList = (params: OrderParams) => {
  return request.get<ApiResponse<PageResult<Order>>>('/admin/orders', { params })
}

export const getOrderDetail = (id: number) => {
  return request.get<ApiResponse<Order>>(`/admin/orders/${id}`)
}

export const shipOrder = (id: number, data: { company: string; tracking_no: string }) => {
  return request.post<ApiResponse>(`/admin/orders/${id}/ship`, data)
}

export const refundOrder = (id: number, data: { reason: string }) => {
  return request.post<ApiResponse>(`/admin/orders/${id}/refund`, data)
}
