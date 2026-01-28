from typing import Any, Optional


def success_response(data: Any = None, message: str = "success"):
    return {
        "code": 0,
        "message": message,
        "data": data,
    }


def error_response(code: int, message: str, data: Any = None):
    return {
        "code": code,
        "message": message,
        "data": data,
    }
