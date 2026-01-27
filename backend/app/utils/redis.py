import redis
from app.core.config import settings

redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)


class RedisCache:
    def __init__(self):
        self.client = redis_client

    async def get(self, key: str) -> str | None:
        return self.client.get(key)

    async def set(self, key: str, value: str, ex: int = None):
        self.client.set(key, value, ex=ex)

    async def delete(self, key: str):
        self.client.delete(key)

    async def exists(self, key: str) -> bool:
        return self.client.exists(key) > 0

    async def expire(self, key: str, seconds: int):
        self.client.expire(key, seconds)

    async def incr(self, key: str) -> int:
        return self.client.incr(key)

    async def decr(self, key: str) -> int:
        return self.client.decr(key)

    async def hget(self, key: str, field: str) -> str | None:
        return self.client.hget(key, field)

    async def hset(self, key: str, field: str, value: str):
        self.client.hset(key, field, value)

    async def hgetall(self, key: str) -> dict:
        return self.client.hgetall(key)

    async def hdel(self, key: str, *fields):
        self.client.hdel(key, *fields)

    async def zadd(self, key: str, score: float, member: str):
        self.client.zadd(key, {member: score})

    async def zrevrange(self, key: str, start: int = 0, end: int = -1) -> list:
        return self.client.zrevrange(key, start, end)


cache = RedisCache()
