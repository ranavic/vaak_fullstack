from gtts import gTTS
from io import BytesIO

async def synthesize_gtts(text: str, lang: str = "en") -> bytes:
    tts = gTTS(text=text, lang=lang)
    buf = BytesIO()
    tts.write_to_fp(buf)
    buf.seek(0)
    return buf.read()
