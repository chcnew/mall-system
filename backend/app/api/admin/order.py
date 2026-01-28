from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, update
from app.core.deps import get_current_admin
from app.core.response import success_response
from app.database import get_db
from app.models import Order, OrderItem, OrderLogistics
from app.schemas import OrderListParams, OrderShip
from sqlalchemy.sql import or_

router = APIRouter()


@router.get("")
async def get_orders(
    params: OrderListParams = Depends(),
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    query = select(Order)

    if params.status is not None:
        query = query.where(Order.status == params.status)

    if params.keyword:
        query = query.where(Order.order_no.like(f"%{params.keyword}%"))

    count_result = await db.execute(func.count(Order.id).select_from(query))
    total = count_result.scalar()

    result = await db.execute(
        query.offset((params.page - 1) * params.size)
        .limit(params.size)
        .order_by(Order.created_at.desc())
    )
    orders = result.scalars().all()

    return success_response(
        {
            "items": [
                {
                    "id": o.id,
                    "order_no": o.order_no,
                    "user_id": o.user_id,
                    "user_nickname": None,
                    "user_avatar": None,
                    "total_amount": float(o.total_amount),
                    "pay_amount": float(o.pay_amount),
                    "freight_amount": float(o.freight_amount),
                    "discount_amount": float(o.discount_amount),
                    "status": o.status,
                    "pay_time": o.pay_time.isoformat() if o.pay_time else None,
                    "address_snapshot": o.address_snapshot,
                    "remark": o.remark,
                    "created_at": o.created_at.isoformat() if o.created_at else None,
                }
                for o in orders
            ],
            "total": total,
            "page": params.page,
            "size": params.size,
        }
    )


@router.get("/{order_id}")
async def get_order(
    order_id: int,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()

    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="订单不存在")

    items_result = await db.execute(
        select(OrderItem).where(OrderItem.order_id == order.id)
    )
    items = items_result.scalars().all()

    return success_response(
        {
            "id": order.id,
            "order_no": order.order_no,
            "user_id": order.user_id,
            "user_nickname": None,
            "user_avatar": None,
            "total_amount": float(order.total_amount),
            "pay_amount": float(order.pay_amount),
            "freight_amount": float(order.freight_amount),
            "discount_amount": float(order.discount_amount),
            "status": order.status,
            "pay_time": order.pay_time.isoformat() if order.pay_time else None,
            "ship_time": order.ship_time.isoformat() if order.ship_time else None,
            "receive_time": order.receive_time.isoformat()
            if order.receive_time
            else None,
            "address_snapshot": order.address_snapshot,
            "remark": order.remark,
            "items": [
                {
                    "id": item.id,
                    "product_id": item.product_id,
                    "product_name": item.product_name,
                    "product_image": item.product_image,
                    "specs": item.specs,
                    "price": float(item.price),
                    "quantity": item.quantity,
                }
                for item in items
            ],
            "created_at": order.created_at.isoformat() if order.created_at else None,
        }
    )


@router.post("/{order_id}/ship")
async def ship_order(
    order_id: int,
    data: OrderShip,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()

    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="订单不存在")

    if order.status != 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="订单状态不正确"
        )

    logistics = OrderLogistics(
        order_id=order.id, company=data.company, tracking_no=data.tracking_no, traces=[]
    )
    db.add(logistics)

    order.status = 2
    order.ship_time = func.now()

    await db.commit()

    return success_response({"message": "发货成功"})


@router.post("/{order_id}/refund")
async def refund_order(
    order_id: int,
    data: dict,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()

    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="订单不存在")

    order.status = 5

    await db.commit()

    return success_response({"message": "退款成功"})
