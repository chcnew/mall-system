export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface PageInfo {
  page: number
  size: number
  total: number
}

export interface PageResult<T> {
  items: T[]
  total: number
  page: number
  size: number
}
