from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from app.models.schemas import TranslateRequest
from app.services.translate_service import translate_text

router = APIRouter(prefix="/api/translate", tags=["translate"])

LANGUAGES = [
    {"code": "en", "name": "English"},
    {"code": "hi", "name": "Hindi"},
    {"code": "bn", "name": "Bengali"},
    {"code": "ta", "name": "Tamil"},
    {"code": "te", "name": "Telugu"},
    {"code": "kn", "name": "Kannada"},
    {"code": "ml", "name": "Malayalam"},
    {"code": "mr", "name": "Marathi"},
    {"code": "gu", "name": "Gujarati"},
    {"code": "pa", "name": "Punjabi"},
    {"code": "ur", "name": "Urdu"},
    {"code": "or", "name": "Odia"},
    {"code": "ne", "name": "Nepali"},
    {"code": "si", "name": "Sinhala"},
    {"code": "es", "name": "Spanish"},
    {"code": "fr", "name": "French"},
    {"code": "de", "name": "German"},
    {"code": "tr", "name": "Turkish"},
    {"code": "it", "name": "Italian"},
    {"code": "ru", "name": "Russian"},
    {"code": "zh", "name": "Chinese"},
    {"code": "ja", "name": "Japanese"},
    {"code": "ko", "name": "Korean"},
    {"code": "pt", "name": "Portuguese"},
    {"code": "pl", "name": "Polish"},
    {"code": "nl", "name": "Dutch"},
    {"code": "sv", "name": "Swedish"},
    {"code": "fi", "name": "Finnish"},
    {"code": "no", "name": "Norwegian"},
    {"code": "da", "name": "Danish"},
    {"code": "el", "name": "Greek"},
    {"code": "ar", "name": "Arabic"},
]


@router.get("/languages")
async def get_languages():
    """Return list of supported languages."""
    return JSONResponse(content=LANGUAGES)


@router.post("/")
async def translate(req: TranslateRequest):
    """Translate given text."""
    try:
        res = await translate_text(req.text, req.target_lang, req.source_lang)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
