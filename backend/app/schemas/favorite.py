from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class FavoriteCreate(BaseModel):
    target_type: str = Field(..., description="Type: attraction, restaurant, or destination")
    target_id: int


class FavoriteResponse(BaseModel):
    id: int
    user_id: int
    target_type: str
    target_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class FavoriteWithDetail(FavoriteResponse):
    name: Optional[str] = None
    image: Optional[str] = None
