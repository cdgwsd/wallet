<template>
  <div class="w-full mx-auto bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 safe-area-inset"
       :class="{
         'scale-95 blur-sm': isAddAccountRoute,
         'max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl': true,
         'h-full': isMobileDevice
       }">

    <!-- 主路由视图 - 始终显示 -->
    <router-view v-slot="{ Component }" :name="isAddAccountRoute ? 'background' : 'default'">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    
    <!-- 底部导航栏已移除 -->
  </div>
  
  <!-- 添加账户页面（从底部滑入） -->
  <div v-if="isAddAccountRoute" class="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300">
    <div class="absolute bottom-0 left-0 right-0 mx-auto bg-white rounded-t-2xl overflow-hidden shadow-lg z-50"
         :class="{'max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl': true}">
      <router-view v-slot="{ Component }" name="modal">
        <component :is="Component" />
      </router-view>
    </div>
  </div>
  
  <!-- 账户类型选择弹窗 -->
  <AccountModal v-if="showAccountModal" @close="showAccountModal = false" />
</template>

<script setup>
import { ref, provide, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AccountModal from './components/AccountModal.vue'

const route = useRoute()
const isMobileDevice = ref(false)

// 检测是否为移动设备和PWA模式
onMounted(() => {
  const userAgent = navigator.userAgent.toLowerCase()
  isMobileDevice.value = /iphone|ipad|ipod|android/.test(userAgent)
  
  // 检查是否为 PWA 模式
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                window.navigator.standalone || 
                document.referrer.includes('android-app://') ||
                window.location.search.includes('source=pwa')
  
  // 处理iOS设备上的全屏显示
  if (isMobileDevice.value) {
    // 防止iOS Safari上的双击缩放
    document.addEventListener('touchend', (event) => {
      if (event.touches.length > 1) {
        event.preventDefault()
      }
    }, { passive: false })
    
    // 防止iOS Safari上的弹性滚动
    document.body.style.overscrollBehavior = 'none'
    
    // 在PWA模式下特别处理iOS的滚动行为
    if (isPWA) {
      // 监听页面可见性变化，当用户从后台切回应用时刷新数据
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          // 发布一个自定义事件，通知组件刷新数据
          window.dispatchEvent(new CustomEvent('pwa-resume'))
        }
      })
      
      // 禁用iOS的橡皮筋效果
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.height = '100%'
      document.body.style.overflow = 'hidden'
      
      // 确保app容器可以滚动
      const appDiv = document.querySelector('#app')
      if (appDiv) {
        appDiv.style.position = 'absolute'
        appDiv.style.top = '0'
        appDiv.style.left = '0'
        appDiv.style.right = '0'
        appDiv.style.bottom = '0'
        appDiv.style.overflowY = 'auto'
        appDiv.style.webkitOverflowScrolling = 'touch'
      }
    }
  }
})

// 判断当前是否为添加账户路由或编辑账户路由
const isAddAccountRoute = computed(() => {
  return route.path === '/add-account' || route.path.startsWith('/edit-account/')
})

// 账户模态框状态
const showAccountModal = ref(false)

// 提供模态框控制方法给子组件
provide('openAccountModal', () => {
  showAccountModal.value = true
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active {
  animation: slide-up 0.3s ease-out forwards;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

/* 适配iPhone的安全区域 */
.safe-area-inset {
  padding-top: env(safe-area-inset-top);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* 移动设备上的额外样式 */
@media (max-width: 767px) {
  body {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    user-select: none;
  }
}
</style>