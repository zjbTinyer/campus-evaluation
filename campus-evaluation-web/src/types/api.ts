/** 统一返回体 */
export interface UnifiedResponse<T = unknown> {
  code: number
  message: string
  data: T
}

/** 分页结果 */
export interface PageResult<T> {
  records: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
