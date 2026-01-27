from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AdminLogin(BaseModel):
    username: str
    password: str


class AdminCreate(BaseModel):
    username: str
    password: str
    nickname: Optional[str] = None
    avatar: Optional[str] = None
    role: str = "admin"
    status: int = 1


class AdminUpdate(BaseModel):
    nickname: Optional[str] = None
    avatar: Optional[str] = None
    role: Optional[str] = None
    status: Optional[int] = None


class CouponCreate(BaseModel):
    name: str
    type: int
    value: float
    min_amount: float = 0
    total_count: int
    per_limit: int = 1
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    status: int = 1


class CouponUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[int] = None
    value: Optional[float] = None
    min_amount: Optional[float] = None
    total_count: Optional[int] = None
    per_limit: Optional[int] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    status: Optional[int] = None


class BannerCreate(BaseModel):
    title: Optional[str] = None
    image: str
    link_type: int
    link_value: Optional[str] = None
    sort: int = 0
    status: int = 1


class BannerUpdate(BaseModel):
    title: Optional[str] = None
    image: Optional[str] = None
    link_type: Optional[int] = None
    link_value: Optional[str] = None
    sort: Optional[int] = None
    status: Optional[int] = None
