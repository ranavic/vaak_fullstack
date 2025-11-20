from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    display_name: Optional[str] = None

class UserInDB(BaseModel):
    id: Optional[str] = None
    email: EmailStr
    hashed_password: str
    display_name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class HistoryItem(BaseModel):
    user_id: Optional[str]
    query: str
    intent: str
    result: dict
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TranslateRequest(BaseModel):
    text: str = Field(..., description="Text to translate")
    target_lang: str = Field(..., description="Target language code (e.g., 'en', 'hi')")
    source_lang: Optional[str] = Field(
        default="auto",
        description="Source language code (default: auto-detect)"
    )
