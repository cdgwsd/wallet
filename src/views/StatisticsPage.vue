<template>
  <div class="p-4 md:p-6 md:ml-16 lg:ml-20">
    <div class="flex justify-between items-center mb-4 md:mb-6">
      <button 
        class="text-gray-600 hover:text-primary transition-colors md:hidden"
        @click="goBack"
      >
        <i class="fa fa-arrow-left"></i>
      </button>
      <h2 class="font-semibold text-gray-800 text-lg md:text-2xl">统计分析</h2>
      <button class="text-gray-600 hover:text-primary transition-colors">
        <i class="fa fa-ellipsis-v"></i>
      </button>
    </div>
    
    <div class="flex border-b border-gray-200 mb-4 md:mb-6 overflow-x-auto">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        class="px-4 py-2 font-medium whitespace-nowrap"
        :class="{
          'text-primary border-b-2 border-primary': activeTab === tab.id,
          'text-gray-500': activeTab !== tab.id
        }"
        @click="activeTab = tab.id"
      >
        {{ tab.name }}
      </button>
    </div>
    
    <!-- 在平板和桌面端使用两列布局 -->
    <div class="md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3">
      <!-- 第一列：主要数据 -->
      <div class="md:col-span-1 lg:col-span-1">
        <div class="bg-white rounded-xl shadow-sm p-4 md:p-5 mb-4 animate-fade-in">
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-medium text-gray-800 md:text-lg">{{ activeTabName }}</h3>
            <span class="text-xs md:text-sm text-gray-500">相比 2025-06-30</span>
          </div>
          <div class="flex items-end mb-3">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-800">¥{{ netWorth }}</h2>
            <div class="ml-2 flex items-center text-gray-500 text-sm md:text-base">
              <span>¥{{ change }}</span>
              <span class="ml-1">{{ changePercent }}%</span>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm p-4 md:p-5 mb-4 animate-fade-in" style="animation-delay: 0.1s">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-medium text-gray-800 md:text-lg">风险评估</h3>
            <span class="text-xs md:text-sm text-primary">查看详情</span>
          </div>
          <div class="flex items-center mb-2">
            <div class="w-2 h-2 md:w-3 md:h-3 rounded-full" :class="riskLevelColor"></div>
            <span class="text-sm md:text-base text-gray-800 ml-2">{{ riskLevelText }}</span>
          </div>
          <div class="w-full h-2 md:h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div 
              class="h-full" 
              :class="riskLevelColor" 
              :style="{ width: `${debtRatio}%` }"
            ></div>
          </div>
          <div class="grid grid-cols-2 gap-3 md:gap-4">
            <div class="bg-gray-50 rounded-lg p-3 md:p-4">
              <h4 class="text-xs md:text-sm text-gray-500 mb-1">负债率</h4>
              <p class="text-lg md:text-xl font-medium text-gray-800">{{ debtRatio }}%</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-3 md:p-4">
              <h4 class="text-xs md:text-sm text-gray-500 mb-1">总资产</h4>
              <p class="text-lg md:text-xl font-medium text-gray-800">¥{{ totalAssets }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-3 md:p-4 md:col-span-2 lg:col-span-1">
              <h4 class="text-xs md:text-sm text-gray-500 mb-1">负债</h4>
              <p class="text-lg md:text-xl font-medium text-red-500">¥{{ totalDebt }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 第二列：趋势和明细 -->
      <div class="md:col-span-1 lg:col-span-2">
        <div class="bg-white rounded-xl shadow-sm p-4 md:p-5 mb-4 animate-fade-in" style="animation-delay: 0.2s">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h3 class="font-medium text-gray-800 md:text-lg mb-2 md:mb-0">{{ activeTabName }}趋势</h3>
            <div class="flex space-x-2">
              <button 
                v-for="period in periods" 
                :key="period.id"
                class="px-2 py-1 text-xs md:text-sm rounded"
                :class="{
                  'bg-primary text-white': activePeriod === period.id,
                  'bg-gray-100 text-gray-500': activePeriod !== period.id
                }"
                @click="activePeriod = period.id"
              >
                {{ period.name }}
              </button>
            </div>
          </div>
          <div class="h-48 md:h-64 flex items-end justify-between px-2">
            <!-- 模拟柱状图 -->
            <div 
              v-for="(month, index) in trendData" 
              :key="index"
              class="w-5 md:w-8 rounded-t flex flex-col items-center"
              :class="month.current ? 'bg-primary' : 'bg-green-400'"
              :style="{ height: `${month.percentage}%` }"
            >
              <span class="text-xs md:text-sm font-medium" :class="month.current ? 'text-primary' : 'text-green-700'">
                ¥{{ month.value }}
              </span>
              <span class="text-xs md:text-sm text-gray-500 mt-1">{{ month.label }}</span>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm p-4 md:p-5 animate-fade-in" style="animation-delay: 0.3s">
          <h3 class="font-medium text-gray-800 md:text-lg mb-3">月度明细</h3>
          <div class="divide-y divide-gray-100">
            <div 
              v-for="(month, index) in monthlyDetails" 
              :key="index"
              class="flex justify-between items-center py-3 md:py-4 transition-colors"
            >
              <div>
                <h4 class="text-sm md:text-base font-medium text-gray-800">{{ month.label }}</h4>
                <p class="text-xs md:text-sm text-gray-500">{{ month.status }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm md:text-base font-medium text-gray-800">¥{{ month.value }}</p>
                <p class="text-xs md:text-sm text-gray-500">{{ month.change }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 标签页数据
const tabs = [
  { id: 'netWorth', name: '净资产' },
  { id: 'totalAssets', name: '总资产' },
  { id: 'debt', name: '负债' }
]

// 时间周期数据
const periods = [
  { id: 'month', name: '月' },
  { id: 'quarter', name: '季' },
  { id: 'year', name: '年' }
]

// 活动标签和周期
const activeTab = ref('netWorth')
const activePeriod = ref('month')

// 计算当前活动标签名称
const activeTabName = computed(() => {
  const tab = tabs.find(t => t.id === activeTab.value)
  return tab ? tab.name : ''
})

// 财务数据
const netWorth = ref(100)
const totalAssets = ref(300)
const totalDebt = ref(200)
const change = ref(0)
const changePercent = ref(0)

// 计算负债率
const debtRatio = computed(() => {
  return Math.round((totalDebt.value / totalAssets.value) * 100)
})

// 计算风险等级
const riskLevel = computed(() => {
  if (debtRatio.value >= 60) return 'high'
  if (debtRatio.value >= 30) return 'medium'
  return 'low'
})

// 风险等级文本
const riskLevelText = computed(() => {
  switch (riskLevel.value) {
    case 'high': return '高风险'
    case 'medium': return '中等风险'
    case 'low': return '低风险'
    default: return ''
  }
})

// 风险等级颜色
const riskLevelColor = computed(() => {
  switch (riskLevel.value) {
    case 'high': return 'bg-red-500'
    case 'medium': return 'bg-yellow-500'
    case 'low': return 'bg-green-500'
    default: return ''
  }
})

// 趋势数据
const trendData = ref([
  { label: '5月', value: 100, percentage: 80, current: false },
  { label: '6月', value: 100, percentage: 80, current: false },
  { label: '7月', value: 100, percentage: 100, current: true }
])

// 月度明细数据
const monthlyDetails = ref([
  { 
    label: '2025年7月', 
    status: '当前月', 
    value: 100, 
    change: '相比上月 ¥0 (0.00%)' 
  },
  { 
    label: '2025年6月', 
    status: '已结算', 
    value: 100, 
    change: '相比上月 ¥0 (0.00%)' 
  },
  { 
    label: '2025年5月', 
    status: '已结算', 
    value: 100, 
    change: '初始值' 
  }
])

// 返回上一页
const goBack = () => {
  router.push('/')
}
</script>