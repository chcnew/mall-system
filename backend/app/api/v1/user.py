from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.core.deps import get_current_user
from app.database import get_db
from app.models import User, UserAddress
from app.schemas import UserProfile, UserAddressUpdate

router = APIRouter()


@router.get("/profile")
async def get_profile(
    current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).where(User.id == current_user["user_id"]))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="用户不存在")

    return {
        "id": user.id,
        "nickname": user.nickname,
        "avatar": user.avatar,
        "phone": user.phone,
        "gender": user.gender,
        "balance": float(user.balance),
        "points": user.points,
    }


@router.put("/profile")
async def update_profile(
    data: UserProfile,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.id == current_user["user_id"]))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="用户不存在")

    if data.nickname is not None:
        user.nickname = data.nickname
    if data.avatar is not None:
        user.avatar = data.avatar

    await db.commit()
    await db.refresh(user)

    return {"id": user.id, "nickname": user.nickname, "avatar": user.avatar}


@router.get("/addresses")
async def get_addresses(
    current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(UserAddress)
        .where(UserAddress.user_id == current_user["user_id"])
        .order_by(UserAddress.is_default.desc())
    )
    addresses = result.scalars().all()

    return [
        {
            "id": addr.id,
            "name": addr.name,
            "phone": addr.phone,
            "province": addr.province,
            "city": addr.city,
            "district": addr.district,
            "detail": addr.detail,
            "is_default": bool(addr.is_default),
        }
        for addr in addresses
    ]


@router.post("/addresses")
async def create_address(
    data: dict,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if data.get("is_default"):
        await db.execute(
            delete(UserAddress).where(
                UserAddress.user_id == current_user["user_id"],
                UserAddress.is_default == 1,
            )
        )

    address = UserAddress(
        user_id=current_user["user_id"],
        name=data["name"],
        phone=data["phone"],
        province=data["province"],
        city=data["city"],
        district=data["district"],
        detail=data["detail"],
        is_default=1 if data.get("is_default") else 0,
    )
    db.add(address)
    await db.commit()
    await db.refresh(address)

    return {
        "id": address.id,
        "name": address.name,
        "phone": address.phone,
        "province": address.province,
        "city": address.city,
        "district": address.district,
        "detail": address.detail,
        "is_default": bool(address.is_default),
    }


@router.put("/addresses/{address_id}")
async def update_address(
    address_id: int,
    data: dict,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(UserAddress).where(
            UserAddress.id == address_id, UserAddress.user_id == current_user["user_id"]
        )
    )
    address = result.scalar_one_or_none()

    if not address:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="地址不存在")

    if data.get("is_default"):
        await db.execute(
            delete(UserAddress).where(
                UserAddress.user_id == current_user["user_id"],
                UserAddress.id != address_id,
                UserAddress.is_default == 1,
            )
        )
        address.is_default = 1

    for key, value in data.items():
        if key != "is_default" and value is not None:
            setattr(address, key, value)

    await db.commit()
    await db.refresh(address)

    return {
        "id": address.id,
        "name": address.name,
        "phone": address.phone,
        "province": address.province,
        "city": address.city,
        "district": address.district,
        "detail": address.detail,
        "is_default": bool(address.is_default),
    }


@router.delete("/addresses/{address_id}")
async def delete_address(
    address_id: int,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        delete(UserAddress).where(
            UserAddress.id == address_id, UserAddress.user_id == current_user["user_id"]
        )
    )

    if result.rowcount == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="地址不存在")

    await db.commit()

    return {"message": "删除成功"}
