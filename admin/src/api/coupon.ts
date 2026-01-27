import request from '@/utils/request'
import type { ApiResponse, PageResult } from '@/utils/types'

export interface CouponTemplate {
  id: number
  name: string
  type: number
  value: number
  min_amount: number
  total_count: number
  remain_count: number
  per_limit: number
  start_time?: string
  end_time?: string
  status: number
  created_at: string
}

export interface UserCoupon {
  id: number
  user_id: number
  user_nickname?: string
  coupon_id: number
  coupon_name: string
  status: number
  used_time?: string
  expire_time: string
}

export interface CouponParams {
  page?: number
  size?: number
  status?: number
  type?: number
}

export const getCouponList = (params: CouponParams) => {
  return request.get<ApiResponse<PageResult<CouponTemplate>>>('/admin/coupons', { params })
}

export const createCoupon = (data: Partial<CouponTemplate>) => {
  return request.post<ApiResponse<CouponTemplate>>('/admin/coupons', data)
}

export const updateCoupon = (id: number, data: Partial<CouponTemplate>) => {
  return request.put<ApiResponse<CouponTemplate>>(`/admin/coupons/${id}`, data)
}

export const deleteCoupon = (id: number) => {
  return request.delete<ApiResponse>(`/admin/coupons/${id}`)
}

export const getUserCouponList = (params: CouponParams) => {
  return request.get<ApiResponse<PageResult<UserCoupon>>>('/admin/user-coupons', { params })
}
