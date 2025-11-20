from fastapi import APIRouter, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from app.utils.intent_parser import parse_intent
from app.services.dictionary_service import get_definition, get_example
from app.services.translate_service import translate_text
from app.db.mongo import history_collection
from bson import ObjectId
import re

router = APIRouter(prefix="/api/chat", tags=["chat"])

# ----------------------------
# HISTORY ROUTES
# ----------------------------

@router.delete("/history/{id}")
async def delete_history_item(id: str):
    result = await history_collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 1:
        return {"status": "deleted"}
    return JSONResponse(status_code=404, content={"error": "Item not found"})


@router.delete("/history")
async def clear_history():
    await history_collection.delete_many({})
    return {"status": "cleared"}


@router.get("/history/{id}")
async def get_history_item(id: str):
    doc = await history_collection.find_one({"_id": ObjectId(id)})
    if not doc:
        return JSONResponse(status_code=404, content={"error": "Item not found"})
    doc["id"] = str(doc["_id"])
    doc.pop("_id", None)
    return JSONResponse(content=jsonable_encoder(doc))


@router.get("/history")
async def get_history():
    docs = []
    async for doc in history_collection.find().sort("_id", -1):
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        docs.append(doc)
    return JSONResponse(content=jsonable_encoder(docs))


# ----------------------------
# MAIN CHAT ENDPOINT
# ----------------------------

@router.post("/message")
async def handle_message(payload: dict):
    text = payload.get("text", "").strip()
    user_id = payload.get("user_id")
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

        # detect "in Hindi" or "to French"
        match = re.search(r"^(.*?)\s+(?:in|to)\s+([A-Za-z]+)$", text_to_translate.strip(), re.IGNORECASE)
        if match:
            text_to_translate = match.group(1).strip()
            lang_name = match.group(2).lower()
            target = lang_map.get(lang_name, lang_name)

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
        "user_id": ObjectId(user_id) if user_id else None,
        "query": text,
        "intent": parsed["intent"],
        "result": result
    }
    await history_collection.insert_one(history_doc)

    return result
