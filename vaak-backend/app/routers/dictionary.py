from fastapi import APIRouter, HTTPException
from app.services.dictionary_service import get_definition, get_example

router = APIRouter(prefix="/api/dict", tags=["dictionary"])

@router.get("/define/{word}")
async def define_word(word: str):
    res = await get_definition(word)
    if not res:
        raise HTTPException(404, "Definition not found")
    return res  # now includes { "word": ..., "html": ... }

@router.get("/example/{word}")
async def example_word(word: str):
    ex = await get_example(word)
    if not ex:
        raise HTTPException(404, "Example not found")
    return {"word": word, "example": ex}
