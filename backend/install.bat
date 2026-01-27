@echo off
echo 正在安装依赖...
pip install -r requirements.txt

echo 正在创建数据库...
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS mall CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo 正在初始化数据库迁移...
alembic upgrade head

echo 正在创建管理员账户...
python scripts/create_admin.py

echo 安装完成！
echo 使用以下命令启动服务：
echo uvicorn app.main:app --reload

pause
