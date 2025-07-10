import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'

const app = createApp(App)

app.config.globalProperties.$iconPath = (name) => {
  // 直接返回处理后的路径
  return `/src/assets/icons/account/${name}`;
}

app.use(router)
app.mount('#app')