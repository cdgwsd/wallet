<template>
  <div class="relative glass-effect p-4 sm:p-6 border-b border-gray-200 safe-top">
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
import { ref, onMounted, watch, defineExpose } from 'vue'
import { useRouter } from 'vue-router'
import { fetchData } from '../services/api.js'

const router = useRouter()
const netWorth = ref(0)
const isRefreshing = ref(false)
const accounts = ref([])

// 计算净资产
const calculateNetWorth = () => {
  if (!accounts.value || accounts.value.length === 0) {
    netWorth.value = 0
    return
  }
  
  // 计算所有账户余额的总和
  const total = accounts.value.reduce((sum, account) => sum + (parseFloat(account.balance) || 0), 0)
  netWorth.value = total.toFixed(2)
}

// 加载账户数据
const loadAccounts = async () => {
  try {
    isRefreshing.value = true
    accounts.value = await fetchData('accounts')
    calculateNetWorth()
  } catch (error) {
    console.error('加载账户数据失败:', error)
  } finally {
    isRefreshing.value = false
  }
}

// 刷新数据
const goToStatistics = () => {
  router.push('/statistics')
}

// 跳转到添加账户页面
const goToAddAccount = () => {
  router.push('/add-account')
}

// 监听账户数据变化
watch(accounts, () => {
  calculateNetWorth()
}, { deep: true })

// 组件挂载时加载数据
onMounted(() => {
  loadAccounts()
})

// 暴露方法给父组件
defineExpose({
  loadAccounts
})
</script>

<style scoped>
/* 适配iPhone顶部安全区域 */
.safe-top {
  padding-top: max(1rem, env(safe-area-inset-top, 1rem));
}

/* 玻璃效果 */
.glass-effect {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.8);
}

/* 微妙的脉冲动画 */
@keyframes pulse-subtle {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.95;
  }
  100% {
    opacity: 1;
  }
}

.animate-pulse-subtle {
  animation: pulse-subtle 2s infinite ease-in-out;
}
</style>