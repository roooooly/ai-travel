from fastapi import APIRouter, HTTPException
from ..services.weather_service import WeatherService

router = APIRouter()
weather_service = WeatherService()


@router.get("/{city}")
async def get_weather(city: str):
    try:
        weather = await weather_service.get_weather(city)
        return weather
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
