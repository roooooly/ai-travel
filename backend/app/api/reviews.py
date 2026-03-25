from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from typing import List, Optional
import json

from ..core.database import get_db
from ..models.review import Review
from ..models.user import User
from ..schemas.review import ReviewCreate, ReviewResponse, ReviewWithUser
from .auth import get_current_user

router = APIRouter()


@router.post("", response_model=ReviewResponse)
async def create_review(
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    images_json = json.dumps(review_data.images) if review_data.images else "[]"
    review = Review(
        user_id=current_user.id,
        target_type=review_data.target_type,
        target_id=review_data.target_id,
        rating=review_data.rating,
        content=review_data.content,
        images=images_json,
    )
    db.add(review)
    await db.commit()
    await db.refresh(review)
    # Parse images back to list
    review.images = json.loads(images_json)
    return review


@router.get("", response_model=List[ReviewWithUser])
async def list_reviews(
    target_type: str = Query(..., description="attraction, restaurant, or destination"),
    target_id: int = Query(..., description="ID of the target"),
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(Review, User.username)
        .join(User, Review.user_id == User.id)
        .where(Review.target_type == target_type)
        .where(Review.target_id == target_id)
        .order_by(desc(Review.created_at))
    )
    result = await db.execute(query)
    rows = result.all()
    reviews = []
    for row in rows:
        review = row[0]
        username = row[1]
        images = json.loads(review.images) if review.images else []
        review_dict = {
            "id": review.id,
            "user_id": review.user_id,
            "target_type": review.target_type,
            "target_id": review.target_id,
            "rating": review.rating,
            "content": review.content,
            "images": images,
            "likes": review.likes,
            "created_at": review.created_at,
            "username": username,
        }
        reviews.append(ReviewWithUser(**review_dict))
    return reviews


@router.delete("/{review_id}")
async def delete_review(
    review_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Review).where(Review.id == review_id))
    review = result.scalar_one_or_none()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this review")
    await db.delete(review)
    await db.commit()
    return {"message": "Review deleted successfully"}
