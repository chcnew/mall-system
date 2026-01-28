from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.deps import get_current_admin
from app.core.response import success_response
from app.database import get_db
from app.models import User
from app.schemas import UserListParams
from sqlalchemy.sql import or_

router = APIRouter()


@router.get("")
async def get_users(
    params: UserListParams = Depends(),
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    query = select(User)

    if params.status is not None:
        query = query.where(User.status == params.status)

    if params.keyword:
        query = query.where(
            or_(
                User.nickname.like(f"%{params.keyword}%"),
                User.phone.like(f"%{params.keyword}%"),
            )
        )

    count_result = await db.execute(func.count(User.id).select_from(query))
    total = count_result.scalar()

    result = await db.execute(
        query.offset((params.page - 1) * params.size)
        .limit(params.size)
        .order_by(User.created_at.desc())
    )
    users = result.scalars().all()

    return success_response(
        {
            "items": [
                {
                    "id": u.id,
                    "openid": u.openid,
                    "nickname": u.nickname,
                    "avatar": u.avatar,
                    "phone": u.phone,
                    "gender": u.gender,
                    "balance": float(u.balance),
                    "points": u.points,
                    "status": u.status,
                    "created_at": u.created_at.isoformat() if u.created_at else None,
                }
                for u in users
            ],
            "total": total,
            "page": params.page,
            "size": params.size,
        }
    )


@router.get("/{user_id}")
async def get_user(
    user_id: int,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="用户不存在")

    return success_response(
        {
            "id": user.id,
            "openid": user.openid,
            "nickname": user.nickname,
            "avatar": user.avatar,
            "phone": user.phone,
            "gender": user.gender,
            "balance": float(user.balance),
            "points": user.points,
            "status": user.status,
            "created_at": user.created_at.isoformat() if user.created_at else None,
        }
    )


@router.put("/{user_id}")
async def update_user(
    user_id: int,
    data: dict,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="用户不存在")

    for field, value in data.items():
        if value is not None:
            setattr(user, field, value)

    await db.commit()

    return success_response({"message": "更新成功"})


@router.put("/{user_id}/status")
async def update_user_status(
    user_id: int,
    data: dict,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="用户不存在")

    user.status = data.get("status", 1)

    await db.commit()

    return success_response({"message": "更新成功"})
