#!/bin/bash

echo "=================================="
echo "Mall System 数据库环境部署"
echo "=================================="

cd "$(dirname "$0")/.."

echo "[1/3] 检查 Docker 环境..."
if ! command -v docker &> /dev/null; then
    echo "✗ Docker 未安装，请先安装 Docker"
    exit 1
fi
if ! command -v docker-compose &> /dev/null; then
    echo "✗ docker-compose 未安装，请先安装 docker-compose"
    exit 1
fi
echo "✓ Docker 环境检查通过"

echo ""
echo "[2/3] 启动 MySQL 和 Redis 容器..."
docker-compose up -d mysql redis

if [ $? -eq 0 ]; then
    echo "✓ 容器启动成功"
else
    echo "✗ 容器启动失败"
    exit 1
fi

echo ""
echo "[3/3] 等待服务就绪..."
sleep 5

echo ""
echo "检查容器状态..."
docker-compose ps mysql redis

echo ""
echo "=================================="
echo "部署完成！"
echo "=================================="
echo "MySQL: localhost:3306"
echo "  用户名: root"
echo "  密码: 123456"
echo "  数据库: mall"
echo ""
echo "Redis: localhost:6379"
echo ""
echo "常用命令:"
echo "  查看日志: docker-compose logs -f mysql redis"
echo "  停止服务: docker-compose stop mysql redis"
echo "  重启服务: docker-compose restart mysql redis"
echo "  删除容器: docker-compose down"
echo "=================================="
