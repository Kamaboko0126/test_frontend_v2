<template>
  <div class="language-switcher">
    <div class="language-buttons">
      <button 
        @click="switchToLanguage('zh-TW')" 
        class="language-btn"
        :class="{ 'active': locale === 'zh-TW' }"
      >
        中文
      </button>
      <button 
        @click="switchToLanguage('en-US')" 
        class="language-btn"
        :class="{ 'active': locale === 'en-US' }"
      >
        英文
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// 使用 Nuxt i18n 的語言切換功能
const { locale } = useI18n()

// 切換到指定語言
const switchToLanguage = (newLocale: 'zh-TW' | 'en-US') => {
  if (locale.value !== newLocale) {
    // 直接設定語言，不重新載入頁面
    locale.value = newLocale
  }
}
</script>

<style scoped lang="scss">
.language-switcher {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.language-buttons {
  display: flex;
  gap: 8px;
  padding: 4px;
  border: 2px solid #666666;
  border-radius: 12px;
  background-color: #2a2a2a;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.language-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 50px;
  
  // 未選取
  background-color: transparent;
  color: #888888;
  
  &:hover {
    background-color: #4a4a4a;
    color: #fbfbfb;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  // 已選取
  &.active {
    background-color: #fbfbfb;
    color: #2a2a2a;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(251, 251, 251, 0.2);
    
    &:hover {
      background-color: #e5e5e5;
      color: #2a2a2a;
      transform: none;
    }
  }
}

@media (max-width: 768px) {
  .language-switcher {
    top: 15px;
    right: 15px;
  }

  .language-buttons {
    gap: 6px;
    padding: 3px;
    border-width: 1px;
  }

  .language-btn {
    padding: 6px 12px;
    font-size: 12px;
    min-width: 40px;
  }
}

@media (max-width: 480px) {
  .language-switcher {
    top: 10px;
    right: 10px;
  }

  .language-buttons {
    gap: 4px;
    padding: 2px;
  }

  .language-btn {
    padding: 5px 10px;
    font-size: 11px;
    min-width: 35px;
  }
}

@media (max-width: 320px) {
  .language-switcher {
    top: 8px;
    right: 8px;
  }

  .language-btn {
    padding: 4px 8px;
    font-size: 10px;
    min-width: 30px;
  }
}
</style>