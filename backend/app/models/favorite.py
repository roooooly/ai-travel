from sqlalchemy import Column, Integer, String, DateTime, func
from ..core.database import Base


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    target_type = Column(String(50), nullable=False, index=True)  # 'attraction', 'restaurant', 'destination'
    target_id = Column(Integer, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
