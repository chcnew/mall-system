#!/bin/bash

echo "=================================="
echo "Mall System 数据库迁移"
echo "=================================="

cd "$(dirname "$0")/.."

export PYTHONPATH="${PYTHONPATH}:$(pwd)"

if [ ! -f ".env" ]; then
    echo "未找到 .env 文件，正在创建..."
    cp .env.example .env
    echo "✓ 已创建 .env 文件"
fi

if [ -f ".venv/bin/activate" ]; then
    source .venv/bin/activate
else
    echo "✗ 未找到虚拟环境 .venv"
    exit 1
fi

if [ ! -d "alembic/versions" ]; then
    echo "创建 alembic/versions 目录..."
    mkdir -p alembic/versions
fi

echo ""
echo "[1/2] 创建数据库迁移文件..."
alembic revision --autogenerate -m "init"

if [ $? -eq 0 ]; then
    echo "✓ 迁移文件创建成功"
else
    echo "✗ 迁移文件创建失败"
    exit 1
fi

echo ""
echo "[2/2] 执行数据库迁移..."
alembic upgrade head

if [ $? -eq 0 ]; then
    echo "✓ 数据库迁移成功"
else
    echo "✗ 数据库迁移失败"
    exit 1
fi

echo ""
echo "=================================="
echo "数据库迁移完成！"
echo "=================================="
