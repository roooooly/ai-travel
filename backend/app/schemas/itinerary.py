from pydantic import BaseModel
from typing import Optional, List


class ItineraryGenerate(BaseModel):
    destination: str
    days: int
    preferences: Optional[dict] = None


class ItineraryBase(BaseModel):
    title: str
    content: str
    destination: str
    days: int
    preferences: Optional[str] = None


class ItineraryCreate(ItineraryBase):
    user_id: int


class ItineraryResponse(ItineraryBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
