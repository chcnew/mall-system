#!/bin/bash

echo "=================================="
echo "Mall System 停止脚本"
echo "=================================="

cd "$(dirname "$0")/.."

echo "停止 MySQL 和 Redis 容器..."
docker-compose stop mysql redis

echo "✓ 数据库服务已停止"
echo ""
echo "如需完全删除容器和数据，运行: ./scripts/clean.sh"
