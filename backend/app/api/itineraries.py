from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from ..core.database import get_db
from ..models.itinerary import Itinerary
from ..schemas.itinerary import ItineraryResponse, ItineraryCreate, ItineraryGenerate
from ..services.ai_service import AIService
from .auth import get_current_user
from ..models.user import User

router = APIRouter()


@router.get("", response_model=List[ItineraryResponse])
async def list_itineraries(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Itinerary).where(Itinerary.user_id == current_user.id).order_by(Itinerary.created_at.desc())
    )
    itineraries = result.scalars().all()
    return itineraries


@router.get("/{itinerary_id}", response_model=ItineraryResponse)
async def get_itinerary(
    itinerary_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Itinerary).where(Itinerary.id == itinerary_id, Itinerary.user_id == current_user.id)
    )
    itinerary = result.scalar_one_or_none()
    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    return itinerary


@router.post("/generate", response_model=ItineraryResponse)
async def generate_itinerary(
    generate_data: ItineraryGenerate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    ai_service = AIService()
    itinerary_data = await ai_service.generate_itinerary(
        destination=generate_data.destination,
        days=generate_data.days,
        preferences=generate_data.preferences
    )

    itinerary = Itinerary(
        user_id=current_user.id,
        title=itinerary_data["title"],
        content=itinerary_data["content"],
        destination=generate_data.destination,
        days=generate_data.days,
    )
    db.add(itinerary)
    await db.commit()
    await db.refresh(itinerary)
    return itinerary
