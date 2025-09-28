#!/bin/bash

# 部署脚本：esop-admin 应用
# 用法：./deploy.sh [版本标签]

set -e  # 遇到错误立即退出

# 配置参数
APP_NAME="esop-admin"
DOCKERFILE="dockerfile"
PORT_HOST=8097
PORT_CONTAINER=8080
IMAGE_NAME="esop-admin"
VERSION=${1:-v1}  # 允许通过参数指定版本号

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# 1. 拉取最新代码
log "开始拉取最新代码..."
git pull
if [ $? -ne 0 ]; then
    log "错误：代码拉取失败"
    exit 1
fi

# 2. 构建 Docker 镜像
log "开始构建 Docker 镜像 ($IMAGE_NAME:$VERSION)..."
docker build -t $IMAGE_NAME:$VERSION -f $DOCKERFILE .
if [ $? -ne 0 ]; then
    log "错误：Docker 构建失败"
    exit 1
fi

# 3. 停止并移除旧容器
log "停止并移除旧容器..."
docker stop $APP_NAME >/dev/null 2>&1 || log "警告：停止旧容器失败（可能不存在）"
docker rm $APP_NAME >/dev/null 2>&1 || log "警告：移除旧容器失败（可能不存在）"

# 4. 运行新容器
log "启动新容器 ($IMAGE_NAME:$VERSION)..."
docker run -d \
  --name $APP_NAME \
  -p $PORT_HOST:$PORT_CONTAINER \
  -e NODE_ENV=production \
  --restart unless-stopped \
  $IMAGE_NAME:$VERSION

# 5. 验证部署
log "等待容器启动..."
sleep 3  # 等待容器初始化

# 检查容器状态
CONTAINER_STATUS=$(docker inspect -f '{{.State.Status}}' $APP_NAME)
if [ "$CONTAINER_STATUS" != "running" ]; then
    log "错误：容器启动失败"
    docker logs $APP_NAME
    exit 1
fi

# 6. 打印部署信息
log "部署成功完成!"
echo "======================================"
echo "应用名称: $APP_NAME"
echo "镜像版本: $IMAGE_NAME:$VERSION"
echo "访问地址: http://localhost:$PORT_HOST"
echo "容器状态: $(docker inspect -f '{{.State.Status}}' $APP_NAME)"
echo "启动时间: $(docker inspect -f '{{.State.StartedAt}}' $APP_NAME)"
echo "======================================"

# 7. 显示最近日志
log "最近日志 (最后10行):"
docker logs --tail 10 $APP_NAME
