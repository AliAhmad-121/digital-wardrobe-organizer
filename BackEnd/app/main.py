import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from sqlalchemy import text
from app.database import engine, SessionLocal
from dotenv import load_dotenv
load_dotenv()

from app import models
from app.routes import router
from app.auth import router as auth_router

app = FastAPI()

#  CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#  ROUTES
app.include_router(router)
app.include_router(auth_router)

#  STATIC FILES
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

#  CREATE TABLES
models.Base.metadata.create_all(bind=engine)


# 🔥 FIX: ADD PRICE COLUMN (SAFE FOR POSTGRES)
def fix_database():
    db = SessionLocal()
    try:
        # Price column
        db.execute(
            text(
                "ALTER TABLE garments "
                "ADD COLUMN IF NOT EXISTS price INTEGER DEFAULT 0;"
            )
        )

        # Brand column
        db.execute(
            text(
                "ALTER TABLE garments "
                "ADD COLUMN IF NOT EXISTS brand VARCHAR;"
            )
        )

        # Season column
        db.execute(
            text(
                "ALTER TABLE garments "
                "ADD COLUMN IF NOT EXISTS season VARCHAR;"
            )
        )

        db.commit()
        print("Database checked / updated (price, brand, season columns)")

    except Exception as e:
        print("DB Fix Error:", e)

    finally:
        db.close()


#  RUN FIX ON STARTUP
@app.on_event("startup")
def startup_event():
    fix_database()


# ==========================================================
#  EXPORT USER DATA
# ==========================================================
@app.get("/export-data/{user_id}")
def export_data(user_id: int):
    db = SessionLocal()

    try:
        # Get garments
        garments = db.execute(
            text("SELECT * FROM garments WHERE user_id = :uid"),
            {"uid": user_id}
        ).fetchall()

        # Get saved outfits (if table exists)
        try:
            saved_outfits = db.execute(
                text("SELECT * FROM saved_outfits WHERE user_id = :uid"),
                {"uid": user_id}
            ).fetchall()
        except Exception:
            saved_outfits = []

        # Get wear logs (if table exists)
        try:
            wear_logs = db.execute(
                text("SELECT * FROM wear_logs WHERE user_id = :uid"),
                {"uid": user_id}
            ).fetchall()
        except Exception:
            wear_logs = []

        export = {
            "garments": [dict(row._mapping) for row in garments],
            "saved_outfits": [dict(row._mapping) for row in saved_outfits],
            "wear_logs": [dict(row._mapping) for row in wear_logs],
        }

        return JSONResponse(content=export)

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

    finally:
        db.close()


# ==========================================================
#  DELETE ACCOUNT
# ==========================================================
@app.delete("/delete-account/{user_id}")
def delete_account(user_id: int):
    db = SessionLocal()

    try:
        # Delete saved outfits first (if table exists)
        try:
            db.execute(
                text("DELETE FROM saved_outfits WHERE user_id = :uid"),
                {"uid": user_id}
            )
        except Exception:
            pass

        # Delete wear logs (if table exists)
        try:
            db.execute(
                text("DELETE FROM wear_logs WHERE user_id = :uid"),
                {"uid": user_id}
            )
        except Exception:
            pass

        # Delete garments
        db.execute(
            text("DELETE FROM garments WHERE user_id = :uid"),
            {"uid": user_id}
        )

        # Delete user
        db.execute(
            text("DELETE FROM users WHERE id = :uid"),
            {"uid": user_id}
        )

        db.commit()

        return {"message": "Account deleted successfully."}

    except Exception as e:
        db.rollback()
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

    finally:
        db.close()