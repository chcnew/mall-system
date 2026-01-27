from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from app.core.security import decode_access_token

security = HTTPBearer()


async def get_current_user(
    token: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="无效的认证凭证",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(token.credentials)
    if payload is None:
        raise credentials_exception

    user_id: Optional[int] = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    return {"user_id": user_id, "role": payload.get("role", "user")}


async def get_current_admin(
    token: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="无效的管理员凭证",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(token.credentials)
    if payload is None:
        raise credentials_exception

    admin_id: Optional[int] = payload.get("sub")
    role: Optional[str] = payload.get("role")

    if admin_id is None or role != "admin":
        raise credentials_exception

    return {"admin_id": admin_id, "role": role}
