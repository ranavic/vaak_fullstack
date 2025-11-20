from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import UserCreate, Token
from app.db.mongo import users_collection
from app.core.security import hash_password, verify_password, create_access_token
from bson import ObjectId

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=Token)
async def register(user: UserCreate):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = hash_password(user.password)
    doc = {
        "email": user.email,
        "hashed_password": hashed,
        "display_name": user.display_name,
    }
    res = await users_collection.insert_one(doc)
    token = create_access_token({"sub": str(res.inserted_id)})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(user: UserCreate):  # accept email + password
    doc = await users_collection.find_one({"email": user.email})
    if not doc or not verify_password(user.password, doc["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(doc["_id"])})
    return {"access_token": token, "token_type": "bearer"}
