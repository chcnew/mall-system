from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.deps import get_current_user
from app.database import get_db
from app.models import Order, OrderItem, UserAddress, Product
from app.utils import generate_order_no

router = APIRouter()


@router.get("/")
async def get_orders(
    status: int = None,
    page: int = 1,
    size: int = 20,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(Order).where(Order.user_id == current_user["user_id"])

    if status is not None:
        query = query.where(Order.status == status)

    result = await db.execute(
        query.offset((page - 1) * size).limit(size).order_by(Order.created_at.desc())
    )
    orders = result.scalars().all()

    return {
        "items": [
            {
                "id": o.id,
                "order_no": o.order_no,
                "total_amount": float(o.total_amount),
                "pay_amount": float(o.pay_amount),
                "status": o.status,
                "created_at": o.created_at.isoformat() if o.created_at else None,
            }
            for o in orders
        ],
        "total": len(orders),
        "page": page,
        "size": size,
    }


@router.get("/{order_id}")
async def get_order(
    order_id: int,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    order_result = await db.execute(
        select(Order).where(
            Order.id == order_id, Order.user_id == current_user["user_id"]
        )
    )
    order = order_result.scalar_one_or_none()

    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="订单不存在")

    items_result = await db.execute(
        select(OrderItem).where(OrderItem.order_id == order.id)
    )
    items = items_result.scalars().all()

    return {
        "id": order.id,
        "order_no": order.order_no,
        "total_amount": float(order.total_amount),
        "pay_amount": float(order.pay_amount),
        "status": order.status,
        "pay_time": order.pay_time.isoformat() if order.pay_time else None,
        "address_snapshot": order.address_snapshot,
        "items": [
            {
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


@router.post("/")
async def create_order(
    data: dict,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    order_no = generate_order_no()
    total_amount = 0
    pay_amount = 0
    freight_amount = 10.00

    items = data.get("items", [])
    for item in items:
        total_amount += item["price"] * item["quantity"]

    if total_amount >= 99.00:
        freight_amount = 0.00

    pay_amount = total_amount + freight_amount

    order = Order(
        order_no=order_no,
        user_id=current_user["user_id"],
        total_amount=total_amount,
        pay_amount=pay_amount,
        freight_amount=freight_amount,
        status=0,
    )
    db.add(order)
    await db.flush()

    for item in items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item["product_id"],
            product_name=item["product_name"],
            product_image=item.get("product_image"),
            price=item["price"],
            quantity=item["quantity"],
        )
        db.add(order_item)

    await db.commit()
    await db.refresh(order)

    return {
        "order_no": order.order_no,
        "total_amount": float(total_amount),
        "pay_amount": float(pay_amount),
    }
