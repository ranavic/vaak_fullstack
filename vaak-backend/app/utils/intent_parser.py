import re
from typing import Dict, Any

LANGUAGE_NAMES = {
    "arabic",
    "bengali",
    "chinese",
    "danish",
    "dutch",
    "english",
    "finnish",
    "french",
    "german",
    "greek",
    "gujarati",
    "hindi",
    "italian",
    "japanese",
    "kannada",
    "korean",
    "malayalam",
    "marathi",
    "nepali",
    "norwegian",
    "odia",
    "polish",
    "portuguese",
    "punjabi",
    "russian",
    "sinhala",
    "spanish",
    "swedish",
    "tamil",
    "telugu",
    "turkish",
    "urdu",
}


def parse_intent(text: str) -> Dict[str, Any]:
    text_low = text.lower().strip()

    # ==========================
    # TRANSLATE INTENT DETECTION
    # ==========================

    # Pattern 1: "translate hello to spanish" or "convert goodbye into french"
    m = re.search(r"(?:translate|convert)\s+(.+?)\s+(?:to|into)\s+([a-zA-Z\-]+)$", text_low)
    if m:
        return {
            "intent": "translate",
            "text": m.group(1).strip(),
            "target": m.group(2).strip(),
        }

    # Pattern 2: "translate hello in hindi"
    m = re.search(r"(?:translate|convert)\s+(.+?)\s+in\s+([a-zA-Z\-]+)$", text_low)
    if m:
        return {
            "intent": "translate",
            "text": m.group(1).strip(),
            "target": m.group(2).strip(),
        }

    # ==========================
    # DEFINITION INTENT
    # ==========================
    for pattern in [
        r"^define\s+(.+)$",
        r"^definition of\s+(.+)$",
        r"^meaning of\s+(.+)$",
    ]:
        m = re.search(pattern, text_low)
        if m:
            return {"intent": "define", "word": m.group(1).strip()}

    # Pattern 3: simple "hello in hindi" or "good morning in french"
    m = re.search(r"^(.+?)\s+(?:in|to|into)\s+([a-zA-Z\-]+)$", text_low)
    if m:
        target = m.group(2).strip()
        if target in LANGUAGE_NAMES:
            return {
                "intent": "translate",
                "text": m.group(1).strip(),
                "target": target,
            }

    # Pattern 4: "translate hello" (no target specified)
    m = re.search(r"^translate\s+(.+)$", text_low)
    if m:
        return {
            "intent": "translate",
            "text": m.group(1).strip(),
            "target": "en",  # default to English
        }

    # Pattern 5: "<text> spanish" (only if the last word is a known language)
    m = re.search(r"^(.+?)\s+([a-zA-Z]{2,})$", text_low)
    if m:
        target = m.group(2).strip()
        if target in LANGUAGE_NAMES:
            return {
                "intent": "translate",
                "text": m.group(1).strip(),
                "target": target,
            }

    # ==========================
    # EXAMPLE INTENT
    # ==========================
    for pattern in [
        r"^give example for\s+(.+)$",
        r"^example of\s+(.+)$",
    ]:
        m = re.search(pattern, text_low)
        if m:
            return {"intent": "example", "word": m.group(1).strip()}

    # ==========================
    # PRONOUNCE INTENT
    # ==========================
    m = re.search(r"^pronounce\s+(.+)$", text_low)
    if m:
        return {"intent": "pronounce", "word": m.group(1).strip()}

    # ==========================
    # FALLBACKS
    # ==========================
    if len(text_low.split()) == 1:
        return {"intent": "define", "word": text_low}

    return {"intent": "chat", "text": text}
