import asyncio
from app.core.database import engine, Base
from app.models.user import User
from app.models.review import Review
from app.models.favorite import Favorite
from app.models.attraction import Attraction
from app.models.restaurant import Restaurant
from app.models.destination import Destination
from app.models.itinerary import Itinerary

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tables created successfully!")

if __name__ == "__main__":
    asyncio.run(create_tables())
