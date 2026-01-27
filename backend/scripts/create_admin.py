import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import AsyncSessionLocal
from app.core.security import get_password_hash
from app.models import Admin


async def create_admin():
    async with AsyncSessionLocal() as db:
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


if __name__ == "__main__":
    asyncio.run(create_admin())
