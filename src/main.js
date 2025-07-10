import { createApp, ref } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/tailwind.css";

const app = createApp(App);

app.config.globalProperties.$iconPath = (name) => {
    // 直接返回处理后的路径
    return `/src/assets/icons/account/${name}`;
};

app.config.globalProperties.$accountCategories = ref([]);

app.config.globalProperties.$categoryMap = ref({
    cash: "现金",
    credit: "信用",
    investment: "投资",
    savings: "储蓄",
    debt: "债务",
    receivable: "债权",
    other: "其他",
});

app.use(router);
app.mount("#app");
