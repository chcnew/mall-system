#!/bin/bash

echo "=================================="
echo "Mall System 安装脚本"
echo "=================================="

cd "$(dirname "$0")"

if [ ! -f ".env" ]; then
    echo "未找到 .env 文件，正在创建..."
    cp .env.example .env
    echo "✓ 已创建 .env 文件"
fi

echo "[1/6] 检查 Docker 环境..."
if ! docker ps > /dev/null 2>&1; then
    echo "✗ Docker 未运行，请先启动 Docker"
    exit 1
fi
echo "✓ Docker 环境正常"

echo ""
echo "[2/6] 启动数据库容器..."
docker-compose up -d mysql redis
echo "✓ 数据库容器已启动"

echo ""
echo "[3/6] 创建虚拟环境..."
if [ ! -f ".venv/bin/activate" ]; then
    echo "虚拟环境不存在，正在创建..."
    uv venv .venv
fi
source .venv/bin/activate
echo "✓ 虚拟环境已激活"

echo ""
echo "[4/6] 安装依赖..."
uv sync
echo "✓ 依赖安装完成"

echo ""
echo "[5/6] 执行数据库迁移..."
alembic upgrade head
if [ $? -eq 0 ]; then
    echo "✓ 数据库迁移成功"
else
    echo "✗ 数据库迁移失败"
    exit 1
fi

echo ""
echo "[6/6] 创建管理员账户..."
python scripts/create_admin.py

echo ""
echo "=================================="
echo "安装完成！"
echo "=================================="
echo "启动服务: ./scripts/start-backend.sh"
echo "停止数据库: ./scripts/stop.sh"
echo "数据库迁移: ./scripts/migrate.sh"
echo "=================================="
