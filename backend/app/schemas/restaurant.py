from pydantic import BaseModel
from typing import Optional


class RestaurantBase(BaseModel):
    name: str
    city: str
    description: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    cuisine_type: Optional[str] = None
    average_price: float = 0
    rating: float = 0
    image_url: Optional[str] = None
    tags: Optional[str] = None
    opening_hours: Optional[str] = None
    is_recommended: bool = False


class RestaurantCreate(RestaurantBase):
    pass


class RestaurantResponse(RestaurantBase):
    id: int

    class Config:
        from_attributes = True
