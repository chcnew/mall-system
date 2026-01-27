from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.security import verify_password, create_access_token
from app.core.deps import get_current_admin
from app.database import get_db
from app.models import Admin
from app.schemas import AdminLogin

router = APIRouter()


@router.post("/login")
async def admin_login(data: AdminLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Admin).where(Admin.username == data.username))
    admin = result.scalar_one_or_none()

    if not admin or not verify_password(data.password, admin.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="用户名或密码错误"
        )

    if admin.status != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="账号已被禁用"
        )

    token = create_access_token(data={"sub": admin.id, "role": "admin"})

    return {
        "token": token,
        "admin": {
            "id": admin.id,
            "username": admin.username,
            "nickname": admin.nickname,
            "avatar": admin.avatar,
            "role": admin.role,
        },
    }


@router.get("/info")
async def get_admin_info(
    current_admin: dict = Depends(get_current_admin), db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Admin).where(Admin.id == current_admin["admin_id"])
    )
    admin = result.scalar_one_or_none()

    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="管理员不存在"
        )

    return {
        "id": admin.id,
        "username": admin.username,
        "nickname": admin.nickname,
        "avatar": admin.avatar,
        "role": admin.role,
    }


@router.post("/logout")
async def admin_logout():
    return {"message": "退出成功"}
