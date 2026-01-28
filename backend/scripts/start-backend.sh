#!/bin/bash

echo "=================================="
echo "Mall System 后端服务启动"
echo "=================================="

cd "$(dirname "$0")/.."

if [ ! -f ".env" ]; then
    echo "未找到 .env 文件，正在创建..."
    cp .env.example .env
fi

echo "[1/5] 检查 Docker 环境..."
if ! docker ps > /dev/null 2>&1; then
    echo "✗ Docker 未运行，请先启动 Docker"
    exit 1
fi
echo "✓ Docker 环境正常"

echo ""
echo "[2/5] 检查 MySQL 和 Redis 容器状态..."
MYSQL_STATUS=$(docker inspect -f '{{.State.Status}}' mall-mysql 2>/dev/null)
REDIS_STATUS=$(docker inspect -f '{{.State.Status}}' mall-redis 2>/dev/null)

if [ "$MYSQL_STATUS" != "running" ]; then
    echo "MySQL 容器未运行，正在启动..."
    docker-compose up -d mysql
fi

if [ "$REDIS_STATUS" != "running" ]; then
    echo "Redis 容器未运行，正在启动..."
    docker-compose up -d redis
fi

echo "✓ 数据库服务状态正常"

echo ""
echo "[3/5] 检查虚拟环境..."
if [ ! -f ".venv/bin/activate" ]; then
    echo "虚拟环境不存在，正在创建..."
    uv venv .venv
fi

source .venv/bin/activate
echo "✓ 虚拟环境已激活"

echo ""
echo "[4/5] 安装/更新依赖..."
uv sync
echo "✓ 依赖已就绪"

echo ""
echo "[5/5] 启动后端服务..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
