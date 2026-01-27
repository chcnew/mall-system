# 商城后端API

基于 FastAPI + SQLAlchemy + MySQL + Redis 的微信商城小程序后端API服务。

## 技术栈

- FastAPI 0.109.0
- SQLAlchemy 2.0.25
- MySQL 8.0
- Redis 7.0
- Celery 5.3.6
- Pydantic 2.5.3

## 项目结构

```
backend/
├── app/
│   ├── api/           # API路由
│   │   ├── v1/        # 小程序端API
│   │   └── admin/     # 管理端API
│   ├── core/          # 核心配置
│   ├── models/        # 数据库模型
│   ├── schemas/       # Pydantic模式
│   ├── utils/         # 工具函数
│   └── database.py    # 数据库连接
├── alembic/           # 数据库迁移
├── requirements.txt
└── main.py
```

## 安装依赖

```bash
pip install -r requirements.txt
```

## 环境配置

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

## 数据库初始化

```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE mall CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 运行迁移
alembic upgrade head

# 创建默认管理员账户
python scripts/create_admin.py
```

## 启动服务

```bash
# 开发模式
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 生产模式
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API文档

启动服务后访问：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API端点

### 小程序端API (/api/v1)

- `POST /api/v1/auth/login` - 微信登录
- `GET /api/v1/user/profile` - 获取用户信息
- `GET /api/v1/products` - 商品列表
- `GET /api/v1/products/{id}` - 商品详情
- `GET /api/v1/categories` - 分类列表
- `GET /api/v1/cart` - 购物车
- `POST /api/v1/order` - 创建订单
- `GET /api/v1/order` - 订单列表
- `GET /api/v1/coupon` - 优惠券列表

### 管理端API (/api/admin)

- `POST /api/admin/login` - 管理员登录
- `GET /api/admin/products` - 商品管理
- `GET /api/admin/orders` - 订单管理
- `GET /api/admin/users` - 用户管理
- `GET /api/admin/statistics/overview` - 数据概览

## 默认管理员账户

- 用户名: admin
- 密码: admin123

## 数据库迁移

```bash
# 生成迁移文件
alembic revision --autogenerate -m "描述信息"

# 应用迁移
alembic upgrade head

# 回滚迁移
alembic downgrade -1
```

## 开发说明

1. 所有API响应格式：
```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

2. 认证方式：JWT Bearer Token

3. 错误码：
- 0: 成功
- 401: 未授权
- 422: 参数验证失败
- 500: 服务器错误
