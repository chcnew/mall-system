from fastapi import APIRouter, UploadFile, File
from app.models import Banner
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from sqlalchemy import select

router = APIRouter()


@router.get("/banners")
async def get_banners(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Banner).where(Banner.status == 1).order_by(Banner.sort)
    )
    banners = result.scalars().all()

    return [
        {
            "id": b.id,
            "title": b.title,
            "image": b.image,
            "link_type": b.link_type,
            "link_value": b.link_value,
        }
        for b in banners
    ]


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    from app.utils import save_upload_file

    url = await save_upload_file(file, "uploads")

    return {"url": url}
