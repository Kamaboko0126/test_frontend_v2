// API 基本回應格式
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 用戶資料類型
export interface User {
  id: number
  name: string
  age: number
}

// 創建用戶請求類型
export interface CreateUserRequest {
  age: number
  name: string
}

// 創建用戶回應類型 (根據實際 API 回應格式)
export interface CreateUserResponseData {
  id: number
}

export type CreateUserResponse = ApiResponse<CreateUserResponseData>

// 刪除用戶請求類型
export interface DeleteUserRequest {
  id: number
}

// 刪除用戶回應類型 (根據實際 API 回應格式)
export interface DeleteUserResponse {
  code: number
  message: string
  // 注意：實際 API 回應沒有 data 欄位
}

// 更新用戶請求類型
export interface UpdateUserRequest {
  age: number
  id: number
  name: string
}

// 更新用戶回應類型 (根據實際 API 回應格式)
export interface UpdateUserResponse {
  code: number
  message: string
  // 注意：實際 API 回應沒有 data 欄位
}

// 用戶列表回應類型
export type UserListResponse = ApiResponse<User[]>

// API 錯誤類型
export interface ApiError {
  code: number
  message: string
  data?: any
}