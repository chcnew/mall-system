from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.core.deps import get_current_admin
from app.database import get_db
from app.models import Banner, SystemConfig
from app.schemas import BannerCreate, BannerUpdate

router = APIRouter()


@router.get("")
async def get_banners(
    current_admin: dict = Depends(get_current_admin), db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Banner).order_by(Banner.sort))
    banners = result.scalars().all()

    return [
        {
            "id": b.id,
            "title": b.title,
            "image": b.image,
            "link_type": b.link_type,
            "link_value": b.link_value,
            "sort": b.sort,
            "status": b.status,
            "created_at": b.created_at.isoformat() if b.created_at else None,
        }
        for b in banners
    ]


@router.post("")
async def create_banner(
    data: BannerCreate,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    banner = Banner(
        title=data.title,
        image=data.image,
        link_type=data.link_type,
        link_value=data.link_value,
        sort=data.sort,
        status=data.status,
    )
    db.add(banner)
    await db.commit()
    await db.refresh(banner)

    return {"id": banner.id}


@router.put("/{banner_id}")
async def update_banner(
    banner_id: int,
    data: BannerUpdate,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Banner).where(Banner.id == banner_id))
    banner = result.scalar_one_or_none()

    if not banner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="轮播图不存在"
        )

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(banner, field, value)

    await db.commit()

    return {"message": "更新成功"}


@router.delete("/{banner_id}")
async def delete_banner(
    banner_id: int,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(delete(Banner).where(Banner.id == banner_id))

    if result.rowcount == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="轮播图不存在"
        )

    await db.commit()

    return {"message": "删除成功"}


config_router = APIRouter()


@config_router.get("")
async def get_configs(
    current_admin: dict = Depends(get_current_admin), db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(SystemConfig))
    configs = result.scalars().all()

    return [
        {
            "id": c.id,
            "config_key": c.config_key,
            "config_value": c.config_value,
            "remark": c.remark,
        }
        for c in configs
    ]


@config_router.put("")
async def update_config(
    data: dict,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    config_key = data.get("config_key")
    config_value = data.get("config_value")

    result = await db.execute(
        select(SystemConfig).where(SystemConfig.config_key == config_key)
    )
    config = result.scalar_one_or_none()

    if config:
        config.config_value = config_value
    else:
        config = SystemConfig(config_key=config_key, config_value=config_value)
        db.add(config)

    await db.commit()

    return {"message": "更新成功"}
