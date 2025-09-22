<template>
  <dialog ref="dialogRef" class="confirm-dialog" @click="handleBackdropClick">
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">
        <h3 class="dialog-title">{{ title }}</h3>
      </div>

      <div class="dialog-body">
        <p class="dialog-message" v-html="message"></p>
      </div>

      <div class="dialog-footer">
        <EBtn color="success" :text="confirmText" @click="handleConfirm" />
        <EBtn color="error" :text="cancelText" @click="handleCancel" />
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

interface Props {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '確認',
  confirmText: '確定',
  cancelText: '取消',
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const dialogRef = ref<HTMLDialogElement>()

// 顯示對話框
const show = async () => {
  await nextTick()
  dialogRef.value?.showModal()
}

// 隱藏對話框
const hide = () => {
  dialogRef.value?.close()
}

// 確認
const handleConfirm = () => {
  hide()
  emit('confirm')
}

// 取消
const handleCancel = () => {
  hide()
  emit('cancel')
}

// 處理背景點擊
const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === dialogRef.value) {
    handleCancel()
  }
}

// 給父組件
defineExpose({
  show,
  hide,
})
</script>

<style scoped lang="scss">
.confirm-dialog {
  border: none;
  border-radius: 12px;
  padding: 0;
  max-width: 400px;
  width: 90%;
  background-color: #2a2a2a;
  color: #fbfbfb;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);

  // 確保 dialog 置中
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translate(-50%, 0);
  margin: 0;

  &::backdrop {
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
  }
}

.dialog-content {
  padding: 24px;
}

.dialog-header {
  margin-bottom: 20px;

  .dialog-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #fbfbfb;
    text-align: center;
  }
}

.dialog-body {
  margin-bottom: 24px;

  .dialog-message {
    margin: 0;
    font-size: 16px;
    line-height: 1.5;
    color: #d1d5db;
    text-align: center;
    white-space: pre-line;
  }
}

.dialog-footer {
  display: flex;
  gap: 12px;
  justify-content: center;
}

@media (max-width: 480px) {
  .confirm-dialog {
    max-width: 320px;
    width: 95%;
  }

  .dialog-content {
    padding: 20px;
  }

  .dialog-header {
    margin-bottom: 16px;

    .dialog-title {
      font-size: 18px;
    }
  }

  .dialog-body {
    margin-bottom: 20px;

    .dialog-message {
      font-size: 14px;
    }
  }

  .dialog-footer {
    gap: 8px;
    flex-direction: column;
  }
}

@media (max-width: 320px) {
  .confirm-dialog {
    max-width: 300px;
  }

  .dialog-content {
    padding: 16px;
  }

  .dialog-header {
    .dialog-title {
      font-size: 16px;
    }
  }

  .dialog-body {
    .dialog-message {
      font-size: 13px;
    }
  }
}
</style>
