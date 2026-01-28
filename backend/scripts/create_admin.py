import asyncio
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy.ext.asyncio import AsyncSession
from app.database import AsyncSessionLocal
from app.core.security import get_password_hash
from app.models import Admin


async def create_admin():
    db = AsyncSessionLocal()
    try:
        admin = Admin(
            username="admin",
            password=get_password_hash("admin123"),
            nickname="超级管理员",
            role="admin",
            status=1,
        )
        db.add(admin)
        await db.commit()
        print("管理员账户创建成功！")
        print("用户名: admin")
        print("密码: admin123")
    finally:
        await db.close()


if __name__ == "__main__":
    asyncio.run(create_admin())
