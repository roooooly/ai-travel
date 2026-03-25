from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from typing import List, Optional

from ..core.database import get_db
from ..models.attraction import Attraction
from ..models.restaurant import Restaurant
from ..models.destination import Destination
from ..models.review import Review

router = APIRouter()


async def get_review_counts(db: AsyncSession, target_type: str):
    """Get review counts for a given target type."""
    result = await db.execute(
        select(Review.target_id, func.count().label("review_count"))
        .where(Review.target_type == target_type)
        .group_by(Review.target_id)
    )
    return {row[0]: row[1] for row in result.all()}


@router.get("/attractions")
async def hot_attractions(
    city: Optional[str] = Query(None),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    """Get popular attractions based on rating and review count."""
    query = select(Attraction).order_by(desc(Attraction.rating), desc(Attraction.is_recommended))
    if city:
        query = query.where(Attraction.city == city)
    query = query.limit(limit)
    result = await db.execute(query)
    attractions = result.scalars().all()
    
    # Get review counts separately
    review_counts = await get_review_counts(db, "attraction")
    
    return [
        {
            "id": a.id,
            "name": a.name,
            "city": a.city,
            "description": a.description,
            "address": a.address,
            "rating": a.rating,
            "image_url": a.image_url,
            "ticket_price": a.ticket_price,
            "review_count": review_counts.get(a.id, 0),
        }
        for a in attractions
    ]


@router.get("/restaurants")
async def hot_restaurants(
    city: Optional[str] = Query(None),
    cuisine_type: Optional[str] = Query(None),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    """Get popular restaurants based on rating and review count."""
    query = select(Restaurant).order_by(desc(Restaurant.rating), desc(Restaurant.is_recommended))
    if city:
        query = query.where(Restaurant.city == city)
    if cuisine_type:
        query = query.where(Restaurant.cuisine_type == cuisine_type)
    query = query.limit(limit)
    result = await db.execute(query)
    restaurants = result.scalars().all()
    
    review_counts = await get_review_counts(db, "restaurant")
    
    return [
        {
            "id": r.id,
            "name": r.name,
            "city": r.city,
            "description": r.description,
            "address": r.address,
            "cuisine_type": r.cuisine_type,
            "average_price": r.average_price,
            "rating": r.rating,
            "image_url": r.image_url,
            "review_count": review_counts.get(r.id, 0),
        }
        for r in restaurants
    ]


@router.get("/destinations")
async def hot_destinations(
    city: Optional[str] = Query(None),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    """Get popular destinations based on review count."""
    query = select(Destination)
    if city:
        query = query.where(Destination.city == city)
    query = query.limit(limit)
    result = await db.execute(query)
    destinations = result.scalars().all()
    
    review_counts = await get_review_counts(db, "destination")
    
    return [
        {
            "id": d.id,
            "name": d.name,
            "city": d.city,
            "description": d.description,
            "image_url": d.image_url,
            "province": d.province,
            "review_count": review_counts.get(d.id, 0),
        }
        for d in destinations
    ]
