from fastapi import APIRouter
from app.db.mongo import db

router = APIRouter()

@router.get("/test-db")
async def test_db_connection():
    try:
        collections = await db.list_collection_names()
        return {"status": "connected", "collections": collections}
    except Exception as e:
        return {"status": "error", "details": str(e)}
