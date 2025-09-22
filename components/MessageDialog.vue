<template>
  <dialog ref="dialogRef" class="message-dialog" @click="handleBackdropClick">
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">
        <div class="dialog-icon" :class="iconClass">
          {{ iconText }}
        </div>
        <h3 class="dialog-title">{{ title }}</h3>
      </div>

      <div class="dialog-body">
        <p class="dialog-message">{{ message }}</p>
      </div>

      <div class="dialog-footer">
        <EBtn color="success" :text="confirmText" @click="handleConfirm" />
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

interface Props {
  title?: string
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  confirmText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '訊息',
  type: 'info',
  confirmText: '確定',
})

const emit = defineEmits<{
  confirm: []
}>()

const dialogRef = ref<HTMLDialogElement>()

// 圖示相關
const iconClass = computed(() => `dialog-icon--${props.type}`)
const iconText = computed(() => {
  switch (props.type) {
    case 'success':
      return '✅'
    case 'error':
      return '❌'
    case 'warning':
      return '⚠️'
    default:
      return 'ℹ️'
  }
})

// 顯示對話框
const show = async () => {
  await nextTick()
  dialogRef.value?.showModal()
}

// 隱藏對話框
const hide = () => {
  dialogRef.value?.close()
}

// 處理確認
const handleConfirm = () => {
  hide()
  emit('confirm')
}

// 處理背景點擊
const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === dialogRef.value) {
    handleConfirm()
  }
}

// 給父組件使用
defineExpose({
  show,
  hide,
})
</script>

<style scoped lang="scss">
.message-dialog {
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
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;

  .dialog-icon {
    font-size: 48px;
    margin-bottom: 12px;

    &--success {
      color: #22c55e;
    }

    &--error {
      color: #ef4444;
    }

    &--warning {
      color: #f59e0b;
    }

    &--info {
      color: #3b82f6;
    }
  }

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
  justify-content: center;
}

// 響應式設計
@media (max-width: 480px) {
  .message-dialog {
    max-width: 320px;
    width: 95%;
  }

  .dialog-content {
    padding: 20px;
  }

  .dialog-header {
    margin-bottom: 16px;

    .dialog-icon {
      font-size: 40px;
      margin-bottom: 10px;
    }

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
}

@media (max-width: 320px) {
  .message-dialog {
    max-width: 300px;
  }

  .dialog-content {
    padding: 16px;
  }

  .dialog-header {
    .dialog-icon {
      font-size: 36px;
    }

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
