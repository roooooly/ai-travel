from pydantic import BaseModel
from typing import Optional


class AttractionBase(BaseModel):
    name: str
    city: str
    description: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    open_hours: Optional[str] = None
    ticket_price: float = 0
    rating: float = 0
    image_url: Optional[str] = None
    tags: Optional[str] = None
    is_recommended: bool = False
    recommended_duration: Optional[str] = None


class AttractionCreate(AttractionBase):
    destination_id: Optional[int] = None


class AttractionResponse(AttractionBase):
    id: int
    destination_id: Optional[int] = None

    class Config:
        from_attributes = True
