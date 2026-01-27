from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, func
from app.core.deps import get_current_admin
from app.database import get_db
from app.models import Product
from app.schemas import ProductCreate, ProductUpdate, ProductListParams
from sqlalchemy.sql import or_

router = APIRouter()


@router.get("")
async def get_products(
    params: ProductListParams = Depends(),
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    query = select(Product)

    if params.category_id:
        query = query.where(Product.category_id == params.category_id)

    if params.status is not None:
        query = query.where(Product.status == params.status)

    if params.keyword:
        query = query.where(
            or_(
                Product.name.like(f"%{params.keyword}%"),
                Product.subtitle.like(f"%{params.keyword}%"),
            )
        )

    count_result = await db.execute(func.count(Product.id).select_from(query))
    total = count_result.scalar()

    result = await db.execute(
        query.offset((params.page - 1) * params.size)
        .limit(params.size)
        .order_by(Product.created_at.desc())
    )
    products = result.scalars().all()

    return {
        "items": [
            {
                "id": p.id,
                "category_id": p.category_id,
                "name": p.name,
                "subtitle": p.subtitle,
                "cover": p.cover,
                "images": p.images or [],
                "description": p.description,
                "price": float(p.price),
                "original_price": float(p.original_price) if p.original_price else None,
                "stock": p.stock,
                "sales": p.sales,
                "status": p.status,
                "is_hot": bool(p.is_hot),
                "is_new": bool(p.is_new),
                "sort": p.sort,
                "created_at": p.created_at.isoformat() if p.created_at else None,
            }
            for p in products
        ],
        "total": total,
        "page": params.page,
        "size": params.size,
    }


@router.get("/{product_id}")
async def get_product(
    product_id: int,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
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
        "status": product.status,
        "is_hot": bool(product.is_hot),
        "is_new": bool(product.is_new),
        "sort": product.sort,
        "created_at": product.created_at.isoformat() if product.created_at else None,
    }


@router.post("")
async def create_product(
    data: ProductCreate,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    product = Product(
        category_id=data.category_id,
        name=data.name,
        subtitle=data.subtitle,
        cover=data.cover,
        images=data.images,
        description=data.description,
        price=data.price,
        original_price=data.original_price,
        stock=data.stock,
        status=data.status,
        is_hot=1 if data.is_hot else 0,
        is_new=1 if data.is_new else 0,
        sort=data.sort,
    )
    db.add(product)
    await db.commit()
    await db.refresh(product)

    return {"id": product.id, "name": product.name}


@router.put("/{product_id}")
async def update_product(
    product_id: int,
    data: ProductUpdate,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="商品不存在")

    for field, value in data.model_dump(exclude_unset=True).items():
        if field == "is_hot":
            setattr(product, field, 1 if value else 0)
        elif field == "is_new":
            setattr(product, field, 1 if value else 0)
        else:
            setattr(product, field, value)

    await db.commit()

    return {"message": "更新成功"}


@router.delete("/{product_id}")
async def delete_product(
    product_id: int,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(delete(Product).where(Product.id == product_id))

    if result.rowcount == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="商品不存在")

    await db.commit()

    return {"message": "删除成功"}


category_router = APIRouter()


@category_router.get("")
async def get_categories(
    current_admin: dict = Depends(get_current_admin), db: AsyncSession = Depends(get_db)
):
    from app.models import Category

    result = await db.execute(select(Category).order_by(Category.sort))
    categories = result.scalars().all()

    return [
        {
            "id": c.id,
            "parent_id": c.parent_id,
            "name": c.name,
            "icon": c.icon,
            "sort": c.sort,
            "status": c.status,
        }
        for c in categories
    ]


@category_router.post("")
async def create_category(
    data: dict,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    from app.models import Category

    category = Category(
        parent_id=data.get("parent_id", 0),
        name=data["name"],
        icon=data.get("icon"),
        sort=data.get("sort", 0),
        status=data.get("status", 1),
    )
    db.add(category)
    await db.commit()

    return {"id": category.id}


@category_router.put("/{category_id}")
async def update_category(
    category_id: int,
    data: dict,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    from app.models import Category

    result = await db.execute(select(Category).where(Category.id == category_id))
    category = result.scalar_one_or_none()

    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="分类不存在")

    for field, value in data.items():
        if value is not None:
            setattr(category, field, value)

    await db.commit()

    return {"message": "更新成功"}


@category_router.delete("/{category_id}")
async def delete_category(
    category_id: int,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    from app.models import Category

    result = await db.execute(delete(Category).where(Category.id == category_id))

    if result.rowcount == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="分类不存在")

    await db.commit()

    return {"message": "删除成功"}
