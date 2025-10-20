from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.dynamic_playlist.router import router as dynamic_playlist_router
from src.dynamic_playlist.scheduler import scheduler
from src.language_recommendation.router import router as recommendation_router
from src.language_stats.router import router as language_router
from src.login.router import router as login_router
from src.playlists.router import router as playlists_router
from src.top_artists.router import router as artists_router
from src.top_genres.router import router as top_genres_router
from src.top_tracks.router import router as top_tracks_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler.start()
    yield
    scheduler.shutdown()


app = FastAPI(lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(login_router, prefix="/spotify")
app.include_router(top_tracks_router, prefix="/top-tracks")
app.include_router(artists_router, prefix="/top-artists")
app.include_router(top_genres_router, prefix="/top-genres")
app.include_router(playlists_router, prefix="/playlists")
app.include_router(language_router, prefix="/language")
app.include_router(recommendation_router, prefix="/recommendation")
app.include_router(dynamic_playlist_router, prefix="/dynamic-playlist")
