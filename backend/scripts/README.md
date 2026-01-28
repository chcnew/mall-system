# Mall System 开发环境部署指南

## 环境要求

- Linux 系统 (Ubuntu/Debian/WSL)
- Docker 和 docker-compose
- Python 3.10+

## 快速开始

### 1. 首次部署 - 设置数据库

```bash
cd /mnt/d/CodeFile/mall-system
chmod +x backend/scripts/*.sh
./backend/scripts/setup-databases.sh
```

这将启动 MySQL 和 Redis 容器。

### 2. 配置环境变量

```bash
cd backend
cp .env.example .env
# 根据需要编辑 .env 文件
```

### 3. 数据库迁移（首次运行必须）

```bash
cd backend
./scripts/migrate.sh
```

这将创建数据库表结构。

### 4. 启动后端服务

```bash
cd backend
./scripts/start-backend.sh
```

后端服务将在 http://localhost:8000 启动。

## 脚本说明

### setup-databases.sh
初始化数据库环境，启动 MySQL 和 Redis 容器。

### start-backend.sh
启动后端服务（非容器化），会自动检查并确保数据库容器在运行。

### stop.sh
停止 MySQL 和 Redis 容器。

### clean.sh
清理所有容器、网络和数据卷（警告：会删除所有数据）。

### migrate.sh
执行数据库迁移，创建或更新数据库表结构。

### create_admin.py
创建管理员账户的脚本。

## 常用命令

### 停止数据库服务

```bash
./backend/scripts/stop.sh
```

### 清理所有数据（危险操作）

```bash
./backend/scripts/clean.sh
```

### 查看 Docker 容器状态

```bash
cd backend
docker-compose ps
```

### 查看容器日志

```bash
cd backend
docker-compose logs -f mysql redis
```

### 进入容器

```bash
cd backend
docker exec -it mall-mysql mysql -uroot -p123456
docker exec -it mall-redis redis-cli
```

## 服务地址

- **后端 API**: http://localhost:8000
- **API 文档**: http://localhost:8000/docs
- **MySQL**: 127.0.0.1:3306 (用户名: root, 密码: 123456)
- **Redis**: 127.0.0.1:6379

## 数据持久化

MySQL 和 Redis 的数据通过 Docker 卷持久化存储：
- `mysql-data`: MySQL 数据
- `redis-data`: Redis 数据

## 环境变量

环境变量配置在 `.env` 文件中，主要配置项：
- `DATABASE_URL`: 数据库连接地址
- `REDIS_URL`: Redis 连接地址
- `SECRET_KEY`: JWT 密钥
- 微信小程序和支付相关配置

## 注意事项

- 本开发环境使用 Docker 运行 MySQL 和 Redis
- 后端服务直接在本地运行（非容器化）
- 确保在运行 `start-backend.sh` 前已执行 `setup-databases.sh`
- 首次运行必须执行 `migrate.sh` 创建数据库表
- Windows 用户请使用 WSL 运行脚本

## 故障排查

1. 端口被占用：修改 docker-compose.yml 中的端口映射
2. MySQL 连接失败：等待 MySQL 完全启动（约10-20秒）
3. Redis 连接失败：检查 Redis 服务状态
4. Python 依赖问题：删除 venv 文件夹后重新运行 `./scripts/start-backend.sh`
5. 数据库表不存在：运行 `./scripts/migrate.sh` 创建表结构
