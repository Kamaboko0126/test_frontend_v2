<template>
  <div class="e-text-field">
    <label 
      v-if="props.label" 
      :for="fieldId"
      class="e-text-field__label"
    >
      {{ props.label }}
    </label>
    <input 
      :id="fieldId"
      :value="value"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      @keydown="handleKeydown"
      @keypress="handleKeypress"
      class="e-text-field__input"
      :class="{
        'e-text-field__input--focused': isFocused,
        'e-text-field__input--error': hasError
      }"
      v-bind="$attrs"
    />
    <div v-if="errorMessage" class="e-text-field__error">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 使用 Vue 3.4 的 defineModel 語法
const value = defineModel<string>('value', { default: '' })

// 定義事件
const emit = defineEmits<{
  enter: []
}>()

interface Props {
  id?: string // 若使用者有輸入，以使用者輸入的為主，若沒有請產出一個唯一 ID
  label?: string
  type?: string
  validateType?: 'name' | 'age' // 驗證類型
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text'
})

// 產生唯一 ID
const fieldId = computed(() => 
  props.id || `text-field-${Math.random().toString(36).substr(2, 9)}`
)

// 焦點狀態和錯誤狀態
const isFocused = ref(false)
const errorMessage = ref<string>('')
const hasError = computed(() => !!errorMessage.value)

// 驗證函數
const validateName = (inputValue: string): string => {
  // 允許中文、英文字母和空格
  const nameRegex = /^[\u4e00-\u9fff\u3400-\u4dbfa-zA-Z\s]*$/
  if (!nameRegex.test(inputValue)) {
    return '名字只能包含中文、英文字母和空格'
  }
  return ''
}

const validateAge = (inputValue: string): string => {
  const ageNumber = parseInt(inputValue)
  if (inputValue && (isNaN(ageNumber) || ageNumber < 0)) {
    return '年齡不能為負數'
  }
  return ''
}

// 事件處理
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let inputValue = target.value
  
  // 如果是年齡輸入，限制只能輸入數字
  if (props.validateType === 'age') {
    // 移除負號和非數字字符
    inputValue = inputValue.replace(/[^0-9]/g, '')
    target.value = inputValue
  }
  
  value.value = inputValue
  
  // 執行驗證
  if (props.validateType === 'name') {
    errorMessage.value = validateName(inputValue)
  } else if (props.validateType === 'age') {
    errorMessage.value = validateAge(inputValue)
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  // 檢查是否按下 Enter 鍵
  if (event.key === 'Enter') {
    console.log('Enter 鍵被按下')
    console.log('errorMessage.value:', errorMessage.value)
    
    // 阻止預設行為和事件傳播
    event.preventDefault()
    event.stopPropagation()
    
    // 如果有驗證錯誤，不執行提交
    if (errorMessage.value) {
      console.log('有驗證錯誤，不發出事件')
      return
    }
    // 發出 enter 事件
    console.log('發出 enter 事件')
    emit('enter')
    return
  }
  
  // 對於年齡輸入，阻止負號和其他特殊字符
  if (props.validateType === 'age') {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
    if (!allowedKeys.includes(event.key) && (event.key < '0' || event.key > '9')) {
      event.preventDefault()
    }
  }
  
  // 對於名字輸入，阻止數字和運算符
  if (props.validateType === 'name') {
    const blockedKeys = /[0-9+\-*/=<>!@#$%^&(){}[\]|\\:";'?,./~`]/
    if (blockedKeys.test(event.key)) {
      event.preventDefault()
    }
  }
}

const handleFocus = () => {
  isFocused.value = true
}

const handleBlur = () => {
  isFocused.value = false
}

const handleKeypress = (event: KeyboardEvent) => {
  // 阻止 Enter 鍵的預設 keypress 行為
  if (event.key === 'Enter') {
    console.log('Keypress Enter 被阻止')
    event.preventDefault()
    event.stopPropagation()
  }
}
</script>

<style scoped lang="scss">
.e-text-field {
  display: flex;
  flex-direction: column;
  gap: 6px;

  &__label {
    font-size: 14px;
    font-weight: 500;
    color: #fbfbfb;
    margin-bottom: 2px;
  }

  &__input {
    padding: 12px 16px;
    border: 2px solid #666666;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s ease;
    background-color: #2a2a2a;
    font-weight: 500;
    color: #fbfbfb;

    &:focus {
      outline: none;
      border-color: #fbfbfb;
      box-shadow: 0 0 0 3px rgba(251, 251, 251, 0.1);
    }

    &:hover {
      border-color: #888888;
    }

    &--focused {
      border-color: #fbfbfb;
    }

    &--error {
      border-color: #dc2626;
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }

    &::placeholder {
      color: #9ca3af;
    }

    // 隱藏數字輸入的上下箭頭
    &[type="number"] {
      appearance: textfield;
      -moz-appearance: textfield;
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }
  }

  &__error {
    font-size: 12px;
    color: #dc2626;
    margin-top: 4px;
    padding-left: 4px;
  }
}

@media (max-width: 480px) {
  .e-text-field {
    &__input {
      padding: 10px 12px;
      font-size: 14px;
    }

    &__label {
      font-size: 13px;
    }

    &__error {
      font-size: 11px;
    }
  }
}

@media (max-width: 320px) {
  .e-text-field {
    &__input {
      padding: 8px 10px;
      font-size: 13px;
    }

    &__label {
      font-size: 12px;
    }

    &__error {
      font-size: 10px;
    }
  }
}
</style>
