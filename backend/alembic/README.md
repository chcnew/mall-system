# 数据库迁移指南

## 首次迁移

首次运行项目时，需要创建数据库表结构：

```bash
cd backend
./scripts/migrate.sh
```

或者手动执行：

```bash
cd backend
source venv/bin/activate

# 生成迁移文件
alembic revision --autogenerate -m "init"

# 执行迁移
alembic upgrade head
```

## 后续迁移

当你修改了模型（`app/models/__init__.py`）后，需要更新数据库结构：

```bash
cd backend
source venv/bin/activate

# 生成新的迁移文件
alembic revision --autogenerate -m "描述你的变更"

# 执行迁移
alembic upgrade head
```

## 常用命令

### 查看当前迁移状态

```bash
alembic current
```

### 查看迁移历史

```bash
alembic history
```

### 回滚到上一个版本

```bash
alembic downgrade -1
```

### 回滚到指定版本

```bash
alembic downgrade <revision_id>
```

### 重置数据库（危险操作）

```bash
alembic downgrade base
alembic upgrade head
```

## 注意事项

1. 确保数据库容器正在运行
2. 修改模型后必须生成新的迁移文件
3. 提交代码时记得包含迁移文件
4. 生产环境执行迁移前请先备份数据库
