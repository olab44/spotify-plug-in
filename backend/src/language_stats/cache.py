import asyncio
import time
from typing import Any, Dict, Optional


class SimpleTTLCache:
    def __init__(self, ttl: int = 86400):  # 24h
        self.store: Dict[str, Dict[str, Any]] = {}
        self.ttl = ttl
        self.lock = asyncio.Lock()

    async def get(self, key: str) -> Optional[Dict[str, Any]]:
        async with self.lock:
            entry = self.store.get(key)
            if entry and time.time() - entry["timestamp"] < self.ttl:
                return entry["value"]
            elif entry:
                del self.store[key]
            return None

    async def set(self, key: str, value: Dict[str, Any]):
        async with self.lock:
            self.store[key] = {"value": value, "timestamp": time.time()}
