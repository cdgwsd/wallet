<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeModal">
    <div class="bg-white rounded-xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-4 overflow-hidden shadow-2xl transform transition-all animate-slide-up">
      <div class="p-4 sm:p-5 border-b border-gray-200">
        <h3 class="text-lg md:text-xl font-semibold text-center">选择账户类型</h3>
      </div>
      <div class="p-2 sm:p-3 md:p-4">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          <div 
            v-for="(account, index) in accountTypes" 
            :key="index"
            class="flex items-center p-3 md:p-4 rounded-lg bg-gray-50 card-hover transition-all duration-200 hover:shadow-md"
            :class="{ 
              'col-span-2 md:col-span-3': account.fullWidth,
              'md:flex-col md:items-center md:justify-center md:text-center md:py-6': !account.fullWidth && isMediumScreen
            }"
            @click="selectAccountType(account.type)"
          >
            <div 
              class="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center" 
              :class="account.bgColor"
            >
              <i :class="`fa ${account.icon} ${account.iconColor} md:text-lg`"></i>
            </div>
            <div class="ml-3 md:ml-0 md:mt-3">
              <h4 class="font-medium text-gray-800 md:text-lg">{{ account.name }}</h4>
              <p class="text-xs md:text-sm text-gray-500">{{ account.description }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="p-4 md:p-5 border-t border-gray-200">
        <button 
          class="w-full py-2 md:py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors text-sm md:text-base"
          @click="closeModal"
        >
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()
const isMediumScreen = ref(false)

// 检测屏幕尺寸
onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

// 检查屏幕尺寸
const checkScreenSize = () => {
  isMediumScreen.value = window.innerWidth >= 768
}

// 定义账户类型
const accountTypes = [
  {
    type: 'cash',
    name: '现金账户',
    description: '实物货币账户',
    icon: 'fa-money',
    bgColor: 'bg-blue-100',
    iconColor: 'text-primary'
  },
  {
    type: 'credit',
    name: '信用账户',
    description: '信用卡类账户',
    icon: 'fa-credit-card',
    bgColor: 'bg-red-100',
    iconColor: 'text-red-500'
  },
  {
    type: 'investment',
    name: '投资账户',
    description: '股票基金等',
    icon: 'fa-line-chart',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-500'
  },
  {
    type: 'savings',
    name: '储蓄账户',
    description: '银行存款账户',
    icon: 'fa-university',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-500'
  },
  {
    type: 'debt',
    name: '负债',
    description: '欠款类账户',
    icon: 'fa-minus-circle',
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-500'
  },
  {
    type: 'receivable',
    name: '债权',
    description: '应收款账户',
    icon: 'fa-plus-circle',
    bgColor: 'bg-indigo-100',
    iconColor: 'text-indigo-500'
  },
  {
    type: 'other',
    name: '其他账户',
    description: '自定义账户类型',
    icon: 'fa-ellipsis-h',
    bgColor: 'bg-gray-200',
    iconColor: 'text-gray-600',
    fullWidth: true
  }
]

// 定义事件
const emit = defineEmits(['close'])

// 关闭模态框
const closeModal = () => {
  emit('close')
}

// 选择账户类型
const selectAccountType = (type) => {
  // 跳转到添加账户页面并传递账户类型
  router.push({
    path: '/add-account',
    query: { type }
  })
  closeModal()
}
</script>