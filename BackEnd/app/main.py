import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import text
from app.database import engine, SessionLocal
from dotenv import load_dotenv
load_dotenv()
from app import models
from app.routes import router
from app.auth import router as auth_router

app = FastAPI()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ ROUTES
app.include_router(router)
app.include_router(auth_router)

# ✅ STATIC FILES
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# ✅ CREATE TABLES
models.Base.metadata.create_all(bind=engine)

# 🔥 FIX: ADD PRICE COLUMN (SAFE FOR POSTGRES)
def fix_database():
    db = SessionLocal()
    try:
        db.execute(
            text("ALTER TABLE garments ADD COLUMN IF NOT EXISTS price INTEGER DEFAULT 0;")
        )
        db.commit()
        print("✅ Database checked / updated (price column)")
    except Exception as e:
        print("⚠️ DB Fix Error:", e)
    finally:
        db.close()

# 🔥 RUN FIX ON STARTUP
@app.on_event("startup")
def startup_event():
    fix_database()