from typing import AsyncIterable

from .aggregator import aggregate_from_stream, finalize_stats


async def stats_from_stream(track_stream: AsyncIterable[dict]):
    counts = await aggregate_from_stream(track_stream)
    stats = finalize_stats(counts)
    return stats
