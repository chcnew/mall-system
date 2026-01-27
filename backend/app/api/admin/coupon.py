from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, func
from app.core.deps import get_current_admin
from app.database import get_db
from app.models import CouponTemplate, UserCoupon
from app.schemas import CouponCreate, CouponUpdate

router = APIRouter()


@router.get("")
async def get_coupons(
    status: int = None,
    type: int = None,
    page: int = 1,
    size: int = 20,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    query = select(CouponTemplate)

    if status is not None:
        query = query.where(CouponTemplate.status == status)

    if type is not None:
        query = query.where(CouponTemplate.type == type)

    count_result = await db.execute(func.count(CouponTemplate.id).select_from(query))
    total = count_result.scalar()

    result = await db.execute(
        query.offset((page - 1) * size)
        .limit(size)
        .order_by(CouponTemplate.created_at.desc())
    )
    coupons = result.scalars().all()

    return {
        "items": [
            {
                "id": c.id,
                "name": c.name,
                "type": c.type,
                "value": float(c.value),
                "min_amount": float(c.min_amount),
                "total_count": c.total_count,
                "remain_count": c.remain_count,
                "per_limit": c.per_limit,
                "start_time": c.start_time.isoformat() if c.start_time else None,
                "end_time": c.end_time.isoformat() if c.end_time else None,
                "status": c.status,
                "created_at": c.created_at.isoformat() if c.created_at else None,
            }
            for c in coupons
        ],
        "total": total,
        "page": page,
        "size": size,
    }


@router.post("")
async def create_coupon(
    data: CouponCreate,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    coupon = CouponTemplate(
        name=data.name,
        type=data.type,
        value=data.value,
        min_amount=data.min_amount,
        total_count=data.total_count,
        remain_count=data.total_count,
        per_limit=data.per_limit,
        start_time=data.start_time,
        end_time=data.end_time,
        status=data.status,
    )
    db.add(coupon)
    await db.commit()
    await db.refresh(coupon)

    return {"id": coupon.id, "name": coupon.name}


@router.put("/{coupon_id}")
async def update_coupon(
    coupon_id: int,
    data: CouponUpdate,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(CouponTemplate).where(CouponTemplate.id == coupon_id)
    )
    coupon = result.scalar_one_or_none()

    if not coupon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="优惠券不存在"
        )

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(coupon, field, value)

    await db.commit()

    return {"message": "更新成功"}


@router.delete("/{coupon_id}")
async def delete_coupon(
    coupon_id: int,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        delete(CouponTemplate).where(CouponTemplate.id == coupon_id)
    )

    if result.rowcount == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="优惠券不存在"
        )

    await db.commit()

    return {"message": "删除成功"}


@router.get("/user-coupons")
async def get_user_coupons(
    status: int = None,
    page: int = 1,
    size: int = 20,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    query = select(UserCoupon)

    if status is not None:
        query = query.where(UserCoupon.status == status)

    count_result = await db.execute(func.count(UserCoupon.id).select_from(query))
    total = count_result.scalar()

    result = await db.execute(
        query.offset((page - 1) * size)
        .limit(size)
        .order_by(UserCoupon.created_at.desc())
    )
    user_coupons = result.scalars().all()

    return {
        "items": [
            {
                "id": uc.id,
                "user_id": uc.user_id,
                "user_nickname": None,
                "coupon_id": uc.coupon_id,
                "coupon_name": None,
                "status": uc.status,
                "used_time": uc.used_time.isoformat() if uc.used_time else None,
                "expire_time": uc.expire_time.isoformat() if uc.expire_time else None,
            }
            for uc in user_coupons
        ],
        "total": total,
        "page": page,
        "size": size,
    }
