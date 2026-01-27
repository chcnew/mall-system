import request from '@/utils/request'
import type { ApiResponse, PageResult } from '@/utils/types'

export interface Product {
  id: number
  category_id: number
  name: string
  subtitle?: string
  cover: string
  images: string[]
  description?: string
  price: number
  original_price?: number
  stock: number
  sales: number
  status: number
  is_hot: number
  is_new: number
  sort: number
  created_at: string
}

export interface Category {
  id: number
  parent_id: number
  name: string
  icon?: string
  sort: number
  status: number
  children?: Category[]
}

export interface ProductParams {
  page?: number
  size?: number
  category_id?: number
  status?: number
  keyword?: string
}

export const getProductList = (params: ProductParams) => {
  return request.get<ApiResponse<PageResult<Product>>>('/admin/products', { params })
}

export const getProductDetail = (id: number) => {
  return request.get<ApiResponse<Product>>(`/admin/products/${id}`)
}

export const createProduct = (data: Partial<Product>) => {
  return request.post<ApiResponse<Product>>('/admin/products', data)
}

export const updateProduct = (id: number, data: Partial<Product>) => {
  return request.put<ApiResponse<Product>>(`/admin/products/${id}`, data)
}

export const deleteProduct = (id: number) => {
  return request.delete<ApiResponse>(`/admin/products/${id}`)
}

export const getCategoryList = () => {
  return request.get<ApiResponse<Category[]>>('/admin/categories')
}

export const createCategory = (data: Partial<Category>) => {
  return request.post<ApiResponse<Category>>('/admin/categories', data)
}

export const updateCategory = (id: number, data: Partial<Category>) => {
  return request.put<ApiResponse<Category>>(`/admin/categories/${id}`, data)
}

export const deleteCategory = (id: number) => {
  return request.delete<ApiResponse>(`/admin/categories/${id}`)
}
