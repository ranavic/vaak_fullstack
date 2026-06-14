from typing import Optional

from bson import ObjectId
from fastapi import Depends, Header, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.security import decode_access_token
from app.db.mongo import users_collection

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


async def get_current_user_id(token: Optional[str] = Depends(oauth2_scheme)) -> Optional[ObjectId]:
    if not token:
        return None

    payload = decode_access_token(token)
    user_id = payload.get("sub") if payload else None
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    try:
        object_id = ObjectId(user_id)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token subject",
        ) from exc

    user = await users_collection.find_one({"_id": object_id}, {"_id": 1})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return object_id


def get_session_id(x_session_id: Optional[str] = Header(default=None)) -> Optional[str]:
    if not x_session_id:
        return None

    session_id = x_session_id.strip()
    if not session_id:
        return None

    if len(session_id) > 128:
        raise HTTPException(status_code=400, detail="Session id is too long")
    return session_id
