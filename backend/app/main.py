from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import api as api_v1
from app.api.admin import api as api_admin
from app.core.config import settings
from app.core.exceptions import register_exception_handlers

app = FastAPI(
    title="商城API",
    description="微信商城小程序后端API",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)

app.include_router(api_v1.router, prefix="/api/v1")
app.include_router(api_admin.router, prefix="/api/admin")


@app.get("/")
async def root():
    return {"message": "商城API服务运行中"}


@app.get("/health")
async def health():
    return {"status": "ok"}
