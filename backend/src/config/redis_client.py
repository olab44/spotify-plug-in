from functools import lru_cache

import redis

from .constants import REDIS_URL


@lru_cache()
def get_redis_client() -> redis.Redis:
    """
    Dependency to provide a Redis client instance.
    """
    return redis.from_url(REDIS_URL)
