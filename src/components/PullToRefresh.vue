<template>
  <div class="pull-to-refresh" ref="pullToRefreshContainer">
    <div class="pull-to-refresh-indicator" :style="indicatorStyle">
      <div class="pull-to-refresh-spinner" v-if="refreshing">
        <i class="fa fa-refresh fa-spin"></i>
      </div>
      <div class="pull-to-refresh-arrow" v-else :class="{ 'rotate': pullDistance > threshold }">
        <i class="fa fa-arrow-down"></i>
      </div>
      <div class="pull-to-refresh-text">{{ refreshText }}</div>
    </div>
    <div class="pull-to-refresh-content" :style="contentStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  threshold: {
    type: Number,
    default: 60
  },
  maxDistance: {
    type: Number,
    default: 100
  },
  refreshing: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['refresh']);

const pullToRefreshContainer = ref(null);
const pullDistance = ref(0);
const touching = ref(false);
const startY = ref(0);
const isStandalone = ref(false);

// 检查是否为 PWA 模式
onMounted(() => {
  // 检查是否为 PWA 模式（iOS 和 Android 兼容）
  isStandalone.value = window.matchMedia('(display-mode: standalone)').matches || 
                      window.navigator.standalone || 
                      document.referrer.includes('android-app://') ||
                      window.location.search.includes('source=pwa');
  
  // 添加触摸事件监听器
  if (pullToRefreshContainer.value) {
    pullToRefreshContainer.value.addEventListener('touchstart', handleTouchStart, { passive: false });
    pullToRefreshContainer.value.addEventListener('touchmove', handleTouchMove, { passive: false });
    pullToRefreshContainer.value.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // 在 iOS PWA 模式下特别处理
    if (isStandalone.value && /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())) {
      // 防止 iOS 的橡皮筋效果干扰下拉刷新
      pullToRefreshContainer.value.style.overscrollBehavior = 'none';
      pullToRefreshContainer.value.style.webkitOverflowScrolling = 'touch';
    }
  }
  
  // 监听 PWA 恢复事件，重置下拉刷新状态
  window.addEventListener('pwa-resume', () => {
    pullDistance.value = 0;
    touching.value = false;
  });
});

onUnmounted(() => {
  // 移除触摸事件监听器
  if (pullToRefreshContainer.value) {
    pullToRefreshContainer.value.removeEventListener('touchstart', handleTouchStart);
    pullToRefreshContainer.value.removeEventListener('touchmove', handleTouchMove);
    pullToRefreshContainer.value.removeEventListener('touchend', handleTouchEnd);
  }
  
  // 移除 PWA 恢复事件监听器
  window.removeEventListener('pwa-resume', () => {
    pullDistance.value = 0;
    touching.value = false;
  });
});

const handleTouchStart = (e) => {
  if (props.disabled || props.refreshing) return;
  
  const touch = e.touches[0];
  startY.value = touch.clientY;
  touching.value = true;
};

const handleTouchMove = (e) => {
  if (!touching.value || props.disabled || props.refreshing) return;
  
  const touch = e.touches[0];
  const y = touch.clientY;
  
  // 获取滚动位置，兼容各种浏览器和 WebView
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset || 0;
  
  // 只有当滚动到顶部或接近顶部时才允许下拉（增加一点容差）
  if (scrollTop <= 2) {
    const distance = Math.max(0, y - startY.value);
    
    // 应用阻尼效果，使下拉变得越来越困难
    // 在 PWA 模式下减小阻尼系数，使下拉更灵敏
    const dampFactor = isStandalone.value ? 0.7 : 0.5;
    pullDistance.value = Math.min(props.maxDistance, distance * dampFactor);
    
    // 如果下拉距离大于0，阻止默认滚动行为
    if (pullDistance.value > 0) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
};

const handleTouchEnd = () => {
  if (!touching.value || props.disabled || props.refreshing) return;
  
  touching.value = false;
  
  // 如果下拉距离超过阈值，触发刷新
  if (pullDistance.value >= props.threshold) {
    emit('refresh');
  }
  
  // 重置下拉距离
  pullDistance.value = 0;
};

// 计算指示器样式
const indicatorStyle = computed(() => {
  return {
    height: `${props.threshold}px`,
    transform: props.refreshing ? 'translateY(0)' : `translateY(${Math.min(0, pullDistance.value - props.threshold)}px)`,
    opacity: props.refreshing ? 1 : pullDistance.value / props.threshold,
    visibility: (pullDistance.value > 0 || props.refreshing) ? 'visible' : 'hidden'
  };
});

// 计算内容样式
const contentStyle = computed(() => {
  return {
    transform: props.refreshing ? `translateY(${props.threshold}px)` : `translateY(${pullDistance.value}px)`,
    transition: touching.value ? 'none' : 'transform 0.3s',
    paddingTop: props.refreshing ? '0' : null
  };
});

// 计算刷新文本
const refreshText = computed(() => {
  if (props.refreshing) {
    return '正在刷新...';
  }
  return pullDistance.value > props.threshold ? '释放立即刷新' : '下拉刷新';
});
</script>

<style scoped>
.pull-to-refresh {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* 防止iOS橡皮筋效果干扰下拉刷新 */
  overscroll-behavior-y: none;
  -webkit-overflow-scrolling: touch;
}

.pull-to-refresh-indicator {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60px;
  color: #666;
  font-size: 14px;
  z-index: 100;
  /* 添加模糊背景效果 */
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 0 0 12px 12px;
  padding-top: env(safe-area-inset-top);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.pull-to-refresh-spinner {
  margin-bottom: 5px;
  font-size: 18px;
  color: #3498db;
}

.pull-to-refresh-arrow {
  margin-bottom: 5px;
  transition: transform 0.2s;
  font-size: 18px;
  color: #3498db;
}

.pull-to-refresh-arrow.rotate {
  transform: rotate(180deg);
}

.pull-to-refresh-text {
  font-size: 12px;
  font-weight: 500;
}

.pull-to-refresh-content {
  min-height: 100%;
  will-change: transform;
  /* 确保内容在iOS上平滑滚动 */
  -webkit-overflow-scrolling: touch;
}
</style>