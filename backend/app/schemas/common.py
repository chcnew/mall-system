from pydantic import BaseModel
from typing import Optional, Dict, Any


class PageParams(BaseModel):
    page: int = 1
    size: int = 20


class ProductListParams(PageParams):
    category_id: Optional[int] = None
    status: Optional[int] = None
    keyword: Optional[str] = None


class OrderListParams(PageParams):
    status: Optional[int] = None
    keyword: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None


class UserListParams(PageParams):
    status: Optional[int] = None
    keyword: Optional[str] = None
