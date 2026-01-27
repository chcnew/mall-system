from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.security import create_access_token
from app.core.deps import get_current_user
from app.database import get_db
from app.models import User
from app.schemas import UserLogin
import httpx

router = APIRouter()


@router.post("/login")
async def login(data: UserLogin, db: AsyncSession = Depends(get_db)):
    wechat_url = "https://api.weixin.qq.com/sns/jscode2session"
    params = {
        "appid": "your_app_id",
        "secret": "your_app_secret",
        "js_code": data.code,
        "grant_type": "authorization_code",
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(wechat_url, params=params)
        result = response.json()

    if "openid" not in result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="微信登录失败"
        )

    openid = result["openid"]

    result_user = await db.execute(select(User).where(User.openid == openid))
    user = result_user.scalar_one_or_none()

    if not user:
        user = User(openid=openid, status=1)
        db.add(user)
        await db.commit()
        await db.refresh(user)

    token = create_access_token(data={"sub": user.id, "role": "user"})

    return {
        "token": token,
        "user": {"id": user.id, "nickname": user.nickname, "avatar": user.avatar},
    }


@router.get("/me")
async def get_me(
    current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).where(User.id == current_user["user_id"]))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="用户不存在")

    return {
        "id": user.id,
        "nickname": user.nickname,
        "avatar": user.avatar,
        "phone": user.phone,
        "balance": float(user.balance),
        "points": user.points,
    }
