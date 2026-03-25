from sqlalchemy import Column, Integer, String, Text, Float
from ..core.database import Base


class KnowledgeBase(Base):
    __tablename__ = "knowledge_base"

    id = Column(Integer, primary_key=True, index=True)
    content_type = Column(String(50), nullable=False, index=True)  # "attraction", "restaurant", "tip"
    content_id = Column(Integer, nullable=False, index=True)
    content_text = Column(Text, nullable=False)
    embedding = Column(Text)  # Store embedding vector as JSON string
    city = Column(String(50), index=True)
    tags = Column(String(500))
