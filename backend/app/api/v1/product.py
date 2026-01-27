from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.deps import get_current_user
from app.database import get_db
from app.models import Product, Category
from sqlalchemy.sql import or_, and_

router = APIRouter()


@router.get("/list")
async def get_products(
    category_id: int = None,
    keyword: str = None,
    page: int = 1,
    size: int = 20,
    db: AsyncSession = Depends(get_db),
):
    query = select(Product).where(Product.status == 1)

    if category_id:
        query = query.where(Product.category_id == category_id)

    if keyword:
        query = query.where(
            or_(
                Product.name.like(f"%{keyword}%"), Product.subtitle.like(f"%{keyword}%")
            )
        )

    result = await db.execute(
        query.offset((page - 1) * size)
        .limit(size)
        .order_by(Product.sort.desc(), Product.created_at.desc())
    )
    products = result.scalars().all()

    return {
        "items": [
            {
                "id": p.id,
                "name": p.name,
                "subtitle": p.subtitle,
                "cover": p.cover,
                "price": float(p.price),
                "original_price": float(p.original_price) if p.original_price else None,
                "stock": p.stock,
                "sales": p.sales,
                "is_hot": bool(p.is_hot),
                "is_new": bool(p.is_new),
            }
            for p in products
        ],
        "total": len(products),
        "page": page,
        "size": size,
    }


@router.get("/{product_id}")
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="商品不存在")

    return {
        "id": product.id,
        "category_id": product.category_id,
        "name": product.name,
        "subtitle": product.subtitle,
        "cover": product.cover,
        "images": product.images or [],
        "description": product.description,
        "price": float(product.price),
        "original_price": float(product.original_price)
        if product.original_price
        else None,
        "stock": product.stock,
        "sales": product.sales,
        "is_hot": bool(product.is_hot),
        "is_new": bool(product.is_new),
    }


@router.get("/categories")
async def get_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Category).where(Category.status == 1).order_by(Category.sort)
    )
    categories = result.scalars().all()

    return [{"id": c.id, "name": c.name, "icon": c.icon} for c in categories]
