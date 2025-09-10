import time
from asyncio import Lock
from typing import Optional


class SimpleTTLCache:
    def __init__(self, ttl_seconds: int = 86400):
        self._store = {}
        self._ttl = ttl_seconds
        self._lock = Lock()

    async def get(self, key: str) -> Optional[dict]:
        async with self._lock:
            entry = self._store.get(key)
            if not entry:
                return None
            value, ts = entry
            if time.time() - ts > self._ttl:
                del self._store[key]
                return None
            return value

    async def set(self, key: str, value: dict):
        async with self._lock:
            self._store[key] = (value, time.time())
