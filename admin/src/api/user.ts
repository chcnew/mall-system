import request from '@/utils/request'
import type { ApiResponse, PageResult } from '@/utils/types'

export interface User {
  id: number
  openid: string
  nickname?: string
  avatar?: string
  phone?: string
  gender: number
  balance: number
  points: number
  status: number
  created_at: string
}

export interface UserParams {
  page?: number
  size?: number
  status?: number
  keyword?: string
}

export const getUserList = (params: UserParams) => {
  return request.get<ApiResponse<PageResult<User>>>('/admin/users', { params })
}

export const getUserDetail = (id: number) => {
  return request.get<ApiResponse<User>>(`/admin/users/${id}`)
}

export const updateUser = (id: number, data: Partial<User>) => {
  return request.put<ApiResponse<User>>(`/admin/users/${id}`, data)
}

export const updateUserStatus = (id: number, status: number) => {
  return request.put<ApiResponse>(`/admin/users/${id}/status`, { status })
}
