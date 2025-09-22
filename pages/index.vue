<template>
  <div class="home-page">
    <div class="container">
      <div class="form-section" :class="{ 'editing-mode': userStore?.isEditing }">
        <h1 class="page-title">{{ $t('operation') }}</h1>

        <!-- 修改模式 -->
        <div v-if="userStore?.isEditing" class="edit-mode-notice">
          <span>📝 {{ locale === 'zh-TW' ? '修改模式：正在修改用戶資料' : 'Editing Mode: Editing user data' }}</span>
        </div>

        <!-- 錯誤 -->
        <div v-if="userStore?.error" class="error-message">
          {{ userStore.error }}
        </div>

        <!-- 載入狀態 -->
        <div v-if="userStore?.isLoading" class="loading-message">{{ $t('loading') }}</div>

        <div class="form-group">
          <ETextField
            v-model:value="formData.name"
            :label="$t('name')"
            :placeholder="locale === 'zh-TW' ? '請輸入姓名' : 'Enter name'"
            id="name-input"
            validateType="name"
            @enter="handleEnterSubmit"
          />
        </div>

        <div class="form-group">
          <ETextField
            v-model:value="formData.age"
            :label="$t('age')"
            :placeholder="locale === 'zh-TW' ? '請輸入年齡' : 'Enter age'"
            type="number"
            id="age-input"
            validateType="age"
            @enter="handleEnterSubmit"
          />
        </div>

        <!-- 按鈕 -->
        <div class="button-group">
          <!-- 修改按鈕-修改模式顯示 -->
          <EBtn
            v-if="userStore?.isEditing"
            color="success"
            :text="$t('modify')"
            @click="handleModify"
            :disabled="userStore?.isLoading || false"
          />
          <!-- 新增按鈕-非修改模式顯示 -->
          <EBtn
            v-if="!userStore?.isEditing"
            color="warn"
            :text="$t('add')"
            @click="handleAdd"
            :disabled="userStore?.isLoading || false"
          />
          <!-- 取消按鈕-修改模式顯示 -->
          <EBtn
            v-if="userStore?.isEditing"
            color="error"
            :text="$t('cancel')"
            @click="handleCancel"
            :disabled="userStore?.isLoading || false"
          />
        </div>
      </div>

      <!-- 用戶資料 -->
      <div class="table-section">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{{ $t('name') }}</th>
              <th>{{ $t('age') }}</th>
              <th>{{ $t('operation') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in userStore?.dataList || []" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.age }}</td>
              <td>
                <div class="action-buttons">
                  <EBtn
                    color="success"
                    :text="$t('modify')"
                    @click="editItem(item)"
                    :disabled="userStore?.isLoading || false"
                  />
                  <EBtn
                    color="error"
                    :text="$t('delete')"
                    @click="deleteItem(item.id)"
                    :disabled="userStore?.isLoading || false"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 無資料 -->
        <div v-if="!userStore?.isLoading && userStore?.dataList?.length === 0" class="no-data">
          {{ $t('noData') }}
        </div>
      </div>
    </div>

    <!-- 確認對話框 -->
    <ConfirmDialog
      ref="confirmDialogRef"
      :title="dialogConfig.title"
      :message="dialogConfig.message"
      :confirm-text="dialogConfig.confirmText"
      :cancel-text="dialogConfig.cancelText"
      @confirm="dialogConfig.onConfirm"
      @cancel="dialogConfig.onCancel"
    />

    <!-- 語言切換按鈕 -->
    <LanguageSwitcher />

    <!-- 訊息對話框 -->
    <MessageDialog
      ref="messageDialogRef"
      :title="messageConfig.title"
      :message="messageConfig.message"
      :type="messageConfig.type"
      :confirm-text="messageConfig.confirmText"
      @confirm="messageConfig.onConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue'
import type { User } from '~/types/api'
import { useUserStore } from '~/store/user'

const { locale } = useI18n()

const baseUrl = 'https://60981.wu.elitepro.ltd' // 後端網址 將由面試官提供

// 使用 i18n
const { t } = useI18n()

// 使用 Pinia store
const userStore = useUserStore()

// 對話框
const confirmDialogRef = ref()
const messageDialogRef = ref()

// 對話框配置
const dialogConfig = reactive({
  title: t('confirm'),
  message: '',
  confirmText: t('confirm'),
  cancelText: t('cancel'),
  onConfirm: () => {},
  onCancel: () => {},
})

// 對話框配置
const messageConfig = reactive({
  title: t('info'),
  message: '',
  type: 'info' as 'success' | 'error' | 'warning' | 'info',
  confirmText: t('confirm'),
  onConfirm: () => {},
})

// 表單資料
const formData = reactive({
  name: '',
  age: '',
})

// 通用確認對話框
const showConfirmDialog = (
  title: string,
  message: string,
  confirmText = t('confirm'),
  cancelText = t('cancel')
): Promise<boolean> => {
  return new Promise((resolve) => {
    dialogConfig.title = title
    dialogConfig.message = message
    dialogConfig.confirmText = confirmText
    dialogConfig.cancelText = cancelText
    dialogConfig.onConfirm = () => resolve(true)
    dialogConfig.onCancel = () => resolve(false)

    confirmDialogRef.value?.show()
  })
}

// 通用對話框函數
const showMessageDialog = (
  title: string,
  message: string,
  type: 'success' | 'error' | 'warning' | 'info' = 'info'
): Promise<void> => {
  return new Promise((resolve) => {
    messageConfig.title = title
    messageConfig.message = message
    messageConfig.type = type
    messageConfig.confirmText = t('confirm')
    messageConfig.onConfirm = () => resolve()

    messageDialogRef.value?.show()
  })
}

// Enter 鍵提交處理
const handleEnterSubmit = async () => {
  console.log('handleEnterSubmit 被調用')
  // alert('handleEnterSubmit 被調用了！')
  console.log('userStore:', userStore)
  console.log('formData:', formData)
  
  if (!userStore) return

  // 檢查表單是否填寫完整
  if (!formData.name || !formData.age) {
    console.log('表單未填寫完整')
    await showMessageDialog(t('error'), t('fillAllFields'), 'error')
    return
  }

  console.log('表單已填寫完整，準備顯示確認對話框')

  // 根據是否在編輯模式決定顯示對應的確認對話框
  if (userStore.isEditing) {
    // 顯示修改確認對話框
    const confirmModify = await showConfirmDialog(
      t('confirmModify'),
      `${t('modifyUser')}\n\n${t('userInfo')}:\n${t('name')}: ${formData.name}\n${t('age')}: ${formData.age}`,
      t('confirm'),
      t('cancel')
    )

    if (confirmModify) {
      // 如果用戶確認，才執行修改
      const result = await userStore.updateUser(userStore.editingUserId!, {
        name: formData.name,
        age: parseInt(formData.age),
      })

      if (result.success) {
        await showMessageDialog(t('success'), t('modifySuccess'), 'success')
        clearForm()
        userStore.exitEditMode()
      } else {
        await showMessageDialog(t('error'), result.error, 'error')
      }
    }
  } else {
    // 顯示新增確認對話框
    const confirmAdd = await showConfirmDialog(
      t('confirmAdd'),
      `${t('addUser')}\n\n${t('userInfo')}:\n${t('name')}: ${formData.name}\n${t('age')}: ${formData.age}`,
      t('confirm'),
      t('cancel')
    )

    if (confirmAdd) {
      // 如果用戶確認，才執行新增
      const result = await userStore.createUser({
        name: formData.name,
        age: parseInt(formData.age),
      })

      if (result.success) {
        await showMessageDialog(t('success'), t('addSuccess'), 'success')
        clearForm()
      } else {
        await showMessageDialog(t('error'), result.error, 'error')
      }
    }
  }
}

// 修改功能
const handleModify = async () => {
  if (!userStore) return

  if (!formData.name || !formData.age) {
    await showMessageDialog(t('error'), t('fillAllFields'), 'error')
    return
  }

  // 獲取正在修改的用戶資料以顯示在確認對話框中
  const currentUser = userStore.currentEditingUser
  if (!currentUser) {
    await showMessageDialog(t('error'), t('userNotFound'), 'error')
    return
  }

  // 修改確認對話框
  const confirmModify = await showConfirmDialog(
    t('confirmModify'),
    `${t('modifyUser')}\n\n${t('originalData')}:\n${t('name')}: ${currentUser.name}\n${t('age')}: ${currentUser.age}\n\n${t('newData')}:\n${t('name')}: ${formData.name}\n${t('age')}: ${formData.age}`,
    t('confirm'),
    t('cancel')
  )

  if (!confirmModify) {
    return
  }

  const result = await userStore.updateUser(currentUser.id, {
    name: formData.name,
    age: parseInt(formData.age),
  })

  if (result.success) {
    await showMessageDialog(t('success'), t('modifySuccess'), 'success')
  } else {
    await showMessageDialog(t('error'), t('modifyFailed'), 'error')
  }

  clearForm()
}

// 取消修改功能
const handleCancel = () => {
  console.log('handleCancel 被調用')
  clearForm()
}

// 新增功能
const handleAdd = async () => {
  if (!userStore) return

  console.log('handleAdd 被調用')
  console.log('formData:', formData)

  if (!formData.name || !formData.age) {
    await showMessageDialog(t('error'), t('fillAllFields'), 'error')
    return
  }

  // 新增確認對話框
  const confirmAdd = await showConfirmDialog(
    t('confirmAdd'),
    `${t('addUser')}\n\n${t('userInfo')}:\n${t('name')}: ${formData.name}\n${t('age')}: ${formData.age}`,
    t('confirm'),
    t('cancel')
  )

  if (!confirmAdd) {
    return
  }

  const result = await userStore.createUser({
    name: formData.name,
    age: parseInt(formData.age),
  })

  if (result.success) {
    await showMessageDialog(t('success'), t('addSuccess'), 'success')
  } else {
    await showMessageDialog(t('error'), t('addFailed'), 'error')
  }

  clearForm()
}

// 清除表單
const clearForm = () => {
  formData.name = ''
  formData.age = ''
  if (userStore) {
    userStore.clearEditingState()
  }
}

// 修改項目
const editItem = (item: User) => {
  if (!userStore) return

  formData.name = item.name
  formData.age = item.age.toString()
  userStore.setEditingUser(item.id)
}

// 刪除項目
const deleteItem = async (userId: number) => {
  if (!userStore) return

  // 獲取要刪除的用戶資料
  const userToDelete = userStore.getUserById(userId)
  if (!userToDelete) {
    await showMessageDialog(t('error'), t('userNotFound'), 'error')
    return
  }

  // 檢查是否正在修改模式且刪除的是正在修改的用戶
  const isEditingThisUser = userStore.isEditing && userStore.editingUserId === userId

  // 刪除確認對話框，顯示詳細資訊
  const confirmDelete = await showConfirmDialog(
    t('confirmDelete'),
    `${t('deleteUser')}\n\n${t('userInfo')}:\n${t('name')}: ${userToDelete.name}\n${t('age')}: ${userToDelete.age}\n\n⚠️ ${t('cannotUndo')}`,
    t('delete'),
    t('cancel')
  )

  if (!confirmDelete) {
    return
  }

  const result = await userStore.deleteUser(userId)

  if (result.success) {
    // 如果刪除的是正在修改的用戶，清空表單
    if (isEditingThisUser) {
      clearForm()
    }
    await showMessageDialog(t('success'), t('deleteSuccess'), 'success')
  } else {
    await showMessageDialog(t('error'), t('deleteFailed'), 'error')
  }
}

// 頁面載入時取得資料
onMounted(() => {
  if (userStore) {
    userStore.loadUsers()
  }
})
</script>

<style scoped lang="scss">
.home-page {
  min-height: 100vh;
  width: 100%;
  background: #2a2a2a;
}

.container {
  max-width: 1000px;
  width: 80%;
  margin: 0 auto;
  border-radius: 16px;
  color: #fbfbfb;
  padding: 32px;
}

.page-title {
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  color: #fbfbfb;
  margin-bottom: 32px;
  background-clip: text;
}

.form-section {
  border-radius: 12px;
  padding: 3rem 15%;
  margin-bottom: 32px;
  border: 1px solid #a4a4a4;
  transition: all 0.3s ease;

  &.editing-mode {
    border-color: #fbfbfb;
    box-shadow: 0 0 20px rgba(251, 251, 251, 0.3);
  }
}

.edit-mode-notice {
  background-color: #4a4a4a;
  color: #fbfbfb;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  animation: editModeNotice 0.3s ease-out;
  border: 1px solid #fbfbfb;
}

@keyframes editModeNotice {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-message {
  background-color: #3a3a3a;
  color: #fbfbfb;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #888888;
}

.loading-message {
  background-color: #4a4a4a;
  color: #fbfbfb;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  border-left: 4px solid #fbfbfb;
}

.no-data {
  text-align: center;
  color: #6b7280;
  padding: 40px;
  font-size: 16px;
}

.form-group {
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  gap: 40px;
  justify-content: flex-end;
  margin-top: 50px;
  flex-wrap: wrap;
}

.table-section {
  // overflow-x: auto;
  border: 1px solid #a4a4a4;
  border-radius: 12px;
  padding: 10px 15%;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 12px;
  overflow: hidden;

  th,
  td {
    padding: 16px;
    text-align: center;
  }

  th {
    color: #fbfbfb;
    font-size: 16px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  tbody tr {
    transition: all 0.3s ease;

    &:hover {
      background-color: #4a4a4a;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(251, 251, 251, 0.1);
    }

    &:last-child td {
      border-bottom: none;
    }
  }

  tbody td {
    font-size: 16px;
    color: #fbfbfb;
    border-bottom: 1px solid #7b7b7b;
  }
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

@media (max-width: 768px) {
  .container {
    padding: 20px;
  }

  .button-group {
    flex-direction: column;
    align-items: center;
  }

  .action-buttons {
    justify-content: center;
  }

  .data-table {
    font-size: 12px;

    th,
    td {
      padding: 12px 8px;
    }
  }
}

@media (max-width: 480px) {
  .container {
    padding: 15px;
    width: 95%;
  }

  .page-title {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .button-group {
    gap: 15px;
  }

  .table-section {
    padding: 10px 5px;
  }

  .data-table {
    font-size: 11px;

    th,
    td {
      padding: 8px 4px;
    }
  }
}

@media (max-width: 320px) {
  .container {
    padding: 10px;
    width: 98%;
  }

  .page-title {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .form-section {
    margin-bottom: 20px;
  }

  .button-group {
    gap: 10px;
    margin-top: 30px;
  }

  .table-section {
    padding: 5px 2px;
    overflow-x: auto;
  }

  .data-table {
    font-size: 10px;
    min-width: 280px;

    th,
    td {
      padding: 6px 2px;
    }

    th {
      font-size: 10px;
    }
  }

  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }

  .edit-mode-notice,
  .error-message,
  .loading-message {
    padding: 8px 12px;
    font-size: 12px;
  }
}
</style>
