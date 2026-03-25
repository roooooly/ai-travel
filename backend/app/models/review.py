from sqlalchemy import Column, Integer, String, DateTime, Float, Text, func
from ..core.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    target_type = Column(String(50), nullable=False, index=True)  # 'attraction', 'restaurant', 'destination'
    target_id = Column(Integer, nullable=False, index=True)
    rating = Column(Float, nullable=False)
    content = Column(Text, nullable=False)
    images = Column(Text, nullable=True)  # JSON array stored as text
    likes = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
