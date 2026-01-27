from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DEBUG: bool = True

    DATABASE_URL: str = "mysql+pymysql://root:123456@localhost:3306/mall"
    REDIS_URL: str = "redis://localhost:6379/0"

    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    WECHAT_APP_ID: str = ""
    WECHAT_APP_SECRET: str = ""

    WECHAT_MCHID: str = ""
    WECHAT_API_V3_KEY: str = ""
    WECHAT_SERIAL_NO: str = ""
    WECHAT_CERT_PATH: str = ""
    WECHAT_KEY_PATH: str = ""

    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024

    @property
    def ASYNC_DATABASE_URL(self) -> str:
        return self.DATABASE_URL.replace("mysql+pymysql://", "mysql+aiomysql://")

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
