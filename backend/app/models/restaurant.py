from sqlalchemy import Column, Integer, String, Text, Float, Boolean
from ..core.database import Base


class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    city = Column(String(50), nullable=False, index=True)
    description = Column(Text)
    address = Column(String(500))
    latitude = Column(Float)
    longitude = Column(Float)
    cuisine_type = Column(String(100))  # e.g., "苏帮菜", "川菜"
    average_price = Column(Float, default=0)
    rating = Column(Float, default=0)
    image_url = Column(String(500))
    tags = Column(String(500))  # JSON string of tags
    opening_hours = Column(String(200))
    is_recommended = Column(Boolean, default=False)
