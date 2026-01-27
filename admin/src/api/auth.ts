import request from '@/utils/request'
import type { ApiResponse } from '@/utils/types'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  admin: {
    id: number
    username: string
    nickname: string
    avatar?: string
    role: string
  }
}

export interface AdminInfo {
  id: number
  username: string
  nickname: string
  avatar?: string
  role: string
  status: number
  last_login?: string
}

export const login = (data: LoginParams) => {
  return request.post<ApiResponse<LoginResult>>('/admin/login', data)
}

export const logout = () => {
  return request.post<ApiResponse>('/admin/logout')
}

export const getUserInfo = () => {
  return request.get<ApiResponse<AdminInfo>>('/admin/info')
}
