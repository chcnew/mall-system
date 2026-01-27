from sqlalchemy import (
    Column,
    BigInteger,
    String,
    Text,
    DECIMAL,
    Integer,
    SmallInteger,
    DateTime,
    JSON,
    Boolean,
    Index,
)
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    openid = Column(String(64), unique=True, nullable=False, index=True)
    unionid = Column(String(64))
    nickname = Column(String(64))
    avatar = Column(String(255))
    phone = Column(String(20), index=True)
    gender = Column(SmallInteger, default=0, comment="0未知 1男 2女")
    balance = Column(DECIMAL(10, 2), default=0.00)
    points = Column(Integer, default=0)
    status = Column(SmallInteger, default=1, comment="0禁用 1正常")
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class UserAddress(Base):
    __tablename__ = "user_addresses"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, nullable=False, index=True)
    name = Column(String(32), nullable=False)
    phone = Column(String(20), nullable=False)
    province = Column(String(32), nullable=False)
    city = Column(String(32), nullable=False)
    district = Column(String(32), nullable=False)
    detail = Column(String(255), nullable=False)
    is_default = Column(SmallInteger, default=0)
    created_at = Column(DateTime, default=func.now())


class Category(Base):
    __tablename__ = "categories"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    parent_id = Column(BigInteger, default=0)
    name = Column(String(64), nullable=False)
    icon = Column(String(255))
    sort = Column(Integer, default=0)
    status = Column(SmallInteger, default=1)
    created_at = Column(DateTime, default=func.now())


class Product(Base):
    __tablename__ = "products"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    category_id = Column(BigInteger, nullable=False, index=True)
    name = Column(String(128), nullable=False)
    subtitle = Column(String(255))
    cover = Column(String(255))
    images = Column(JSON)
    description = Column(Text)
    price = Column(DECIMAL(10, 2), nullable=False)
    original_price = Column(DECIMAL(10, 2))
    stock = Column(Integer, default=0)
    sales = Column(Integer, default=0)
    status = Column(SmallInteger, default=1, comment="0下架 1上架", index=True)
    is_hot = Column(SmallInteger, default=0)
    is_new = Column(SmallInteger, default=0)
    sort = Column(Integer, default=0)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class ProductSku(Base):
    __tablename__ = "product_skus"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    product_id = Column(BigInteger, nullable=False, index=True)
    sku_code = Column(String(64))
    specs = Column(JSON)
    price = Column(DECIMAL(10, 2), nullable=False)
    stock = Column(Integer, default=0)
    image = Column(String(255))
    created_at = Column(DateTime, default=func.now())


class Order(Base):
    __tablename__ = "orders"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    order_no = Column(String(32), unique=True, nullable=False, index=True)
    user_id = Column(BigInteger, nullable=False, index=True)
    total_amount = Column(DECIMAL(10, 2), nullable=False)
    pay_amount = Column(DECIMAL(10, 2), nullable=False)
    freight_amount = Column(DECIMAL(10, 2), default=0.00)
    discount_amount = Column(DECIMAL(10, 2), default=0.00)
    coupon_id = Column(BigInteger)
    status = Column(
        SmallInteger,
        default=0,
        index=True,
        comment="0待付款 1待发货 2待收货 3已完成 4已取消 5已退款",
    )
    pay_time = Column(DateTime)
    pay_type = Column(SmallInteger, comment="支付方式 1微信支付")
    transaction_id = Column(String(64))
    ship_time = Column(DateTime)
    receive_time = Column(DateTime)
    address_snapshot = Column(JSON)
    remark = Column(String(255))
    created_at = Column(DateTime, default=func.now(), index=True)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    order_id = Column(BigInteger, nullable=False, index=True)
    product_id = Column(BigInteger, nullable=False)
    sku_id = Column(BigInteger)
    product_name = Column(String(128), nullable=False)
    product_image = Column(String(255))
    specs = Column(String(255))
    price = Column(DECIMAL(10, 2), nullable=False)
    quantity = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=func.now())


class OrderLogistics(Base):
    __tablename__ = "order_logistics"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    order_id = Column(BigInteger, nullable=False, index=True)
    company = Column(String(32))
    tracking_no = Column(String(64))
    traces = Column(JSON)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class CouponTemplate(Base):
    __tablename__ = "coupon_templates"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(64), nullable=False)
    type = Column(SmallInteger, nullable=False, comment="1满减 2折扣 3无门槛")
    value = Column(DECIMAL(10, 2), nullable=False)
    min_amount = Column(DECIMAL(10, 2), default=0)
    total_count = Column(Integer, nullable=False)
    remain_count = Column(Integer, nullable=False)
    per_limit = Column(Integer, default=1)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    status = Column(SmallInteger, default=1)
    created_at = Column(DateTime, default=func.now())


class UserCoupon(Base):
    __tablename__ = "user_coupons"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, nullable=False, index=True)
    coupon_id = Column(BigInteger, nullable=False)
    status = Column(
        SmallInteger, default=0, index=True, comment="0未使用 1已使用 2已过期"
    )
    used_time = Column(DateTime)
    order_id = Column(BigInteger)
    expire_time = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=func.now())


class Cart(Base):
    __tablename__ = "carts"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, nullable=False)
    product_id = Column(BigInteger, nullable=False)
    sku_id = Column(BigInteger)
    quantity = Column(Integer, nullable=False, default=1)
    selected = Column(SmallInteger, default=1)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class Admin(Base):
    __tablename__ = "admins"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    username = Column(String(32), unique=True, nullable=False)
    password = Column(String(128), nullable=False)
    nickname = Column(String(64))
    avatar = Column(String(255))
    role = Column(String(32), default="admin")
    status = Column(SmallInteger, default=1)
    last_login = Column(DateTime)
    created_at = Column(DateTime, default=func.now())


class SystemConfig(Base):
    __tablename__ = "system_configs"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    config_key = Column(String(64), unique=True, nullable=False)
    config_value = Column(Text)
    remark = Column(String(255))
    created_at = Column(DateTime, default=func.now())


class Banner(Base):
    __tablename__ = "banners"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    title = Column(String(64))
    image = Column(String(255), nullable=False)
    link_type = Column(SmallInteger, comment="1商品 2分类 3页面 4外链")
    link_value = Column(String(255))
    sort = Column(Integer, default=0)
    status = Column(SmallInteger, default=1)
    created_at = Column(DateTime, default=func.now())
