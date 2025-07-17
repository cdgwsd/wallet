# 基于Node.js 22.14.0 Alpine版本构建环境
FROM node:22.14.0-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
# 安装并行启动工具（如需）
RUN npm install concurrently --save-dev

COPY . .

EXPOSE 5173 3000
CMD ["npx", "concurrently", "npm:dev", "npm:server"]