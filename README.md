# 微信商城小程序系统

基于微信小程序 + Vue3后台管理 + FastAPI后端的完整电商系统。

## 项目结构

```
mall-system/
├── miniprogram/      # 微信小程序前端
├── admin/            # Vue3 后台管理系统
├── backend/          # FastAPI 后端服务
├── docs/             # 项目文档
└── docker-compose.yml # Docker 部署配置
```

## 技术栈

### 前端
- **小程序**: 原生微信小程序
- **后台管理**: Vue 3 + TypeScript + Vite + Element Plus + ECharts

### 后端
- **框架**: FastAPI 0.109.0
- **数据库**: MySQL 8.0
- **缓存**: Redis 7.0
- **ORM**: SQLAlchemy 2.0
- **认证**: JWT
- **任务队列**: Celery

## 快速开始

### 环境要求
- Python 3.11+
- Node.js 18+
- MySQL 8.0
- Redis 7.0

### 1. 安装后端依赖

```bash
cd backend
pip install -r requirements.txt
```

### 2. 配置后端环境

```bash
cp .env.example .env
# 编辑 .env 文件，修改数据库、Redis等配置
```

### 3. 初始化数据库

```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE mall CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 运行数据库迁移
alembic upgrade head

# 创建管理员账户
python scripts/create_admin.py
```

### 4. 启动后端服务

```bash
cd backend
uvicorn app.main:app --reload
```

### 5. 安装并启动后台管理

```bash
cd admin
npm install
npm run dev
```

### 6. 启动小程序

使用微信开发者工具打开 `miniprogram` 目录

## Docker 部署

```bash
# 一键启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 访问地址

- 后台管理: http://localhost:5173
- 后端API: http://localhost:8000
- API文档: http://localhost:8000/docs

## 默认账户

### 后台管理员
- 用户名: admin
- 密码: admin123

## 功能模块

### 小程序端
- 用户登录（微信授权）
- 商品浏览
- 购物车
- 订单管理
- 支付（微信支付）
- 优惠券
- 个人中心

### 后台管理
- 控制台（数据概览、销售统计）
- 商品管理（商品列表、编辑、分类管理）
- 订单管理（订单列表、发货、退款）
- 用户管理（用户列表、用户详情）
- 营销管理（优惠券管理）
- 系统设置（轮播图、系统配置）

## API文档

启动后端服务后访问：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 开发文档

详细的设计文档请查看 `docs/` 目录：
- [微信商城小程序系统设计规划](docs/微信商城小程序系统设计规划.md)
- [后台架构设计](docs/04-后台管理系统/4.1-后台架构设计.md)
- [功能模块说明](docs/04-后台管理系统/4.2-功能模块说明.md)
- [后端API文档](docs/02-后端API开发/)

## 常见问题

### 后端启动失败
1. 检查 MySQL 和 Redis 是否已启动
2. 检查 .env 配置是否正确
3. 检查数据库是否已创建

### 小程序登录失败
1. 检查微信小程序 AppID 和 AppSecret 配置
2. 检查微信支付相关配置

### 后台管理无法连接后端
1. 检查后端服务是否启动
2. 检查 admin/src/utils/request.ts 中的 baseURL 配置

## 许可证

MIT License
