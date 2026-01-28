#!/bin/bash

echo "=================================="
echo "Mall System 清理脚本"
echo "=================================="
echo "⚠️  警告: 此操作将删除所有数据卷！"
echo ""

# shellcheck disable=SC2162
read -p "确认清理？(y/N): " confirm

if [[ $confirm =~ ^[Yy]$ ]]; then
    cd "$(dirname "$0")/.."
    echo "停止并删除 MySQL 和 Redis 容器、网络、数据卷..."
    docker-compose down -v mysql redis
    echo "✓ 清理完成"
else
    echo "已取消清理"
fi
