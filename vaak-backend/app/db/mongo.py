import motor.motor_asyncio
from app.core.config import settings

client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URI)
db = client[settings.DATABASE_NAME]

# Convenience accessors:
users_collection = db["users"]
history_collection = db["history"]
dictionary_collection = db["dictionary"]
translations_collection = db["translations"]

