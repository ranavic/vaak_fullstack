from fastapi import FastAPI
from app.routers import auth, dictionary, translate, chat, test_db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Vaak API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend dev server
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
