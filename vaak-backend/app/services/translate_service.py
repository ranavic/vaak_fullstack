import logging
import re

from deep_translator import GoogleTranslator
from indic_transliteration import sanscript
from indic_transliteration.sanscript import transliterate
from langdetect import detect

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
    return bool(re.match(r"^[A-Za-z0-9\s.,!?\'\"()-]+$", text))


def transliterate_to_roman(text: str, lang_code: str) -> str:
    script = LANG_SCRIPT_MAP.get(lang_code)
    if script:
        try:
            return transliterate(text, script, sanscript.ITRANS)
        except Exception as exc:
            logging.warning("Roman transliteration failed: %s", exc)
    return text


def transliterate_to_native(text: str, target_lang: str) -> str:
    script = LANG_SCRIPT_MAP.get(target_lang)
    if script and is_latin_text(text):
        try:
            return transliterate(text, sanscript.ITRANS, script)
        except Exception as exc:
            logging.warning("Native transliteration failed: %s", exc)
    return text


async def translate_text(text: str, target_lang: str, source_lang: str = "auto"):
    detected_source_lang = source_lang
    if not source_lang or source_lang.lower() in ["auto", "detect"]:
        try:
            detected_source_lang = detect(text)
            logging.info("Detected source language: %s", detected_source_lang)
        except Exception as exc:
            logging.warning("Language detection failed: %s", exc)
            detected_source_lang = "auto"

    translated_text = None
    try:
        translated_text = GoogleTranslator(source=detected_source_lang, target=target_lang).translate(text)
    except Exception as exc:
        logging.warning("First translation attempt failed: %s", exc)

    if not translated_text or translated_text.strip() == text.strip():
        try:
            transliterated_input = transliterate_to_native(text, detected_source_lang)
            translated_text = GoogleTranslator(source=detected_source_lang, target=target_lang).translate(transliterated_input)
            logging.info("Fallback transliteration-based translation used.")
        except Exception as exc:
            logging.error("Fallback translation failed: %s", exc)
            translated_text = text

    romanized = transliterate_to_roman(translated_text, target_lang)

    return {
        "source_lang": detected_source_lang,
        "target_lang": target_lang,
        "translated_text": translated_text,
        "romanized_text": romanized,
    }
