from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ReviewCreate(BaseModel):
    target_type: str = Field(..., description="Type: attraction, restaurant, or destination")
    target_id: int
    rating: float = Field(..., ge=0, le=5)
    content: str
    images: Optional[List[str]] = []


class ReviewResponse(BaseModel):
    id: int
    user_id: int
    target_type: str
    target_id: int
    rating: float
    content: str
    images: Optional[List[str]] = []
    likes: int
    created_at: datetime

    class Config:
        from_attributes = True


class ReviewWithUser(ReviewResponse):
    username: Optional[str] = None
