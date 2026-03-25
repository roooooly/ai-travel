import httpx
from typing import Optional
from ..core.config import settings


class WeatherService:
    def __init__(self):
        self.qweather_key = settings.QWEATHER_KEY
        self.api_url = "https://devapi.qweather.com/v7/weather"

    async def get_weather(self, city: str) -> dict:
        """Get weather information for a city."""
        if not self.qweather_key:
            return self._get_mock_weather(city)

        # For MVP, return mock data since we need city code mapping
        return self._get_mock_weather(city)

    def _get_mock_weather(self, city: str) -> dict:
        """Return mock weather data."""
        return {
            "city": city,
            "weather": "多云",
            "temperature": "15-22°C",
            "wind": "东南风3-4级",
            "humidity": "65%",
            "tips": "今日天气适宜出行，建议携带薄外套",
            "forecast": [
                {"date": "今天", "weather": "多云", "temp": "15-22°C"},
                {"date": "明天", "weather": "晴", "temp": "16-24°C"},
                {"date": "后天", "weather": "多云转小雨", "temp": "14-20°C"},
            ]
        }
