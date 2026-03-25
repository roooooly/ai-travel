from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from ..core.database import get_db
from ..models.destination import Destination
from ..schemas.destination import DestinationResponse, DestinationCreate

router = APIRouter()


@router.get("", response_model=List[DestinationResponse])
async def list_destinations(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Destination).order_by(Destination.name))
    destinations = result.scalars().all()
    return destinations


@router.get("/{destination_id}", response_model=DestinationResponse)
async def get_destination(destination_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Destination).where(Destination.id == destination_id))
    destination = result.scalar_one_or_none()
    if not destination:
        raise HTTPException(status_code=404, detail="Destination not found")
    return destination


@router.post("", response_model=DestinationResponse)
async def create_destination(destination_data: DestinationCreate, db: AsyncSession = Depends(get_db)):
    destination = Destination(**destination_data.model_dump())
    db.add(destination)
    await db.commit()
    await db.refresh(destination)
    return destination
