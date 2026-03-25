from sqlalchemy import Column, Integer, String, Text, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from ..core.database import Base


class Attraction(Base):
    __tablename__ = "attractions"

    id = Column(Integer, primary_key=True, index=True)
    destination_id = Column(Integer, ForeignKey("destinations.id"), index=True)
    name = Column(String(200), nullable=False, index=True)
    city = Column(String(50), nullable=False, index=True)
    description = Column(Text)
    address = Column(String(500))
    latitude = Column(Float)
    longitude = Column(Float)
    open_hours = Column(String(200))
    ticket_price = Column(Float, default=0)
    rating = Column(Float, default=0)
    image_url = Column(String(500))
    tags = Column(String(500))  # JSON string of tags
    is_recommended = Column(Boolean, default=False)
    recommended_duration = Column(String(100))  # e.g., "2-3小时"
