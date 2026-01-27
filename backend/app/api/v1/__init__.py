from fastapi import APIRouter

router = APIRouter()

from . import auth, user, product, cart, order, coupon, common

router.include_router(auth.router, prefix="/auth", tags=["认证"])
router.include_router(user.router, prefix="/user", tags=["用户"])
router.include_router(product.router, prefix="/product", tags=["商品"])
router.include_router(cart.router, prefix="/cart", tags=["购物车"])
router.include_router(order.router, prefix="/order", tags=["订单"])
router.include_router(coupon.router, prefix="/coupon", tags=["优惠券"])
router.include_router(common.router, prefix="/common", tags=["公共"])
