# 微信商城小程序系统

一个完整的微信商城小程序系统，包含小程序前端、Vue3 后台管理和 FastAPI 后端服务。

## 项目结构

```
mall-system/
├── miniprogram/          # 微信小程序前端
├── admin/                # Vue3 后台管理系统
├── backend/              # FastAPI 后端服务
├── docs/                 # 项目文档
└── docker-compose.yml    # Docker 部署配置
```

## 技术栈

### 后端
- FastAPI (Python Web 框架)
- SQLAlchemy (ORM)
- Redis (缓存)
- Celery (异步任务)
- MySQL (数据库)

### 小程序
- 微信小程序原生开发
- 自定义组件封装

### 后台管理
- Vue 3 + TypeScript
- Vite (构建工具)
- Element Plus (UI 组件库)
- Pinia (状态管理)
- ECharts (数据可视化)

## 功能模块

### 小程序端
- ✅ 用户认证（微信登录、手机号）
- ✅ 商品浏览（列表、详情、搜索）
- ✅ 购物车管理
- ✅ 订单管理
- ✅ 支付集成（微信支付）
- ✅ 地址管理
- ✅ 优惠券系统
- ✅ 个人中心

### 后台管理
- ⏳ 商品管理（CRUD）
- ⏳ 订单管理（查询、发货、退款）
- ⏳ 用户管理
- ⏳ 营销管理（优惠券）
- ⏳ 数据统计
- ⏳ 系统设置

## 快速开始

### 前置要求

- Python 3.10+
- Node.js 16+
- MySQL 8.0+
- Redis 6.0+
- 微信开发者工具

### 安装依赖

#### 后端
```bash
cd backend
pip install -r requirements.txt
```

#### 后台管理
```bash
cd admin
npm install
```

### 配置环境变量

复制 `.env.example` 到 `.env` 并填写配置：
- 数据库连接信息
- Redis 连接信息
- 微信 AppID 和 AppSecret
- 微信支付商户配置

### 启动服务

#### 使用 Docker Compose（推荐）
```bash
docker-compose up -d
```

#### 手动启动
```bash
# 后端
cd backend
uvicorn app.main:app --reload

# 后台管理
cd admin
npm run dev
```

### 访问应用

- 小程序：使用微信开发者工具打开 `miniprogram` 目录
- 后台管理：http://localhost:5173
- API 文档：http://localhost:8000/docs

## 开发进度

- [x] 第一阶段：项目初始化与基础架构
- [x] 第二阶段：小程序前端（部分完成）
- [ ] 第三阶段：小程序前端（补充页面）
- [ ] 第四阶段：后端 API 开发
- [ ] 第五阶段：后台管理系统开发
- [ ] 第六阶段：测试与优化
- [ ] 第七阶段：部署与上线

## 文档

详细文档请查看 [docs/](./docs) 目录：

- [项目初始化](./docs/01-项目初始化/)
- [后端 API 开发](./docs/02-后端API开发/)
- [小程序开发](./docs/03-小程序开发/)
- [后台管理系统](./docs/04-后台管理系统/)
- [测试与优化](./docs/05-测试与优化/)
- [部署与上线](./docs/06-部署与上线/)

## 小程序已完成功能

### 核心页面
- ✅ 首页（轮播图、分类、商品推荐）
- ✅ 购物车（商品管理、数量控制、结算）
- ✅ 个人中心（用户信息、订单入口、功能菜单）

### 工具函数
- ✅ 网络请求封装（拦截器、错误处理、Loading）
- ✅ 认证管理（微信登录、Token 管理）
- ✅ 通用工具（时间、价格、防抖、节流等）

### 公共组件
- ✅ 商品卡片组件（展示、收藏、购物车）

## 待开发功能

### 小程序端
- 商品详情页
- 分类页面
- 搜索页面
- 订单列表和详情
- 地址管理
- 优惠券中心
- 支付集成

### 后端 API
- 用户认证与授权
- 商品模块 API
- 订单模块 API
- 支付模块 API
- 优惠券模块 API
- 后台管理 API

### 后台管理
- 商品管理
- 订单管理
- 用户管理
- 营销管理
- 数据统计
- 系统设置

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 开发规范

### 代码规范
- 后端：遵循 PEP 8
- 小程序：2 空格缩进，单引号优先
- 后台管理：ESLint + Prettier

### 提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构代码
test: 测试相关
chore: 构建/工具链相关
```

## 许可证

本项目采用 MIT 许可证。

## 联系方式

如有问题，请提交 Issue 或联系项目团队。

---

**版本**: 1.0.0  
**最后更新**: 2024-01-23  
**状态**: 开发中
