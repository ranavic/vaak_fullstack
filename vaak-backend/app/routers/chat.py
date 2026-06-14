from datetime import datetime

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from app.deps import get_current_user_id, get_session_id
from app.utils.intent_parser import parse_intent
from app.services.dictionary_service import get_definition, get_example
from app.services.translate_service import translate_text
from app.db.mongo import history_collection
import re

router = APIRouter(prefix="/api/chat", tags=["chat"])

# ----------------------------
# HISTORY ROUTES
# ----------------------------

def build_history_scope(user_id: ObjectId | None, session_id: str | None) -> dict:
    if user_id:
        return {"user_id": user_id}
    if session_id:
        return {"session_id": session_id}
    raise HTTPException(status_code=400, detail="Missing session id")


def serialize_history_doc(doc: dict) -> dict:
    doc["id"] = str(doc["_id"])
    doc.pop("_id", None)
    if doc.get("user_id"):
        doc["user_id"] = str(doc["user_id"])
    return doc


@router.delete("/history/{id}")
async def delete_history_item(
    id: str,
    user_id: ObjectId | None = Depends(get_current_user_id),
    session_id: str | None = Depends(get_session_id),
):
    scope = build_history_scope(user_id, session_id)
    try:
        result = await history_collection.delete_one({"_id": ObjectId(id), **scope})
    except Exception:
        return JSONResponse(status_code=400, content={"error": "Invalid ID format"})
        
    if result.deleted_count == 1:
        return {"status": "deleted"}
    return JSONResponse(status_code=404, content={"error": "Item not found"})


@router.delete("/history")
async def clear_history(
    user_id: ObjectId | None = Depends(get_current_user_id),
    session_id: str | None = Depends(get_session_id),
):
    scope = build_history_scope(user_id, session_id)
    await history_collection.delete_many(scope)
    return {"status": "cleared"}


@router.get("/history/{id}")
async def get_history_item(
    id: str,
    user_id: ObjectId | None = Depends(get_current_user_id),
    session_id: str | None = Depends(get_session_id),
):
    scope = build_history_scope(user_id, session_id)
    try:
        doc = await history_collection.find_one({"_id": ObjectId(id), **scope})
    except Exception:
        return JSONResponse(status_code=400, content={"error": "Invalid ID format"})
        
    if not doc:
        return JSONResponse(status_code=404, content={"error": "Item not found"})
    return JSONResponse(content=jsonable_encoder(serialize_history_doc(doc)))


@router.get("/history")
async def get_history(
    user_id: ObjectId | None = Depends(get_current_user_id),
    session_id: str | None = Depends(get_session_id),
):
    scope = build_history_scope(user_id, session_id)
    docs = []
    async for doc in history_collection.find(scope).sort("_id", -1):
        docs.append(serialize_history_doc(doc))
    return JSONResponse(content=jsonable_encoder(docs))


# ----------------------------
# MAIN CHAT ENDPOINT
# ----------------------------

@router.post("/message")
async def handle_message(
    payload: dict,
    user_id: ObjectId | None = Depends(get_current_user_id),
    session_id: str | None = Depends(get_session_id),
):
    text = payload.get("text", "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="Message text is required")
    if not user_id and not session_id:
        raise HTTPException(status_code=400, detail="Missing session id")

    parsed = parse_intent(text)
    result = {"intent": parsed["intent"]}

    # Helper: map language names to ISO codes
    lang_map = {
        "hindi": "hi",
        "french": "fr",
        "spanish": "es",
        "german": "de",
        "italian": "it",
        "english": "en",
        "japanese": "ja",
        "korean": "ko",
        "chinese": "zh-cn",
        "arabic": "ar",
        "russian": "ru",
        "bengali": "bn",
        "tamil": "ta",
        "telugu": "te",
        "kannada": "kn",
        "gujarati": "gu",
        "malayalam": "ml",
        "marathi": "mr",
        "punjabi": "pa"
    }

    # --- TRANSLATE ---
    if parsed["intent"] == "translate":
        text_to_translate = parsed.get("text") or payload.get("text", "")
        source = parsed.get("source") or payload.get("source_lang", "auto")
        target = parsed.get("target") or payload.get("target_lang", "en")

        # Fallback detect "in Hindi" or "to French" if intent parser missed it
        match = re.search(r"^(.*?)\s+(?:in|to)\s+([A-Za-z]+)$", text_to_translate.strip(), re.IGNORECASE)
        if match:
            text_to_translate = match.group(1).strip()
            target = match.group(2).lower()
            
        target = lang_map.get(target.lower(), target.lower())

        translated = await translate_text(text_to_translate, target, source)
        result["translation"] = translated

    # --- DEFINE ---
    elif parsed["intent"] == "define":
        word = parsed["word"]
        definition = await get_definition(word)
        # Always return consistent structure
        if isinstance(definition, dict):
            result["definition"] = definition
        else:
            result["definition"] = {"word": word, "html": str(definition)}

    # --- EXAMPLE ---
    elif parsed["intent"] == "example":
        ex = await get_example(parsed["word"])
        result["example"] = ex or "No example found."

    # --- FALLBACK ---
    else:
        if len(text.split()) == 1:
            definition = await get_definition(text)
            # Ensure the frontend knows this is a definition result
            result["intent"] = "define"
            result["definition"] = (
                definition if isinstance(definition, dict)
                else {"word": text, "html": str(definition)}
            )
        else:
            result["text"] = "Sorry, I couldn't interpret that. Try 'X to Spanish' or 'meaning of serendipity'."

    # --- SAVE CHAT HISTORY ---
    history_doc = {
        "user_id": user_id,
        "session_id": session_id,
        "query": text,
        "intent": result["intent"],
        "result": result,
        "created_at": datetime.utcnow(),
    }
    await history_collection.insert_one(history_doc)

    return result
