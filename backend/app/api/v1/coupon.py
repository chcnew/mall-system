from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.deps import get_current_user
from app.database import get_db
from app.models import CouponTemplate, UserCoupon

router = APIRouter()


@router.get("/")
async def get_coupons(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CouponTemplate).where(CouponTemplate.status == 1))
    coupons = result.scalars().all()

    return [
        {
            "id": c.id,
            "name": c.name,
            "type": c.type,
            "value": float(c.value),
            "min_amount": float(c.min_amount),
            "total_count": c.total_count,
            "remain_count": c.remain_count,
            "start_time": c.start_time.isoformat() if c.start_time else None,
            "end_time": c.end_time.isoformat() if c.end_time else None,
        }
        for c in coupons
    ]


@router.post("/receive/{coupon_id}")
async def receive_coupon(
    coupon_id: int,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(CouponTemplate).where(CouponTemplate.id == coupon_id)
    )
    coupon = result.scalar_one_or_none()

    if not coupon or coupon.status != 1:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="优惠券不存在"
        )

    if coupon.remain_count <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="优惠券已领完"
        )

    check_result = await db.execute(
        select(UserCoupon).where(
            UserCoupon.user_id == current_user["user_id"],
            UserCoupon.coupon_id == coupon_id,
        )
    )
    if check_result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="已领取过该优惠券"
        )

    from datetime import timedelta
    import datetime

    user_coupon = UserCoupon(
        user_id=current_user["user_id"],
        coupon_id=coupon_id,
        status=0,
        expire_time=datetime.datetime.now() + timedelta(days=30),
    )
    db.add(user_coupon)

    coupon.remain_count -= 1

    await db.commit()

    return {"message": "领取成功"}


@router.get("/my")
async def get_my_coupons(
    status: int = None,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(UserCoupon).where(UserCoupon.user_id == current_user["user_id"])

    if status is not None:
        query = query.where(UserCoupon.status == status)

    result = await db.execute(query)
    user_coupons = result.scalars().all()

    return [
        {
            "id": uc.id,
            "coupon_id": uc.coupon_id,
            "status": uc.status,
            "expire_time": uc.expire_time.isoformat() if uc.expire_time else None,
        }
        for uc in user_coupons
    ]
