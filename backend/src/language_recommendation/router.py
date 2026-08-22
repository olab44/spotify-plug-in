from fastapi import APIRouter, Depends, HTTPException

# from .schemas import ArtistSimple, RecommendationRequest, RecommendationResponse
# from .service import recommend_artists_for_user

# from src.login.service import get_current_user


router = APIRouter()


# @router.post("/artists", response_model=RecommendationResponse)
# async def recommend_artists(
#     req: RecommendationRequest, user: dict = Depends(get_current_user)
# ) -> RecommendationResponse:
#     token = user.get("access_token")
#     if not token:
#         raise HTTPException(status_code=401, detail="Not authenticated")

#     try:
#         results = recommend_artists_for_user(token, req.target_language, limit=req.limit)
#         if results is None:
#             raise HTTPException(status_code=500, detail="Failed to produce recommendations")
#         # Map to ArtistSimple
#         mapped = [
#             ArtistSimple(
#                 **{
#                     k: v
#                     for k, v in r.items()
#                     if k in ("id", "name", "genres", "popularity", "external_urls")
#                 }
#             )
#             for r in results
#         ]
#         return RecommendationResponse(recommendations=mapped)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
