from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, desc
from typing import List, Optional

from ..core.database import get_db
from ..models.favorite import Favorite
from ..models.user import User
from ..schemas.favorite import FavoriteCreate, FavoriteResponse, FavoriteWithDetail
from .auth import get_current_user

router = APIRouter()


@router.post("", response_model=FavoriteResponse)
async def add_favorite(
    fav_data: FavoriteCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Check if already favorited
    result = await db.execute(
        select(Favorite).where(
            and_(
                Favorite.user_id == current_user.id,
                Favorite.target_type == fav_data.target_type,
                Favorite.target_id == fav_data.target_id,
            )
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Already favorited")

    favorite = Favorite(
        user_id=current_user.id,
        target_type=fav_data.target_type,
        target_id=fav_data.target_id,
    )
    db.add(favorite)
    await db.commit()
    await db.refresh(favorite)
    return favorite


@router.get("", response_model=List[FavoriteResponse])
async def list_favorites(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Favorite)
        .where(Favorite.user_id == current_user.id)
        .order_by(desc(Favorite.created_at))
    )
    return result.scalars().all()


@router.delete("/{favorite_id}")
async def remove_favorite(
    favorite_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Favorite).where(Favorite.id == favorite_id))
    favorite = result.scalar_one_or_none()
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found")
    if favorite.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this favorite")
    await db.delete(favorite)
    await db.commit()
    return {"message": "Favorite removed successfully"}
