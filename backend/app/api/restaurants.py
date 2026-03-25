from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional

from ..core.database import get_db
from ..models.restaurant import Restaurant
from ..schemas.restaurant import RestaurantResponse, RestaurantCreate

router = APIRouter()


@router.get("", response_model=List[RestaurantResponse])
async def list_restaurants(
    city: Optional[str] = Query(None),
    cuisine: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    query = select(Restaurant)
    if city:
        query = query.where(Restaurant.city == city)
    if cuisine:
        query = query.where(Restaurant.cuisine_type == cuisine)
    query = query.order_by(Restaurant.name)
    result = await db.execute(query)
    restaurants = result.scalars().all()
    return restaurants


@router.get("/{restaurant_id}", response_model=RestaurantResponse)
async def get_restaurant(restaurant_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Restaurant).where(Restaurant.id == restaurant_id))
    restaurant = result.scalar_one_or_none()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return restaurant


@router.post("", response_model=RestaurantResponse)
async def create_restaurant(restaurant_data: RestaurantCreate, db: AsyncSession = Depends(get_db)):
    restaurant = Restaurant(**restaurant_data.model_dump())
    db.add(restaurant)
    await db.commit()
    await db.refresh(restaurant)
    return restaurant
