// API服务，用于与后端通信

/**
 * 获取指定类型的数据
 * @param {string} type - 数据类型，如'accounts'或'transactions'
 * @returns {Promise<Array>} - 返回数据数组
 */
export async function fetchData(type) {
    try {
        const response = await fetch(`http://${window.location.hostname}:3000/api/get-data/${type}`);
        if (!response.ok) {
            throw new Error(`获取${type}数据失败: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`获取${type}数据出错:`, error);
        return [];
    }
}

/**
 * 保存数据到服务器
 * @param {string} type - 数据类型，如'accounts'或'transactions'
 * @param {Object} data - 要保存的数据对象
 * @returns {Promise<Object>} - 返回保存结果
 */
export async function saveData(type, data) {
    try {
        const response = await fetch(`http://${window.location.hostname}:3000/api/save-data`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ type, data }),
        });

        if (!response.ok) {
            throw new Error(`保存${type}数据失败: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`保存${type}数据出错:`, error);
        throw error;
    }
}

/**
 * 更新数据到服务器
 * @param {string} type - 数据类型，如'accounts'或'transactions'
 * @param {Object} data - 要更新的数据对象，必须包含id字段
 * @returns {Promise<Object>} - 返回更新结果
 */
export async function updateData(type, data) {
    if (!data.id) {
        throw new Error('更新数据必须包含id字段');
    }
    
    try {
        const response = await fetch(`http://${window.location.hostname}:3000/api/update-data`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ type, data }),
        });

        if (!response.ok) {
            throw new Error(`更新${type}数据失败: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`更新${type}数据出错:`, error);
        throw error;
    }
}

/**
 * 删除账户数据
 * @param {string} accountId - 要删除的账户id
 * @returns {Promise<Object>} - 返回保存结果
 */
export async function deleteData(accountId) {
    try {
        const response = await fetch(`http://${window.location.hostname}:3000/api/delete-data/${accountId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`删除${accountId}数据失败: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`删除${accountId}数据出错:`, error);
        throw error;
    }
}

/**
 * 根据账户类型对账户列表进行分组
 * @param {Object} accounts - 账户列表
 * @returns {Object} 分组后的账户数组
 */
export function groupAccountsByType(account) {
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
    var categoryTypes = Object.keys(categoryMap);
    var result = null;

    for (var i = 0; i < categoryTypes.length; i++) {
        var type = categoryTypes[i];

        if (account.type === type) {
            result = {
                name: categoryMap[type],
                accounts: [account],
            };
            break;
        }
    }

    return result;
}

/**
 * 获取所有账户数据并按类型分组
 * @returns {Promise<Array>} - 返回按类型分组的账户数据
 */
export async function fetchAccountsByCategory() {
    try {
        const accounts = await fetchData("accounts");

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
        
        // 创建分组对象
        const groupsMap = {};
        
        // 遍历所有账户，按类型分组
        for (var i = 0; i < accounts.length; i++) {
            var account = accounts[i];
            var type = account.type;
            
            // 如果该类型不存在，创建新分组
            if (!groupsMap[type] && categoryMap[type]) {
                groupsMap[type] = {
                    name: categoryMap[type],
                    accounts: []
                };
            }
            
            // 将账户添加到对应分组
            if (groupsMap[type]) {
                groupsMap[type].accounts.push(account);
            }
        }
        
        // 转换为数组
        const groupedAccounts = Object.values(groupsMap);
        
        // 过滤掉空分组
        const filteredGroups = groupedAccounts.filter(group => group.accounts.length > 0);

        // 返回过滤后的分组结果
        return filteredGroups;
    } catch (error) {
        console.error("获取分类账户数据出错:", error);
        return [];
    }
}
