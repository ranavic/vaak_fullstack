from deep_translator import GoogleTranslator
from indic_transliteration import sanscript
from indic_transliteration.sanscript import transliterate
from langdetect import detect
import re

# Supported Indian language scripts
LANG_SCRIPT_MAP = {
    "hi": sanscript.DEVANAGARI,
    "mr": sanscript.DEVANAGARI,
    "bn": sanscript.BENGALI,
    "ta": sanscript.TAMIL,
    "te": sanscript.TELUGU,
    "kn": sanscript.KANNADA,
    "gu": sanscript.GUJARATI,
    "ml": sanscript.MALAYALAM,
    "pa": sanscript.GURMUKHI,
    "or": sanscript.ORIYA,
}


def is_latin_text(text: str) -> bool:
    """Check if text uses English letters."""
    return bool(re.match(r'^[A-Za-z0-9\s.,!?\'"()-]+$', text))


def transliterate_to_roman(text: str, lang_code: str) -> str:
    """Convert Indic script text to Roman (English) letters."""
    script = LANG_SCRIPT_MAP.get(lang_code)
    if script:
        try:
            return transliterate(text, script, sanscript.ITRANS)
        except Exception as e:
            print(f"[WARN] Roman transliteration failed: {e}")
    return text


def transliterate_to_native(text: str, target_lang: str) -> str:
    """Convert Romanized Indic text (like 'namaste') into native script (like 'नमस्ते')."""
    script = LANG_SCRIPT_MAP.get(target_lang)
    if script and is_latin_text(text):
        try:
            return transliterate(text, sanscript.ITRANS, script)
        except Exception as e:
            print(f"[WARN] Native transliteration failed: {e}")
    return text


async def translate_text(text: str, target_lang: str, source_lang: str = "auto"):
    """Accurate bidirectional translation using Deep Translator only."""

    # Step 1: Detect source language if not provided
    detected_source_lang = source_lang
    if not source_lang or source_lang.lower() in ["auto", "detect"]:
        try:
            detected_source_lang = detect(text)
            print(f"[INFO] Detected source language: {detected_source_lang}")
        except Exception as e:
            print(f"[WARN] Language detection failed: {e}")
            detected_source_lang = "auto"

    translated_text = None

    # Step 2: Try translating with detected language
    try:
        translated_text = GoogleTranslator(source=detected_source_lang, target=target_lang).translate(text)
    except Exception as e:
        print(f"[WARN] First translation attempt failed: {e}")

    # Step 3: Fallback — if translation failed or returned identical text, retry with ITRANS transliteration
    if not translated_text or translated_text.strip() == text.strip():
        try:
            transliterated_input = transliterate_to_native(text, detected_source_lang)
            translated_text = GoogleTranslator(source=detected_source_lang, target=target_lang).translate(transliterated_input)
            print("[INFO] Fallback transliteration-based translation used.")
        except Exception as e:
            print(f"[ERROR] Fallback translation failed: {e}")
            translated_text = text

    # Step 4: Add Romanized output if target is Indic
    romanized = transliterate_to_roman(translated_text, target_lang)

    return {
        "source_lang": detected_source_lang,
        "target_lang": target_lang,
        "translated_text": translated_text,
        "romanized_text": romanized,
    }
