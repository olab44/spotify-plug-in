from typing import List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from .schemas import LanguageRecommendationRequest, LanguageRecommendationResponse


def analyze_user_interests(user_id: str):
    return ["technology", "music", "education"]


def fetch_podcasts(interests: List[str], language: str):
    return [f"{interest} podcast in {language}" for interest in interests]


def fetch_music_tracks(genres: List[str], language: str):
    return [f"{genre} song in {language}" for genre in genres]


def create_playlist(tracks: List[str]):
    return "http://example.com/playlist"


def fetch_lyrics_and_translations(tracks: List[str]):
    lyrics = [f"Lyrics for {track}" for track in tracks]
    translations = [f"Translation for {track}" for track in tracks]
    return lyrics, translations


def recommend_languages(request: LanguageRecommendationRequest) -> LanguageRecommendationResponse:
    interests = analyze_user_interests(request.user_id)
    genres = ["Pop", "Rock", "Jazz"]
    podcasts = []
    music_tracks = []
    for language in request.languages:
        podcasts.extend(fetch_podcasts(interests, language))
        music_tracks.extend(fetch_music_tracks(genres, language))

    vectorizer = TfidfVectorizer()
    interests_genres = interests + genres
    tfidf_matrix = vectorizer.fit_transform(interests_genres)

    cosine_similarities = linear_kernel(tfidf_matrix, tfidf_matrix)

    top_recommendations = cosine_similarities.argsort().flatten()[-10:]

    recommended_podcasts = [podcasts[i] for i in top_recommendations if i < len(podcasts)]
    recommended_music_tracks = [music_tracks[i - len(podcasts)] for i in top_recommendations if i >= len(podcasts)]

    playlist_url = create_playlist(recommended_music_tracks)
    lyrics, translations = fetch_lyrics_and_translations(recommended_music_tracks)

    return LanguageRecommendationResponse(
        podcasts=recommended_podcasts,
        music_tracks=recommended_music_tracks,
        playlist_url=playlist_url,
        lyrics=lyrics,
        translations=translations
    )
