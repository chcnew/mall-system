from pydantic import BaseModel
from typing import Optional, List


class ProductCreate(BaseModel):
    category_id: int
    name: str
    subtitle: Optional[str] = None
    cover: Optional[str] = None
    images: List[str] = []
    description: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    stock: int = 0
    is_hot: bool = False
    is_new: bool = False
    status: int = 1
    sort: int = 0


class ProductUpdate(BaseModel):
    category_id: Optional[int] = None
    name: Optional[str] = None
    subtitle: Optional[str] = None
    cover: Optional[str] = None
    images: Optional[List[str]] = None
    description: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    stock: Optional[int] = None
    is_hot: Optional[bool] = None
    is_new: Optional[bool] = None
    status: Optional[int] = None
    sort: Optional[int] = None


class CategoryCreate(BaseModel):
    parent_id: int = 0
    name: str
    icon: Optional[str] = None
    sort: int = 0
    status: int = 1


class CategoryUpdate(BaseModel):
    parent_id: Optional[int] = None
    name: Optional[str] = None
    icon: Optional[str] = None
    sort: Optional[int] = None
    status: Optional[int] = None
