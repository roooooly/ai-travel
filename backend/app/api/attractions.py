from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional

from ..core.database import get_db
from ..models.attraction import Attraction
from ..schemas.attraction import AttractionResponse, AttractionCreate

router = APIRouter()


@router.get("", response_model=List[AttractionResponse])
async def list_attractions(
    destination_id: Optional[int] = Query(None),
    city: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    query = select(Attraction)
    if destination_id:
        query = query.where(Attraction.destination_id == destination_id)
    if city:
        query = query.where(Attraction.city == city)
    query = query.order_by(Attraction.name)
    result = await db.execute(query)
    attractions = result.scalars().all()
    return attractions


@router.get("/{attraction_id}", response_model=AttractionResponse)
async def get_attraction(attraction_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Attraction).where(Attraction.id == attraction_id))
    attraction = result.scalar_one_or_none()
    if not attraction:
        raise HTTPException(status_code=404, detail="Attraction not found")
    return attraction


@router.post("", response_model=AttractionResponse)
async def create_attraction(attraction_data: AttractionCreate, db: AsyncSession = Depends(get_db)):
    attraction = Attraction(**attraction_data.model_dump())
    db.add(attraction)
    await db.commit()
    await db.refresh(attraction)
    return attraction
