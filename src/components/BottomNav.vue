<template>
  <!-- 移动端底部导航 -->
  <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 mx-auto z-30"
       :class="{'max-w-full sm:max-w-lg': true}">
    <div class="flex justify-around items-center py-2 sm:py-3">
      <button 
        class="flex flex-col items-center px-2 py-1 rounded-lg transition-all duration-200" 
        :class="{ 
          'text-primary bg-primary bg-opacity-5': currentRoute === '/statistics', 
          'text-gray-400 hover:text-primary hover:bg-gray-50 transition-colors': currentRoute !== '/statistics' 
        }"
        @click="navigateTo('/statistics')"
      >
        <i class="fa fa-pie-chart text-lg sm:text-xl"></i>
        <span class="text-xs mt-1">资产</span>
      </button>
      <button 
        class="flex flex-col items-center px-2 py-1 rounded-lg transition-all duration-200" 
        :class="{ 
          'text-primary bg-primary bg-opacity-5': currentRoute === '/', 
          'text-gray-400 hover:text-primary hover:bg-gray-50 transition-colors': currentRoute !== '/' 
        }"
        @click="navigateTo('/')"
      >
        <i class="fa fa-wallet text-lg sm:text-xl"></i>
        <span class="text-xs mt-1">钱包</span>
      </button>
      <button class="flex flex-col items-center px-2 py-1 rounded-lg text-gray-400 hover:text-primary hover:bg-gray-50 transition-all duration-200">
        <i class="fa fa-line-chart text-lg sm:text-xl"></i>
        <span class="text-xs mt-1">市场</span>
      </button>
      <button class="flex flex-col items-center px-2 py-1 rounded-lg text-gray-400 hover:text-primary hover:bg-gray-50 transition-all duration-200">
        <i class="fa fa-ellipsis-h text-lg sm:text-xl"></i>
        <span class="text-xs mt-1">更多</span>
      </button>
    </div>
  </div>
  
  <!-- 平板及桌面端侧边导航 (在App.vue中通过md:hidden隐藏移动端显示) -->
  <div class="hidden md:block fixed left-0 top-0 bottom-0 w-16 lg:w-20 bg-white border-r border-gray-200 shadow-lg z-30">
    <div class="flex flex-col items-center py-6 h-full">
      <div class="mb-8">
        <h2 class="font-bold text-primary text-xl lg:text-2xl">W</h2>
      </div>
      <div class="flex-1 flex flex-col space-y-6 items-center">
        <button 
          class="p-3 lg:p-4 rounded-xl transition-all duration-200" 
          :class="{ 
            'bg-primary bg-opacity-10 text-primary shadow-sm': currentRoute === '/', 
            'text-gray-400 hover:text-primary hover:bg-gray-100': currentRoute !== '/' 
          }"
          @click="navigateTo('/')"
        >
          <i class="fa fa-wallet text-xl lg:text-2xl"></i>
        </button>
        <button 
          class="p-3 lg:p-4 rounded-xl transition-all duration-200" 
          :class="{ 
            'bg-primary bg-opacity-10 text-primary shadow-sm': currentRoute === '/statistics', 
            'text-gray-400 hover:text-primary hover:bg-gray-100': currentRoute !== '/statistics' 
          }"
          @click="navigateTo('/statistics')"
        >
          <i class="fa fa-pie-chart text-xl lg:text-2xl"></i>
        </button>
        <button class="p-3 lg:p-4 rounded-xl text-gray-400 hover:text-primary hover:bg-gray-100 transition-all duration-200">
          <i class="fa fa-line-chart text-xl lg:text-2xl"></i>
        </button>
      </div>
      <button class="p-3 lg:p-4 rounded-xl text-gray-400 hover:text-primary hover:bg-gray-100 transition-all duration-200">
        <i class="fa fa-ellipsis-h text-xl lg:text-2xl"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 计算当前路由路径
const currentRoute = computed(() => route.path)

// 导航到指定路由
const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
/* 底部导航栏样式已移除 */
</style>