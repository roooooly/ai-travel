#!/usr/bin/env python3
"""初始化数据库表"""
import asyncio
import sys
sys.path.insert(0, '.')

from app.core.database import engine, Base
from app.models.destination import Destination
from app.models.attraction import Attraction
from app.models.restaurant import Restaurant
from app.models.itinerary import Itinerary
from app.models.knowledge_base import KnowledgeBase
from app.models.user import User


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    print("✅ 数据库表创建成功！")


if __name__ == "__main__":
    asyncio.run(init_db())
