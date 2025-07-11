<template>
    <div class="p-4 md:p-6">
        <div class="flex justify-between items-center mb-4 md:mb-6">
            <button id="back-btn-2" class="text-gray-600 hover:text-primary transition-colors" @click="goBack">
                <img src="@/assets/icons/arrow-left.svg" class="w-6 h-6" />
            </button>
            <h2 class="font-semibold text-gray-800 text-lg md:text-xl">{{ isEditMode ? '编辑账户' : '添加新的账户' }}</h2>
            <button class="text-gray-600 hover:text-primary transition-colors">
                <i class="fa fa-question-circle"></i>
            </button>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-4 md:mb-6 animate-fade-in">
            <!-- 在平板和桌面端使用两列布局 -->
            <div class="md:grid md:grid-cols-2 md:gap-6">
                <div class="mb-4 md:mb-0">
                    <label class="block text-sm md:text-base font-medium text-gray-700 mb-1 md:mb-2">账户类型</label>
                    <div class="relative">
                        <select
                            v-model="accountType"
                            class="w-full px-3 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none text-sm md:text-base"
                        >
                            <option v-for="type in accountTypes" :key="type.value" :value="type.value">
                                {{ type.label }}
                            </option>
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <i class="fa fa-chevron-down text-xs md:text-sm"></i>
                        </div>
                    </div>
                </div>

                <div class="mb-4 md:mb-0">
                    <label class="block text-sm md:text-base font-medium text-gray-700 mb-1 md:mb-2">账户名称</label>
                    <div class="flex space-x-2">
                        <input
                            v-model="accountName"
                            type="text"
                            class="flex-1 px-3 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
                            placeholder="例如：招商银行储蓄卡"
                        />
                        <button @click="showIconSelector = true" class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" title="选择图标">
                            <img v-if="selectedIcon" :src="$iconPath(selectedIcon)" class="w-6 h-6" />
                            <img v-else src="@/assets/icons/account/wallet.svg" class="text-gray-500 w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            <div class="md:mt-6">
                <div class="mb-4">
                    <label class="block text-sm md:text-base font-medium text-gray-700 mb-1 md:mb-2">初始化余额</label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-sm md:text-base">¥</span>
                        <input
                            v-model="initialBalance"
                            type="text"
                            class="w-full pl-8 pr-3 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div class="mb-4">
                    <label class="block text-sm md:text-base font-medium text-gray-700 mb-1 md:mb-2">备注</label>
                    <textarea
                        v-model="notes"
                        class="w-full px-3 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
                        rows="3"
                        placeholder="添加一些备注信息（可选）"
                    ></textarea>
                </div>
            </div>
        </div>

        <button
            class="w-full py-3 md:py-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors animate-fade-in text-sm md:text-base"
            style="animation-delay: 0.2s"
            @click="isEditMode ? updateAccount() : addAccount()"
        >
            {{ isEditMode ? '保存修改' : '添加账户' }}
        </button>

        <!-- 图标选择模态框 -->
        <div v-if="showIconSelector" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[80vh] overflow-hidden">
                <div class="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 class="font-medium text-gray-800">选择账户图标</h3>
                    <button @click="showIconSelector = false" class="text-gray-500 hover:text-gray-700">
                        <i class="fa fa-times"></i>
                    </button>
                </div>
                <div class="p-4 grid grid-cols-5 gap-4 overflow-y-auto max-h-[calc(80vh-100px)]">
                    <div v-for="icon in iconList" :key="icon" @click="selectIcon(icon)" class="flex flex-col items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                        <img :src="$iconPath(icon)" class="w-10 h-10 mb-1" :alt="icon" />
                        <span class="text-xs text-gray-600">{{ icon.replace(".svg", "") }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, triggerRef, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { saveData, fetchData, groupAccountsByType, updateData } from "../services/api.js";

const router = useRouter();
const route = useRoute();
const internalInstance = getCurrentInstance();
const { $accountCategories } = internalInstance.appContext.config.globalProperties;

// 判断是否为编辑模式
const isEditMode = computed(() => {
    return route.params.id !== undefined;
});

// 当前编辑的账户ID
const currentAccountId = ref(null);

// 账户类型选项
const accountTypes = [
    { value: "cash", label: "现金账户" },
    { value: "credit", label: "信用账户" },
    { value: "investment", label: "投资账户" },
    { value: "savings", label: "储蓄账户" },
    { value: "debt", label: "负债" },
    { value: "receivable", label: "债权" },
    { value: "other", label: "其他账户" },
];

// 表单数据
const accountType = ref("cash");
const accountName = ref("");
const initialBalance = ref("");
const notes = ref("");
const showIconSelector = ref(false);
const selectedIcon = ref("");
// 动态导入assets/account目录下的所有SVG图标
const iconModules = import.meta.glob("@/assets/icons/account/*.svg", { eager: true });
const iconList = ref(
    Object.keys(iconModules).map((path) => {
        const filename = path.split("/").pop();
        return filename;
    })
);

const selectIcon = (icon) => {
    selectedIcon.value = icon;
    showIconSelector.value = false;
};

// 加载账户数据
const loadAccountData = async (id) => {
    try {
        // 获取所有账户数据
        const accounts = await fetchData("accounts");
        // 查找指定ID的账户
        const account = accounts.find(acc => acc.id == id);
        
        if (account) {
            // 设置当前账户ID
            currentAccountId.value = account.id;
            // 填充表单数据
            accountType.value = account.type;
            accountName.value = account.name;
            initialBalance.value = account.balance.toString();
            notes.value = account.description || "";
            selectedIcon.value = account.icon;
        } else {
            alert("未找到指定账户");
            goBack();
        }
    } catch (error) {
        console.error("加载账户数据失败:", error);
        alert("加载账户数据失败");
        goBack();
    }
};

// 从路由参数中获取账户类型或加载编辑账户数据
onMounted(() => {
    if (isEditMode.value) {
        // 编辑模式，加载账户数据
        loadAccountData(route.params.id);
    } else if (route.query.type) {
        // 新增模式，设置账户类型
        accountType.value = route.query.type;
    }
});

// 返回上一页（关闭模态框）
const goBack = () => {
    // 使用history.back()而不是router.push，这样不会重新加载主页
    history.back();
};

// 表单验证
const validateForm = () => {
    if (!accountName.value.trim()) {
        alert("请输入账户名称");
        return false;
    }

    if (!initialBalance.value.trim()) {
        initialBalance.value = "0";
    }
    
    return true;
};

// 添加账户
const addAccount = async () => {
    // 表单验证
    if (!validateForm()) return;

    // 创建账户对象
    const newAccount = {
        id: Date.now(), // 使用时间戳作为临时ID
        type: accountType.value,
        name: accountName.value,
        description: notes.value || accountTypes.find((t) => t.value === accountType.value)?.label || "",
        balance: parseFloat(initialBalance.value) || 0,
        icon: selectedIcon.value || "wallet.svg",
        createdAt: new Date().toISOString(),
    };

    try {
        // 保存到服务器
        await saveData("accounts", newAccount);

        // 定义账户类型映射
        const categoryMap = {
            cash: "现金",
            credit: "信用",
            investment: "投资",
            savings: "储蓄",
            debt: "债务",
            receivable: "债权",
            other: "其他",
        };
        
        // 查找是否已存在该类型的分类
        const existingCategoryIndex = $accountCategories.value.findIndex(category => 
            category.name === categoryMap[newAccount.type]
        );
        
        if (existingCategoryIndex !== -1) {
            // 如果已存在该类型的分类，将新账户添加到该分类中
            $accountCategories.value[existingCategoryIndex].accounts.push(newAccount);
        } else {
            // 如果不存在该类型的分类，创建新分类
            if (categoryMap[newAccount.type]) {
                $accountCategories.value.push({
                    name: categoryMap[newAccount.type],
                    accounts: [newAccount]
                });
            }
        }

        // 添加成功后返回账户列表页面
        history.back();
    } catch (error) {
        console.error("保存账户失败:", error);
        alert("保存账户失败，请重试");
    }
};

// 更新账户
const updateAccount = async () => {
    // 表单验证
    if (!validateForm()) return;
    
    // 创建更新后的账户对象
    const updatedAccount = {
        id: currentAccountId.value,
        type: accountType.value,
        name: accountName.value,
        description: notes.value || accountTypes.find((t) => t.value === accountType.value)?.label || "",
        balance: parseFloat(initialBalance.value) || 0,
        icon: selectedIcon.value || "wallet.svg",
        updatedAt: new Date().toISOString(),
    };

    try {
        // 保存到服务器
        await updateData("accounts", updatedAccount);
        
        // 更新本地数据
        // 遍历所有分类，找到并更新对应的账户
        $accountCategories.value = $accountCategories.value.map(category => {
            // 检查该分类中是否有要更新的账户
            const accountIndex = category.accounts.findIndex(acc => acc.id == currentAccountId.value);
            
            if (accountIndex !== -1) {
                // 如果账户类型没变，直接更新该账户
                if (category.accounts[accountIndex].type === updatedAccount.type) {
                    category.accounts[accountIndex] = updatedAccount;
                } else {
                    // 如果账户类型变了，从当前分类中移除
                    category.accounts.splice(accountIndex, 1);
                }
            }
            
            return category;
        }).filter(category => category.accounts.length > 0); // 移除空分类
        
        // 如果账户类型变了，可能需要添加到新分类
        const existingCategory = $accountCategories.value.find(cat => {
            return cat.accounts.some(acc => acc.id == currentAccountId.value);
        });
        
        if (!existingCategory) {
            // 账户不在任何分类中，说明类型已变更，添加到新分类
            const categoryMap = {
                cash: "现金",
                credit: "信用",
                investment: "投资",
                savings: "储蓄",
                debt: "债务",
                receivable: "债权",
                other: "其他",
            };
            
            // 创建新的分类并添加账户
            if (categoryMap[updatedAccount.type]) {
                $accountCategories.value.push({
                    name: categoryMap[updatedAccount.type],
                    accounts: [updatedAccount]
                });
            }
        }

        // 更新成功后返回账户列表页面
        history.back();
    } catch (error) {
        console.error("更新账户失败:", error);
        alert("更新账户失败，请重试");
    }
};
</script>
