import httpx
from typing import Optional
import logging

FREE_DICT_URL = "https://api.dictionaryapi.dev/api/v2/entries/en"

async def get_definition(word: str) -> Optional[dict]:
    """
    Fetch a word definition and return structured + HTML response.
    """
    url = f"{FREE_DICT_URL}/{word}"
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            r = await client.get(url)
            if r.status_code != 200:
                logging.error(f"Dictionary API request failed with status code {r.status_code}: {r.text}")
                return {"word": word, "html": "No definition found."}

            data = r.json()
            entry = data[0]

            html = ""
            if "word" in entry:
                html += f"<strong>{entry['word']}</strong><br/>"

            phonetics = entry.get("phonetics", [])
            phonetic_texts = [p.get("text") for p in phonetics if p.get("text")]
            if phonetic_texts:
                html += f"<em>Phonetics:</em> {', '.join(phonetic_texts)}<br/>"

            meanings = entry.get("meanings", [])
            for i, meaning in enumerate(meanings, start=1):
                part = meaning.get("partOfSpeech", "")
                html += f"<div style='margin-top:6px;'><b>{i}. {part}</b>"
                html += "<ul style='margin:0 0 0 18px;padding:0;'>"
                for defn in meaning.get("definitions", []):
                    definition = defn.get("definition", "")
                    example = defn.get("example")
                    html += f"<li>{definition}"
                    if example:
                        html += f"<br/><span style='color:#666;'>e.g., {example}</span>"
                    html += "</li>"
                html += "</ul></div>"

            sources = entry.get("sourceUrls", [])
            if sources:
                html += f"<div style='margin-top:8px;'><a href='{sources[0]}' target='_blank' rel='noopener noreferrer'>Source</a></div>"

            return {
                "word": entry.get("word", word),
                "phonetics": phonetic_texts,
                "meanings": meanings,
                "sourceUrls": entry.get("sourceUrls", []),
                "html": html or "No definition found."
            }

        except httpx.RequestError as e:
            logging.error(f"An error occurred while requesting {e.request.url!r}: {e}")
            return {"word": word, "html": "No definition found."}


async def get_example(word: str) -> Optional[str]:
    """Fetch an example sentence for a given word directly from the API."""
    url = f"{FREE_DICT_URL}/{word}"
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            r = await client.get(url)
            if r.status_code != 200:
                logging.error(f"Dictionary example request failed ({r.status_code}): {r.text}")
                return None

            data = r.json()
            if not data or not isinstance(data, list):
                return None

            # Loop through meanings and definitions to find an example
            for meaning in data[0].get("meanings", []):
                for defn in meaning.get("definitions", []):
                    if "example" in defn:
                        return defn["example"]
            return None

        except Exception as e:
            logging.error(f"Error fetching example for {word}: {e}")
            return None
