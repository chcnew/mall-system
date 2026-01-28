from fastapi import APIRouter

router = APIRouter()

from . import auth, product, order, user, coupon, statistics, system

router.include_router(auth.router, tags=["管理员认证"])
router.include_router(product.router, prefix="/products", tags=["商品管理"])
router.include_router(product.category_router, prefix="/categories", tags=["分类管理"])
router.include_router(order.router, prefix="/orders", tags=["订单管理"])
router.include_router(user.router, prefix="/users", tags=["用户管理"])
router.include_router(coupon.router, prefix="/coupons", tags=["优惠券管理"])
router.include_router(statistics.router, prefix="/statistics", tags=["数据统计"])
router.include_router(system.router, prefix="/banners", tags=["轮播图管理"])
router.include_router(system.config_router, prefix="/configs", tags=["系统配置"])
