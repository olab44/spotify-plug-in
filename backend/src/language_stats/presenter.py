from typing import AsyncIterable

from .processor import aggregate_from_stream, finalize_stats
from .schemas import LanguageStats


async def stats_from_stream(track_stream: AsyncIterable[dict]) -> LanguageStats:
    counts = await aggregate_from_stream(track_stream)
    return finalize_stats(counts)
