<template>
  <div class="flex flex-col h-screen">
    <!-- 钱包头部 -->
    <WalletHeader />

    <!-- 账户列表 -->
    <div class="p-4 md:p-6 flex-1 overflow-y-auto md:ml-16 lg:ml-20">
      <!-- 平板及桌面端的标题 -->
      <h2 class="hidden md:block text-2xl font-bold text-gray-800 mb-6">我的账户</h2>

      <!-- 平板及桌面端的网格布局 -->
      <div class="md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(category, categoryIndex) in $accountCategories" :key="category.name"
          class="bg-white rounded-xl shadow-sm overflow-hidden mb-4 animate-fade-in"
          :style="{ 'animation-delay': `${categoryIndex * 0.1}s` }" :class="{
            'flex-grow': categoryIndex === $accountCategories.length - 1,
            'md:mb-0': true
          }">
          <div class="p-3 bg-gray-50 border-b border-gray-100">
            <h3 class="text-sm md:text-base font-medium text-gray-600">{{ category.name }}</h3>
          </div>
          <div class="divide-y divide-gray-100">
            <div v-for="account in category.accounts" :key="account.id"
              class="flex justify-between items-center p-3 md:p-4 hover:bg-gray-50 transition-colors">
              <div class="flex items-center">
                <div class="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center">
                  <img :src="$iconPath(account.icon)" class="w-7 h-7" />
                </div>
                <div class="ml-3">
                  <h4 class="text-sm md:text-base font-medium text-gray-800">{{ account.name }}</h4>
                  <p class="text-xs md:text-sm text-gray-500">{{ account.description }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm md:text-base font-medium"
                  :class="{ 'text-gray-800': account.balance >= 0, 'text-red-500': account.balance < 0 }">
                  {{ account.balance >= 0 ? '¥' + account.balance : '-¥' + Math.abs(account.balance) }}
                </p>=
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted,getCurrentInstance } from 'vue'
import WalletHeader from '../components/WalletHeader.vue'
import { fetchAccountsByCategory } from '../services/api.js'

// 获取全局属性
const internalInstance = getCurrentInstance()
const { $accountCategories } = internalInstance.appContext.config.globalProperties

// 获取打开账户模态框的方法
const openAccountModal = inject('openAccountModal')

// 加载账户数据
const loadAccounts = async () => {
  try {
    const data = await fetchAccountsByCategory()
    if (data && data.length > 0) {
      $accountCategories.value = data
    }
  } catch (error) {
    console.error('加载账户数据失败:', error)
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadAccounts()
})
</script>