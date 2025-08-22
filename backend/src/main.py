from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.login.router import router as login_router
from src.user.router import router as user_router
from src.top_tracks.router import router as top_tracks_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(login_router, prefix="/spotify")
app.include_router(user_router, prefix="/user")
app.include_router(top_tracks_router, prefix="/top-tracks")
