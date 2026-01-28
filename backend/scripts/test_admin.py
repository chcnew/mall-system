#!/usr/bin/env python3
import sys
import os
import warnings

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

warnings.filterwarnings("ignore", category=RuntimeWarning)

import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import AsyncSessionLocal
from app.core.security import verify_password
from app.models import Admin


async def test_admin():
    db = AsyncSessionLocal()
    try:
        result = await db.execute(select(Admin).where(Admin.username == "admin"))
        admin = result.scalar_one_or_none()

        if not admin:
            print("❌ 管理员不存在")
            return

        print(f"✓ 管理员存在: {admin.username}")
        print(f"  状态: {admin.status}")
        print(f"  密码哈希: {admin.password}")

        if verify_password("admin123", admin.password):
            print("✓ 密码验证成功")
        else:
            print("❌ 密码验证失败")
    finally:
        await db.close()


if __name__ == "__main__":
    try:
        asyncio.run(test_admin())
    except RuntimeError:
        pass
