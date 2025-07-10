<template>
  <div class="relative glass-effect p-4 sm:p-6 border-b border-gray-200">
    <div class="flex justify-between items-center mb-4">
      <!-- 在平板及以上设备显示设置按钮 -->
      <button class="hidden md:block text-gray-600 hover:text-primary transition-colors">
        <i class="fa fa-cog text-xl"></i>
      </button>
      <h1 class="text-xl md:text-2xl font-bold text-gray-800">钱包</h1>
      <div class="flex space-x-3">
        <button class="text-gray-600 hover:text-primary transition-colors" @click="goToStatistics">
          <img src="@/assets/icons/pie-chart.svg" class="text-lg sm:text-xl w-6 h-6" />
        </button>
        <button class="text-gray-600 hover:text-primary transition-colors" @click="goToAddAccount">
          <img src="@/assets/icons/plus.svg" class="text-lg sm:text-xl w-6 h-6" />
        </button>
      </div>
    </div>

    <div class="flex items-end">
      <h2
        class="text-[clamp(1.8rem,4vw,2.5rem)] md:text-[clamp(2rem,5vw,3rem)] font-bold text-gray-800 animate-pulse-subtle"
        :class="{ 'opacity-50': isRefreshing }">
        ¥{{ netWorth }}
      </h2>
      <span class="ml-2 text-gray-500 text-sm md:text-base mb-1">净资产</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const netWorth = ref(100)
const isRefreshing = ref(false)

// 刷新数据
const goToStatistics = () => {
  router.push('/statistics')
}

// 跳转到添加账户页面
const goToAddAccount = () => {
  router.push('/add-account')
}
</script>