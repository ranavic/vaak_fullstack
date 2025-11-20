from fastapi import FastAPI
from app.routers import auth, dictionary, translate, chat, test_db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Vaak API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://vaakfrontend.vercel.app",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(dictionary.router)
app.include_router(translate.router)
app.include_router(chat.router)
app.include_router(test_db.router)

@app.get("/")
async def root():
    return {"msg": "Vaak backend up"}
