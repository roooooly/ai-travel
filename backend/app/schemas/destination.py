from pydantic import BaseModel
from typing import Optional


class DestinationBase(BaseModel):
    name: str
    city: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    province: str = "江苏省"
    country: str = "中国"


class DestinationCreate(DestinationBase):
    pass


class DestinationResponse(DestinationBase):
    id: int

    class Config:
        from_attributes = True
