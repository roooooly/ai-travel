from sqlalchemy import Column, Integer, String, Text, Float
from ..core.database import Base


class Destination(Base):
    __tablename__ = "destinations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    city = Column(String(50), nullable=False, index=True)
    description = Column(Text)
    image_url = Column(String(500))
    latitude = Column(Float)
    longitude = Column(Float)
    province = Column(String(50), default="江苏省")
    country = Column(String(50), default="中国")
