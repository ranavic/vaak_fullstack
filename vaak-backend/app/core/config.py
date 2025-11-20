from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGODB_URI: str
    DATABASE_NAME: str = "vaak"
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    LIBRETRANSLATE_URL: str = "https://libretranslate.com/translate"
    DEFAULT_TTS_PROVIDER: str = "gtts"

    class Config:
        env_file = ".env"
        extra = "ignore"
        
settings = Settings()
