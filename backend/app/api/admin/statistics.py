from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.deps import get_current_admin
from app.database import get_db
from sqlalchemy import select, func, and_
from app.models import Order, Product
from datetime import datetime, timedelta

router = APIRouter()


@router.get("/overview")
async def get_overview(
    current_admin: dict = Depends(get_current_admin), db: AsyncSession = Depends(get_db)
):
    today = datetime.now().date()

    today_orders_result = await db.execute(
        select(func.count(Order.id)).where(
            and_(Order.created_at >= today, Order.status >= 1)
        )
    )
    today_orders = today_orders_result.scalar() or 0

    today_sales_result = await db.execute(
        select(func.sum(Order.pay_amount)).where(
            and_(Order.created_at >= today, Order.status >= 1)
        )
    )
    today_sales = float(today_sales_result.scalar() or 0)

    from app.models import User

    new_users_result = await db.execute(
        select(func.count(User.id)).where(User.created_at >= today)
    )
    new_users = new_users_result.scalar() or 0

    product_views = 0

    return {
        "today_orders": today_orders,
        "today_sales": today_sales,
        "new_users": new_users,
        "product_views": product_views,
    }


@router.get("/sales")
async def get_sales_trend(
    days: int = 7,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)

    result = await db.execute(
        select(
            func.date(Order.created_at).label("date"),
            func.sum(Order.pay_amount).label("amount"),
            func.count(Order.id).label("orders"),
        )
        .where(and_(Order.created_at >= start_date, Order.status >= 1))
        .group_by(func.date(Order.created_at))
        .order_by(func.date(Order.created_at))
    )

    sales_data = [
        {
            "date": str(row.date),
            "amount": float(row.amount or 0),
            "orders": row.orders or 0,
        }
        for row in result.all()
    ]

    return sales_data


@router.get("/top-products")
async def get_top_products(
    limit: int = 10,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    from app.models import OrderItem

    result = await db.execute(
        select(
            OrderItem.product_id,
            OrderItem.product_name,
            func.sum(OrderItem.quantity).label("total_quantity"),
        )
        .group_by(OrderItem.product_id, OrderItem.product_name)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(limit)
    )

    top_products = [
        {
            "id": row.product_id,
            "name": row.product_name,
            "sales": row.total_quantity or 0,
        }
        for row in result.all()
    ]

    return top_products
