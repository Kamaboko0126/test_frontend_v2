import { ref, computed, readonly } from 'vue'
import { defineStore } from 'pinia'
import { userApi } from '~/api/userService'
import type { User } from '~/types/api'

export const useUserStore = defineStore('user', () => {
  // State
  const dataList = ref<User[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // 編輯狀態
  const editingUserId = ref<number | null>(null)
  
  // Getters
  const userCount = computed(() => dataList.value.length)
  const isEditing = computed(() => editingUserId.value !== null)
  const currentEditingUser = computed(() => 
    dataList.value.find(user => user.id === editingUserId.value) || null
  )
  
  // Actions
  const loadUsers = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const users = await userApi.getUsers()
      dataList.value = users
      
      console.log('成功載入用戶資料:', users)
    } catch (err: any) {
      error.value = err.message || '載入資料失敗'
      console.error('載入用戶資料失敗:', err)
      
      // 清空資料列表，只顯示錯誤信息
      dataList.value = []
    } finally {
      isLoading.value = false
    }
  }
  
  const createUser = async (userData: { name: string; age: number }) => {
    try {
      isLoading.value = true
      
      // 使用符合 API 規格的請求格式
      const createUserRequest = {
        age: userData.age,
        name: userData.name
      }
      
      // 嘗試調用後端 API 新增
      const newUser = await userApi.createUser(createUserRequest)
      dataList.value.push(newUser)
      console.log('API 新增成功:', newUser)
      
      return { success: true, user: newUser }
    } catch (err: any) {
      console.error('API 新增失敗，使用本地新增:', err)
      
      // 如果 API 失敗，進行本地新增
      const newUser: User = {
        id: Math.max(...dataList.value.map(u => u.id), 0) + 1,
        name: userData.name,
        age: userData.age,
      }
      
      dataList.value.push(newUser)
      console.log('本地新增成功:', newUser)
      
      return { success: true, user: newUser, isLocal: true, error: err.message || '' }
    } finally {
      isLoading.value = false
    }
  }
  
  const updateUser = async (userId: number, userData: { name: string; age: number }) => {
    try {
      isLoading.value = true
      
      // 嘗試調用後端 API 更新
      const updatedUser = await userApi.updateUser(userId, {
        name: userData.name,
        age: userData.age,
      })
      
      // 根據 userId 更新本地資料
      const userIndex = dataList.value.findIndex(user => user.id === userId)
      if (userIndex !== -1) {
        dataList.value[userIndex] = updatedUser
      }
      
      return { success: true, user: updatedUser }
    } catch (err: any) {
      console.error('API 修改失敗，使用本地更新:', err)
      
      // 如果 API 失敗，根據 userId 進行本地更新
      const userIndex = dataList.value.findIndex(user => user.id === userId)
      if (userIndex !== -1) {
        dataList.value[userIndex] = {
          ...dataList.value[userIndex],
          name: userData.name,
          age: userData.age,
        }
      }
      
      return { success: true, user: dataList.value[userIndex], isLocal: true, error: err.message || '' }
    } finally {
      isLoading.value = false
    }
  }
  
  const deleteUser = async (userId: number) => {
    try {
      isLoading.value = true
      
      // 嘗試調用後端 API 刪除
      await userApi.deleteUser(userId)
      
      // 從本地資料中移除
      const userIndex = dataList.value.findIndex(user => user.id === userId)
      if (userIndex !== -1) {
        dataList.value.splice(userIndex, 1)
      }
      
      // 如果刪除的是正在編輯的項目，清除編輯狀態
      if (editingUserId.value === userId) {
        clearEditingState()
      }
      
      return { success: true }
    } catch (err: any) {
      console.error('API 刪除失敗，使用本地刪除:', err)
      
      // 如果 API 失敗，進行本地刪除
      const userIndex = dataList.value.findIndex(user => user.id === userId)
      if (userIndex !== -1) {
        dataList.value.splice(userIndex, 1)
      }
      
      // 如果刪除的是正在編輯的項目，清除編輯狀態
      if (editingUserId.value === userId) {
        clearEditingState()
      }
      
      return { success: true, isLocal: true, error: err.message || '' }
    } finally {
      isLoading.value = false
    }
  }
  
  // 編輯狀態管理
  const setEditingUser = (userId: number | null) => {
    editingUserId.value = userId
  }
  
  const clearEditingState = () => {
    editingUserId.value = null
  }
  
  // 根據 ID 獲取用戶
  const getUserById = (userId: number): User | undefined => {
    return dataList.value.find(user => user.id === userId)
  }
  
  return {
    // State
    dataList: readonly(dataList),
    isLoading: readonly(isLoading),
    error: readonly(error),
    editingUserId: readonly(editingUserId),
    
    // Getters
    userCount,
    isEditing,
    currentEditingUser,
    
    // Actions
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    setEditingUser,
    clearEditingState,
    getUserById,
  }
})