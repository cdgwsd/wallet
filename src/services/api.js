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

        const groupedAccounts = [];
        for (var i = 0; i < accounts.length; i++) {
            var account = accounts[i];
            var group = groupAccountsByType(account);
            if (group) {
                groupedAccounts.push(group);
            }
        }

        // const groupedAccounts = Object.keys(categoryMap).map((type) => ({
        //     name: categoryMap[type],
        //     accounts: accounts.filter((account) => account.type === type),
        // }));

        return groupedAccounts;
    } catch (error) {
        console.error("获取分类账户数据出错:", error);
        return [];
    }
}
