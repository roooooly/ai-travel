from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func
from ..core.database import Base


class Itinerary(Base):
    __tablename__ = "itineraries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)  # JSON string of itinerary days
    destination = Column(String(100), nullable=False, index=True)
    days = Column(Integer, nullable=False)
    preferences = Column(Text)  # JSON string of user preferences
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
