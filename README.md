# 钱包UI组件库

这是一个基于Vue 3和Tailwind CSS的钱包UI组件库，支持账户管理和数据持久化。

## 功能特点

- 账户管理：添加、查看不同类型的账户
- 数据持久化：使用lowdb存储账户数据
- 响应式设计：适配移动端、平板和桌面端
- 美观的UI：基于Tailwind CSS构建的现代界面

## 安装依赖

```bash
npm install
```

## 启动应用

### 1. 启动后端服务器

```bash
npm run server
```

这将启动Express服务器，用于处理数据持久化请求。服务器默认运行在 http://localhost:3000。

### 2. 启动前端开发服务器

```bash
npm run dev
```

前端开发服务器将运行在 http://localhost:5173 (或其他可用端口)。

## 项目结构

```
├── data/               # 数据存储目录
│   └── db.json         # lowdb数据库文件
├── src/                # 源代码目录
│   ├── assets/         # 静态资源
│   ├── components/     # 组件
│   ├── services/       # 服务
│   │   └── api.js      # API服务
│   ├── views/          # 页面
│   ├── App.vue         # 主应用组件
│   └── main.js         # 入口文件
├── server.js           # 后端服务器
└── package.json        # 项目配置
```

## 数据持久化

应用使用lowdb进行数据持久化，数据存储在`data/db.json`文件中。主要包含以下数据：

- `accounts`: 账户数据
- `transactions`: 交易数据（未来扩展）

## 开发指南

### 添加新账户

1. 访问账户列表页面
2. 点击添加账户按钮
3. 填写账户信息并提交

### 自定义API服务

可以在`src/services/api.js`文件中扩展API服务，添加新的数据操作方法。

## 许可证

MIT