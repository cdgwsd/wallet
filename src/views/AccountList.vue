<template>
    <div class="flex flex-col h-screen">
        <!-- 钱包头部 -->
        <WalletHeader ref="walletHeader" />

        <!-- 账户列表 -->
        <PullToRefresh 
            class="flex-1 overflow-y-auto md:ml-16 lg:ml-20" 
            :refreshing="isRefreshing" 
            @refresh="handleRefresh"
            :disabled="isRefreshDisabled">
        <div class="p-4 md:p-6" @click="closeAllSwipeItems">
            <!-- 平板及桌面端的标题 -->
            <h2 class="hidden md:block text-2xl font-bold text-gray-800 mb-6">我的账户</h2>

            <!-- 平板及桌面端的网格布局 -->
            <div class="md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                    v-for="(category, categoryIndex) in $accountCategories"
                    :key="category.name"
                    class="bg-white rounded-xl shadow-sm overflow-hidden mb-4 animate-fade-in"
                    :style="{ 'animation-delay': `${categoryIndex * 0.1}s` }"
                    :class="{
                        'flex-grow': categoryIndex === $accountCategories.length - 1,
                        'md:mb-0': true,
                    }"
                >
                    <div class="p-3 bg-gray-50 border-b border-gray-100">
                        <h3 class="text-sm md:text-base font-medium text-gray-600">{{ category.name }}</h3>
                    </div>
                    <div class="divide-y divide-gray-100">
                        <div v-for="(account, accountIndex) in category.accounts" :key="account.id" class="relative overflow-hidden">
                            <!-- 滑动项容器 -->
                            <div
                                class="swipe-item"
                                :ref="
                                    (el) => {
                                        if (el) swipeItems[`${categoryIndex}-${accountIndex}`] = el;
                                    }
                                "
                                @touchstart="handleTouchStart($event, categoryIndex, accountIndex)"
                                @touchmove="handleTouchMove($event, categoryIndex, accountIndex)"
                                @touchend="handleTouchEnd($event, categoryIndex, accountIndex)"
                                :style="{ transform: `translateX(${swipeOffset[`${categoryIndex}-${accountIndex}`] || 0}px)` }"
                                :class="{ 'transition-transform': isTransitioning[`${categoryIndex}-${accountIndex}`] }"
                            >
                                <div class="flex justify-between items-center p-3 md:p-4 transition-colors">
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
                                        <p class="text-sm md:text-base font-medium" :class="{ 'text-gray-800': account.balance >= 0, 'text-red-500': account.balance < 0 }">
                                            {{ account.balance >= 0 ? "¥" + account.balance : "-¥" + Math.abs(account.balance) }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <!-- 操作按钮 -->
                            <div class="absolute top-0 right-0 bottom-0 flex">
                                <button @click="editAccount(account)" class="bg-blue-500 text-white flex items-center justify-center px-4">
                                    <span>编辑</span>
                                </button>
                                <button @click="deleteAccount(account)" class="bg-red-500 text-white flex items-center justify-center px-4">
                                    <span>删除</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </PullToRefresh>
    </div>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted, getCurrentInstance, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import WalletHeader from "../components/WalletHeader.vue";
import PullToRefresh from "../components/PullToRefresh.vue";
import { deleteData, fetchAccountsByCategory } from "../services/api.js";

// 获取路由实例
const router = useRouter();

// 获取全局属性
const internalInstance = getCurrentInstance();
const { $accountCategories } = internalInstance.appContext.config.globalProperties;

// 获取打开账户模态框的方法
const openAccountModal = inject("openAccountModal");

// 编辑账户
const editAccount = (account) => {
    console.log("编辑账户:", account);
    // 导航到编辑账户页面，并传递账户ID
    router.push(`/edit-account/${account.id}`);
    closeAllSwipeItems();
};

// 删除账户
const deleteAccount = async (account) => {
    console.log("删除账户:", account);
    const accountId = account.id;
    removeAccountById(accountId);
    await deleteData(accountId);
    // 这里可以实现删除账户的逻辑，例如显示确认对话框
    closeAllSwipeItems();
};

/**
 * 删除Vue ref引用数组中的账户元素（响应式更新）
 *
 * 参数:
 * targetId (Number): 需要删除的账户ID
 */
const removeAccountById = (targetId) => {
    $accountCategories.value = $accountCategories.value
        .map((item) => {
            if (item.accounts) {
                return {
                    ...item,
                    accounts: item.accounts.filter((account) => account.id != targetId),
                };
            }
            return item;
        })
        .filter(
            (item) =>
                // 保留有accounts字段且accounts数组不为空的项
                !item.accounts || item.accounts.length > 0
        );
};

// 刷新状态
const isRefreshing = ref(false);

// 检查是否为 PWA 模式
const isPWAMode = ref(false);
onMounted(() => {
    // 检查是否为 PWA 模式（iOS 和 Android 兼容）
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         window.navigator.standalone || 
                         document.referrer.includes('android-app://') ||
                         window.location.search.includes('source=pwa');
    
    // 如果是 PWA 模式，添加特定的 body 类
    if (isStandalone) {
        document.body.classList.add('pwa-mode');
        
        // 监听 PWA 恢复事件，当用户从后台切回应用时自动刷新数据
        window.addEventListener('pwa-resume', handleRefresh);
    } else {
        document.body.classList.remove('pwa-mode');
    }
    
    isPWAMode.value = isStandalone;
    
    // 初始加载数据
    loadAccounts();
});

onUnmounted(() => {
    // 移除 PWA 恢复事件监听器
    window.removeEventListener('pwa-resume', handleRefresh);
});

// 是否禁用下拉刷新（在非 PWA 模式下不需要禁用）
const isRefreshDisabled = computed(() => {
    return false; // 始终启用下拉刷新，无论是否为 PWA 模式
});

// 钱包头部组件引用
const walletHeader = ref(null);

// 处理下拉刷新
const handleRefresh = async () => {
    if (isRefreshing.value) return;
    isRefreshing.value = true;
    
    // 并行刷新账户列表和钱包头部
    const promises = [
        loadAccounts(),
        walletHeader.value?.loadAccounts()
    ];
    
    await Promise.all(promises);
    
    // 延迟一下，让用户看到刷新动画
    setTimeout(() => {
        isRefreshing.value = false;
    }, 800);
};

// 加载账户数据
const loadAccounts = async () => {
    try {
        const data = await fetchAccountsByCategory();
        if (data && data.length > 0) {
            $accountCategories.value = data;
        }
    } catch (error) {
        console.error("加载账户数据失败:", error);
    }
};

// 滑动相关状态
const swipeItems = reactive({}); // 存储所有滑动项的引用
const swipeOffset = reactive({}); // 存储每个项的滑动偏移量
const isTransitioning = reactive({}); // 存储是否处于过渡动画中
const touchStartX = reactive({}); // 存储触摸开始的X坐标
const touchStartY = reactive({}); // 存储触摸开始的Y坐标
const lastTouchX = reactive({}); // 存储上一次触摸的X坐标
const touchTimeStamp = reactive({}); // 存储触摸开始的时间戳
const touchVelocity = reactive({}); // 存储触摸的速度
const currentOpenItem = ref(null); // 当前打开的项
const BUTTON_WIDTH = 160; // 按钮总宽度
const VELOCITY_THRESHOLD = 0.5; // 速度阈值，超过该值触发惯性滑动
const DISTANCE_THRESHOLD = BUTTON_WIDTH / 2; // 距离阈值，超过该值触发展开/收起

// 处理触摸开始事件
const handleTouchStart = (event, categoryIndex, accountIndex) => {
    const key = `${categoryIndex}-${accountIndex}`;
    const touch = event.touches[0];
    touchStartX[key] = touch.clientX;
    touchStartY[key] = touch.clientY;
    lastTouchX[key] = touch.clientX;
    touchTimeStamp[key] = Date.now();
    touchVelocity[key] = 0;
    isTransitioning[key] = false;

    // 如果有其他项已经打开，且不是当前项，则关闭它
    if (currentOpenItem.value && currentOpenItem.value !== key) {
        swipeOffset[currentOpenItem.value] = 0;
        isTransitioning[currentOpenItem.value] = true;
        currentOpenItem.value = null;
    }
};

// 处理触摸移动事件
const handleTouchMove = (event, categoryIndex, accountIndex) => {
    const key = `${categoryIndex}-${accountIndex}`;
    const touch = event.touches[0];

    // 计算水平和垂直方向的移动距离
    const deltaX = touch.clientX - touchStartX[key];
    const deltaY = touch.clientY - touchStartY[key];

    // 如果垂直滑动距离大于水平滑动距离，则不处理左右滑动
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
        return;
    }

    // 阻止默认滚动行为
    event.preventDefault();

    // 计算当前触摸速度
    const now = Date.now();
    const elapsed = now - touchTimeStamp[key];
    if (elapsed > 0) {
        touchVelocity[key] = (touch.clientX - lastTouchX[key]) / elapsed;
    }
    lastTouchX[key] = touch.clientX;
    touchTimeStamp[key] = now;

    // 限制只能向左滑动（负值）
    let newOffset = Math.min(0, deltaX);
    // 限制最大滑动距离为按钮宽度
    newOffset = Math.max(-BUTTON_WIDTH, newOffset);

    swipeOffset[key] = newOffset;
};

