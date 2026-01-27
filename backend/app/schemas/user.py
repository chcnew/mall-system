from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ResponseModel(BaseModel):
    code: int = 0
    message: str = "success"
    data: Optional[any] = None

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    code: str


class UserPhone(BaseModel):
    code: str
    encrypted_data: str
    iv: str


class UserProfile(BaseModel):
    nickname: Optional[str] = None
    avatar: Optional[str] = None


class UserAddress(BaseModel):
    name: str
    phone: str
    province: str
    city: str
    district: str
    detail: str
    is_default: bool = False


class UserAddressUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    province: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None
    detail: Optional[str] = None
    is_default: Optional[bool] = None
