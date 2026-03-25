from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api import auth, destinations, attractions, restaurants, itineraries, weather, reviews, favorites, hot

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://tumulum.serveousercontent.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(destinations.router, prefix="/api/destinations", tags=["destinations"])
app.include_router(attractions.router, prefix="/api/attractions", tags=["attractions"])
app.include_router(restaurants.router, prefix="/api/restaurants", tags=["restinations"])
app.include_router(itineraries.router, prefix="/api/itineraries", tags=["itineraries"])
app.include_router(weather.router, prefix="/api/weather", tags=["weather"])
app.include_router(reviews.router, prefix="/api/reviews", tags=["reviews"])
app.include_router(favorites.router, prefix="/api/favorites", tags=["favorites"])
app.include_router(hot.router, prefix="/api/hot", tags=["hot"])


@app.get("/")
async def root():
    return {"message": "AI Travel Assistant API", "status": "running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
