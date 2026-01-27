import random
import string
from datetime import datetime


def generate_order_no() -> str:
    now = datetime.now()
    prefix = now.strftime("%Y%m%d%H%M%S")
    random_str = "".join(random.choices(string.digits, k=6))
    return f"ORD{prefix}{random_str}"


def generate_sku_code(product_id: int, specs: dict) -> str:
    specs_str = "_".join([f"{k}:{v}" for k, v in sorted(specs.items())])
    return f"SKU{product_id}_{hash(specs_str) % 1000000:06d}"


def generate_coupon_code() -> str:
    return "".join(random.choices(string.digits + string.ascii_uppercase, k=12))