// 处理触摸结束事件
const handleTouchEnd = (event, categoryIndex, accountIndex) => {
    const key = `${categoryIndex}-${accountIndex}`;
    isTransitioning[key] = true;

    // 获取当前偏移量和速度
    const currentOffset = swipeOffset[key] || 0;
    const velocity = touchVelocity[key] || 0;

    // 根据速度和当前偏移量决定是否展开或收起
    if (velocity < -VELOCITY_THRESHOLD || (currentOffset < -DISTANCE_THRESHOLD && velocity >= -VELOCITY_THRESHOLD)) {
        // 速度足够大或者已经拖动超过一半，展开
        swipeOffset[key] = -BUTTON_WIDTH;
        currentOpenItem.value = key;
    } else {
        // 否则收起
        swipeOffset[key] = 0;
        if (currentOpenItem.value === key) {
            currentOpenItem.value = null;
        }
    }
};

// 关闭所有滑动项
const closeAllSwipeItems = () => {
    if (currentOpenItem.value) {
        swipeOffset[currentOpenItem.value] = 0;
        isTransitioning[currentOpenItem.value] = true;
        currentOpenItem.value = null;
    }
};

// 这个钩子已经被合并到上面的 onMounted 钩子中
</script>

<style scoped>
/* 滑动项样式 */
.swipe-item {
    width: 100%;
    background-color: white;
    z-index: 1;
    position: relative;
    transition-property: transform;
    transition-duration: 0.3s;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* 确保操作按钮容器宽度正确 */
.relative {
    position: relative;
}

/* 操作按钮样式 */
.absolute {
    position: absolute;
}

/* 编辑按钮样式 */
.bg-blue-500 {
    background-color: #3b82f6;
}

/* 删除按钮样式 */
.bg-red-500 {
    background-color: #ef4444;
}

/* 按钮文字样式 */
.text-white {
    color: white;
}

/* 按钮悬停效果 */
.bg-blue-500:hover {
    background-color: #2563eb;
}

.bg-red-500:hover {
    background-color: #dc2626;
}

/* 确保按钮高度与列表项一致 */
.absolute button {
    height: 100%;
    min-width: 80px;
    transition: background-color 0.2s;
}
</style>
