
// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
  // 加载组件
  loadComponent('status-bar', 'components/status-bar.html');
  loadComponent('wallet-header', 'components/wallet-header.html');
  loadComponent('account-list', 'components/account-list.html');
  loadComponent('statistics-page', 'components/statistics-page.html');
  loadComponent('add-account-page', 'components/add-account-page.html');
  loadComponent('bottom-nav', 'components/bottom-nav.html');
  loadComponent('account-modal', 'components/account-modal.html');

  // 模拟加载延迟
  setTimeout(() => {
    document.querySelectorAll('.animate-fade-in').forEach((el, index) => {
      el.style.animationDelay = `${index * 0.1}s`;
    });
  }, 100);

  // 支持通过URL哈希直接访问特定页面
  const hash = window.location.hash;
  if (hash === '#add-account') {
    hideAllPages();
    const addAccountPage = document.getElementById('add-account-page');
          if (addAccountPage) {
            addAccountPage.classList.remove('hidden');
            addAccountPage.style.display = 'block';
            addAccountPage.style.visibility = 'visible';
            addAccountPage.style.opacity = '1';
          }
  }
});

// 加载组件函数
function loadComponent(elementId, url) {
  const element = document.getElementById(elementId);
  if (!element) return Promise.resolve(); // 返回已解决的promise如果元素不存在

  return fetch(url)
    .then(response => response.text())
    .then(data => {
      element.innerHTML = data;

      // 组件加载完成后执行相关操作
      if (elementId === 'wallet-header') {
        initHeaderEvents();
      } else if (elementId === 'bottom-nav') {
        initBottomNavEvents();
      } else if (elementId === 'account-modal') {
        initModalEvents();
      } else if (elementId === 'statistics-page') {
        initStatisticsPageEvents();
      } else if (elementId === 'account-list') {
        initAccountListEvents();
      } else if (elementId === 'add-account-page') {
        initAddAccountPageEvents();
      }
    })
    .catch(error => {
      console.error(`Failed to load component ${elementId} from ${url}:`, error);
      element.innerHTML = `<div class="p-4 text-center text-red-500">Failed to load component</div>`;
    });
}

// 初始化头部事件
function initHeaderEvents() {
  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function () {
      this.classList.add('animate-spin');
      setTimeout(() => {
        this.classList.remove('animate-spin');
        // 模拟数据刷新效果
        const netWorthElement = document.querySelector('.animate-pulse-subtle');
        if (netWorthElement) {
          netWorthElement.style.opacity = '0.5';
          setTimeout(() => {
            netWorthElement.style.opacity = '1';
          }, 300);
        }
      }, 800);
    });
  }
}

// 初始化底部导航事件
function initBottomNavEvents() {
  // 导航到统计分析页面
  const statsBtn = document.querySelector('.fa-pie-chart').parentElement;
  if (statsBtn) {
    statsBtn.addEventListener('click', () => {
      hideAllPages();
      document.getElementById('statistics-page').classList.remove('hidden');
    });
  }

  // 导航到钱包主页面
  const walletBtn = document.querySelector('.fa-wallet').parentElement;
  if (walletBtn) {
    walletBtn.addEventListener('click', () => {
      hideAllPages();
      document.getElementById('account-list').classList.remove('hidden');
    });
  }
}

// 初始化模态框事件
function initModalEvents() {
  const accountModal = document.getElementById('account-modal');
  const addAccountTypeBtn = document.getElementById('add-account-type-btn');
  const closeModalBtn = document.getElementById('close-modal');

  if (addAccountTypeBtn && accountModal) {
    // 打开账户类型选择弹窗
    addAccountTypeBtn.addEventListener('click', () => {
      accountModal.classList.remove('hidden');
    });
  }

  if (closeModalBtn && accountModal) {
    // 关闭账户类型选择弹窗
    closeModalBtn.addEventListener('click', () => {
      accountModal.classList.add('hidden');
    });
  }

  // 点击模态框背景关闭
  if (accountModal) {
    accountModal.addEventListener('click', (e) => {
      if (e.target === accountModal) {
        accountModal.classList.add('hidden');
      }
    });
  }
}

// 初始化统计页面事件
function initStatisticsPageEvents() {
  const countBtn = document.getElementById('count-btn');
  if (countBtn) {
    countBtn.addEventListener('click', () => {
      hideAllPages();
      document.getElementById('statistics-page').classList.remove('hidden');
    });
  }
}

// 初始化账户列表事件
function initAccountListEvents() {
  const addAccountBtn = document.getElementById('add-account');
  const accountModal = document.getElementById('account-modal');

  if (addAccountBtn && accountModal) {
    addAccountBtn.addEventListener('click', () => {
      accountModal.classList.remove('hidden');
    });
  }
}

// 初始化添加账户页面事件
  function initAddAccountPageEvents() {
    const backBtn2 = document.getElementById('back-btn-2');
    const addAccountBtn = document.getElementById('add-account-button');
    
    if (backBtn2) {
      backBtn2.addEventListener('click', () => {
        hideAllPages();
        document.getElementById('account-list').classList.remove('hidden');
      });
    }
    
    if (addAccountBtn) {
      addAccountBtn.addEventListener('click', () => {
        hideAllPages();
        document.getElementById('add-account-page').classList.remove('hidden');
      });
    }
  }

// 隐藏所有页面
function hideAllPages() {
  const pages = ['account-list', 'statistics-page', 'add-account-page'];
  pages.forEach(page => {
    const element = document.getElementById(page);
    if (element) {
      element.classList.add('hidden');
    }
  });
}
