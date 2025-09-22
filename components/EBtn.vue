<template>
  <button 
    :class="[
      'e-btn',
      `e-btn-${props.color}`,
      { 'e-btn--disabled': props.disabled }
    ]"
    :disabled="props.disabled"
    @click="handleClick"
  >
    {{ props.text || '' }}
    <slot v-if="!props.text" />
  </button>
</template>

<script setup lang="ts">
interface Props {
  text?: string // 若有輸入時以此為主，若沒有就顯示 slot
  color?: 'success' | 'error' | 'warn' // 預設為 success
  disabled?: boolean // 禁用狀態
}

const props = withDefaults(defineProps<Props>(), {
  color: 'success',
  disabled: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped lang="scss">
.e-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
  
  &:focus {
    outline: none;
    // box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  }

  // 禁用狀態
  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      transform: none !important;
      box-shadow: none !important;
    }
    
    &:active {
      transform: none !important;
      box-shadow: none !important;
    }
  }

  // success 綠
  &-success {
    background-color: #22c55e;
    color: #FBFBFB;
    
    &:hover {
      background-color: #16a34a;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
    }
    
    &:active {
      background-color: #15803d;
      transform: translateY(0);
      box-shadow: 0 2px 6px rgba(34, 197, 94, 0.4);
    }
  }

  // error 紅
  &-error {
    background-color: #ef4444;
    color: #FBFBFB;
    
    &:hover {
      background-color: #dc2626;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }
    
    &:active {
      background-color: #b91c1c;
      transform: translateY(0);
      box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);
    }
  }

  // warn 黃
  &-warn {
    background-color: #f59e0b;
    color: #2a2a2a;
    
    &:hover {
      background-color: #d97706;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    }
    
    &:active {
      background-color: #b45309;
      transform: translateY(0);
      box-shadow: 0 2px 6px rgba(245, 158, 11, 0.4);
    }
  }
}

@media (max-width: 480px) {
  .e-btn {
    padding: 10px 16px;
    font-size: 13px;
    min-width: 70px;
  }
}

@media (max-width: 320px) {
  .e-btn {
    padding: 8px 12px;
    font-size: 12px;
    min-width: 60px;
  }
}
</style>
