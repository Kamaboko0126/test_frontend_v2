import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import type { 
  ApiResponse, 
  User, 
  UserListResponse, 
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  DeleteUserRequest,
  DeleteUserResponse,
  ApiError 
} from '~/types/api'

class ApiService {
  private api: AxiosInstance
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.api = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // 請求攔截器
    this.api.interceptors.request.use(
      (config) => {
        // 可以在這裡添加認證 token 等
        console.log('API Request:', config.method?.toUpperCase(), config.url)
        return config
      },
      (error) => {
        console.error('API Request Error:', error)
        return Promise.reject(error)
      }
    )

    // 響應攔截器
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log('API Response:', response.status, response.data)
        return response
      },
      (error) => {
        console.error('API Response Error:', error.response?.data || error.message)
        
        // 處理不同的錯誤狀態
        if (error.response) {
          const apiError: ApiError = {
            code: error.response.status,
            message: error.response.data?.message || error.message,
            data: error.response.data
          }
          return Promise.reject(apiError)
        }
        
        return Promise.reject({
          code: 0,
          message: error.message || '網路連線錯誤'
        } as ApiError)
      }
    )
  }

  // 取得所有用戶資料
  async getUsers(): Promise<User[]> {
    try {
      const response = await this.api.get<UserListResponse>('/api/user')
      
      if (response.data.code === 200) {
        return response.data.data
      } else {
        throw new Error(response.data.message || '取得資料失敗')
      }
    } catch (error) {
      console.error('取得用戶資料失敗:', error)
      throw error
    }
  }

  // 新增用戶
  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const response = await this.api.post<CreateUserResponse>('/api/user', userData)
      
      // 檢查回應代碼 (根據實際 API 回應，成功時 code 為 200)
      if (response.data.code === 200) {
        // 由於 API 只返回新建用戶的 ID，我們需要建構完整的 User 對象
        const newUser: User = {
          id: response.data.data.id,
          name: userData.name,
          age: userData.age
        }
        return newUser
      } else {
        throw new Error(response.data.message || '新增資料失敗')
      }
    } catch (error: any) {
      console.error('新增用戶失敗:', error)
      
      // 處理不同的錯誤情況
      if (error.response) {
        const apiError: ApiError = {
          code: error.response.status,
          message: error.response.data?.message || '新增用戶失敗',
          data: error.response.data
        }
        throw apiError
      }
      
      throw {
        code: 0,
        message: error.message || '新增用戶時發生網路錯誤'
      } as ApiError
    }
  }

  // 更新用戶
  async updateUser(id: number, userData: Partial<Omit<User, 'id'>>): Promise<User> {
    try {
      // 根據您提供的 curl 命令，請求格式需要包含 id、age 和 name
      const updateRequest: UpdateUserRequest = {
        id: id,
        age: userData.age!,
        name: userData.name!
      }
      
      const response = await this.api.put<UpdateUserResponse>('/api/user', updateRequest)
      
      if (response.data.code === 200) {
        console.log('更新成功:', response.data.message)
        // 由於 API 不返回完整的用戶資料，我們構建更新後的用戶對象
        const updatedUser: User = {
          id: id,
          name: userData.name!,
          age: userData.age!
        }
        return updatedUser
      } else {
        throw new Error(response.data.message || '更新資料失敗')
      }
    } catch (error: any) {
      console.error('更新用戶失敗:', error)
      
      // 處理不同的錯誤情況
      if (error.response) {
        const apiError: ApiError = {
          code: error.response.status,
          message: error.response.data?.message || '更新用戶失敗',
          data: error.response.data
        }
        throw apiError
      }
      
      throw {
        code: 0,
        message: error.message || '更新用戶時發生網路錯誤'
      } as ApiError
    }
  }

  // 刪除用戶
  async deleteUser(id: number): Promise<boolean> {
    try {
      const deleteRequest: DeleteUserRequest = { id }
      
      // 使用 DELETE 方法發送到 /api/user 端點
      const response = await this.api.delete<DeleteUserResponse>('/api/user', {
        data: deleteRequest // DELETE 請求的 body 需要放在 data 屬性中
      })
      
      // 根據實際 API 回應，成功時 code 為 200
      if (response.data.code === 200) {
        console.log('刪除成功:', response.data.message)
        return true
      } else {
        throw new Error(response.data.message || '刪除資料失敗')
      }
    } catch (error: any) {
      console.error('刪除用戶失敗:', error)
      
      // 處理不同的錯誤情況
      if (error.response) {
        const apiError: ApiError = {
          code: error.response.status,
          message: error.response.data?.message || '刪除用戶失敗',
          data: error.response.data
        }
        throw apiError
      }
      
      throw {
        code: 0,
        message: error.message || '刪除用戶時發生網路錯誤'
      } as ApiError
    }
  }
}

// 創建 API 服務實例
export const apiService = new ApiService('https://60981.wu.elitepro.ltd')

// 導出常用方法
export const userApi = {
  getUsers: () => apiService.getUsers(),
  createUser: (userData: CreateUserRequest) => apiService.createUser(userData),
  updateUser: (id: number, userData: Partial<Omit<User, 'id'>>) => apiService.updateUser(id, userData),
  deleteUser: (id: number) => apiService.deleteUser(id),
}