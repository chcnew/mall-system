import request from '@/utils/request'
import type { ApiResponse, PageResult } from '@/utils/types'

export interface Banner {
  id: number
  title?: string
  image: string
  link_type: number
  link_value?: string
  sort: number
  status: number
  created_at: string
}

export interface SystemConfig {
  config_key: string
  config_value: string
  remark?: string
}

export const getBannerList = () => {
  return request.get<ApiResponse<Banner[]>>('/admin/banners')
}

export const createBanner = (data: Partial<Banner>) => {
  return request.post<ApiResponse<Banner>>('/admin/banners', data)
}

export const updateBanner = (id: number, data: Partial<Banner>) => {
  return request.put<ApiResponse<Banner>>(`/admin/banners/${id}`, data)
}

export const deleteBanner = (id: number) => {
  return request.delete<ApiResponse>(`/admin/banners/${id}`)
}

export const getConfigList = () => {
  return request.get<ApiResponse<SystemConfig[]>>('/admin/configs')
}

export const updateConfig = (key: string, value: string) => {
  return request.put<ApiResponse>('/admin/configs', { config_key: key, config_value: value })
}
