from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.core.deps import get_current_user
from app.database import get_db
from app.models import Cart, Product
from sqlalchemy.sql import and_

router = APIRouter()


@router.get("/")
async def get_cart(
    current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Cart).where(Cart.user_id == current_user["user_id"], Cart.selected == 1)
    )
    carts = result.scalars().all()

    items = []
    for cart in carts:
        product_result = await db.execute(
            select(Product).where(Product.id == cart.product_id)
        )
        product = product_result.scalar_one_or_none()

        if product:
            items.append(
                {
                    "id": cart.id,
                    "product_id": cart.product_id,
                    "product_name": product.name,
                    "product_image": product.cover,
                    "price": float(product.price),
                    "quantity": cart.quantity,
                    "selected": bool(cart.selected),
                }
            )

    return items


@router.post("/")
async def add_cart(
    data: dict,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    product_id = data.get("product_id")
    quantity = data.get("quantity", 1)

    result = await db.execute(
        select(Cart).where(
            Cart.user_id == current_user["user_id"], Cart.product_id == product_id
        )
    )
    cart = result.scalar_one_or_none()

    if cart:
        cart.quantity += quantity
    else:
        cart = Cart(
            user_id=current_user["user_id"],
            product_id=product_id,
            quantity=quantity,
            selected=1,
        )
        db.add(cart)

    await db.commit()

    return {"message": "添加成功"}


@router.put("/{cart_id}")
async def update_cart(
    cart_id: int,
    data: dict,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Cart).where(Cart.id == cart_id, Cart.user_id == current_user["user_id"])
    )
    cart = result.scalar_one_or_none()

    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="购物车商品不存在"
        )

    if "quantity" in data:
        cart.quantity = data["quantity"]
    if "selected" in data:
        cart.selected = 1 if data["selected"] else 0

    await db.commit()

    return {"message": "更新成功"}


@router.delete("/{cart_id}")
async def delete_cart(
    cart_id: int,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        delete(Cart).where(Cart.id == cart_id, Cart.user_id == current_user["user_id"])
    )

    if result.rowcount == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="购物车商品不存在"
        )

    await db.commit()

    return {"message": "删除成功"}
