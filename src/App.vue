<template>
  <div class="w-full mx-auto bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300"
       :class="{
         'scale-95 blur-sm': isAddAccountRoute,
         'max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl': true
       }">

    <!-- 主路由视图 - 始终显示 -->
    <router-view v-slot="{ Component }" :name="isAddAccountRoute ? 'background' : 'default'">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    
    <!-- 底部导航栏 -->
    <!-- <BottomNav class="md:hidden" /> -->
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
import { ref, provide, computed } from 'vue'
import { useRoute } from 'vue-router'
import BottomNav from './components/BottomNav.vue'
import AccountModal from './components/AccountModal.vue'

const route = useRoute()

// 判断当前是否为添加账户路由
const isAddAccountRoute = computed(() => {
  return route.path === '/add-account'
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
</style>