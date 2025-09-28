# 构建阶段 - 使用 Yarn
FROM node:18.20.0-alpine3.19 AS builder

# 安装 Yarn
RUN apk add --no-cache yarn

WORKDIR /app

# 复制 package 文件并安装依赖
COPY package*.json ./
# COPY yarn.lock ./
RUN yarn install --frozen-lockfile

# 复制源代码并构建
COPY . .
RUN yarn build

# 生产阶段 - 使用 Nginx
FROM nginx:1.25.3-alpine

# 设置非 root 用户和权限
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup && \
    chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /var/log/nginx && \
    chown -R appuser:appgroup /etc/nginx/conf.d

# 复制构建产物到 Nginx 目录
COPY --from=builder --chown=appuser:appgroup /app/dist /usr/share/nginx/html

# 复制自定义 Nginx 配置（确保监听 8080 端口）
COPY nginx.conf /etc/nginx/conf.d/default.conf


# 复制自定义 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 设置权限
RUN chown -R appuser:appgroup /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# 切换到非 root 用户
USER appuser

# 暴露端口
EXPOSE 8080

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
