from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class OrderCreate(BaseModel):
    address_id: int
    items: List[dict]
    coupon_id: Optional[int] = None
    remark: Optional[str] = None


class OrderShip(BaseModel):
    company: str
    tracking_no: str


class OrderRefund(BaseModel):
    reason: str
