import os
import shutil
import cv2
import numpy as np
import random
import requests

from fastapi import APIRouter, Depends, Form, File, UploadFile, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime

from app.database import SessionLocal
from app.models import Garment, WearLog
from app.models import Garment, WearLog, SavedOutfit

router = APIRouter()

# ===============================
# DATABASE
# ===============================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ===============================
# UPLOAD FOLDER
# ===============================
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "app", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ===============================
# WEATHER API KEY
# ===============================
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")

# ===============================
# FORMAT ITEM (FIXED)
# ===============================
def format_item(item):
    if not item:
        return None

    image = item.image_path or ""

    # 🔥 normalize path
    image = image.replace("\\", "/")

    # 🔥 extract filename only
    filename = image.split("/")[-1]

    return {
        "id": item.id,
        "name": item.name,
        "category": item.category,
        "image": f"/uploads/{filename}"
    }

# ===============================
# 🔥 NEW: COLOR SCORE FUNCTION
# ===============================
def score_outfit(top, bottom, shoes):
    score = 0

    # 🎨 color matching
    if top.color == bottom.color:
        score += 2

    if shoes and shoes.color == bottom.color:
        score += 1

    # neutral colors boost
    neutral = ["black", "white", "gray"]
    if top.color in neutral:
        score += 1

    return score


# ===============================
# COLOR DETECTION
# ===============================
def detect_color_name(image):
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    avg_hsv = np.mean(hsv, axis=(0,1))
    h, s, v = avg_hsv

    if v < 50:
        return "Black"
    if v > 200 and s < 40:
        return "White"
    if s < 40:
        return "Gray"
    if h < 15 or h > 160:
        return "Red"
    elif h < 35:
        return "Yellow"
    elif h < 85:
        return "Green"
    elif h < 130:
        return "Blue"
    else:
        return "Purple"


# ===============================
# BACKGROUND REMOVAL 🔥
# ===============================
def remove_background(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # blur helps separate object
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # adaptive threshold (KEY upgrade)
    mask = cv2.adaptiveThreshold(
        blurred,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        11,
        2
    )

    # clean mask
    kernel = np.ones((3, 3), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=2)

    result = cv2.bitwise_and(image, image, mask=mask)

    return result

# ===============================
# IMAGE PROCESSING PIPELINE 🔥
# ===============================
def process_image(image):
    # resize for consistency
    image = cv2.resize(image, (300, 300))

    # remove background
    image = remove_background(image)

    return image


# ===============================
# GET CLOTHES
# ===============================
@router.get("/clothes/{user_id}")
def get_clothes(user_id: int, db: Session = Depends(get_db)):
    garments = db.query(Garment).filter(Garment.user_id == user_id).all()
    return [format_item(g) for g in garments]

# ===============================
# UPLOAD GARMENT
# ===============================
@router.post("/upload-garment")
async def upload_garment(
    name: str = Form(...),
    category: str = Form(...),
    user_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    file_location = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image = cv2.imread(file_location)
    if image is None:
            raise HTTPException(status_code=400, detail="Invalid image")
    image = process_image(image)
    color = detect_color_name(image)

    # 🔥 DUPLICATE CHECK (FIXED POSITION — ONLY CHANGE)
    duplicates = check_duplicate(db, user_id, category, color)

    duplicate_warning = None

    if duplicates:
     return {
        "message": "Duplicate detected",
        "duplicate": f"You already own similar {color} {category.lower()}!"
    }

    garment = Garment(
        name=name,
        category=category,
        color=color,
        image_path=f"/uploads/{file.filename}",
        user_id=user_id
    )

    db.add(garment)
    db.commit()
    db.refresh(garment)

    return {
    "message": "Garment uploaded",
    "duplicate": duplicate_warning
}
# ===============================
# DELETE
# ===============================
@router.delete("/clothes/{garment_id}")
def delete_garment(garment_id: int, db: Session = Depends(get_db)):
    garment = db.query(Garment).filter(Garment.id == garment_id).first()

    if not garment:
        raise HTTPException(status_code=404, detail="Not found")

    db.delete(garment)
    db.commit()
    return {"message": "Deleted"}

# ===============================
# MARK AS WORN
# ===============================
@router.post("/wear/{garment_id}")
def mark_as_worn(garment_id: int, db: Session = Depends(get_db)):
    garment = db.query(Garment).filter(Garment.id == garment_id).first()

    if not garment:
        raise HTTPException(status_code=404, detail="Not found")

    log = WearLog(
        garment_id=garment_id,
        date_worn=str(datetime.now())
    )

    db.add(log)
    db.commit()

    return {"message": "updated"}

# ===============================
# STATS
# ===============================
@router.get("/stats/overview/{user_id}")
def get_stats(user_id: int, db: Session = Depends(get_db)):

    garments = db.query(Garment).filter(Garment.user_id == user_id).all()

    total_garments = len(garments)

    total_wears = (
        db.query(WearLog)
        .join(Garment, Garment.id == WearLog.garment_id)
        .filter(Garment.user_id == user_id)
        .count()
    )

    most_worn = (
        db.query(WearLog.garment_id, func.count().label("count"))
        .join(Garment)
        .filter(Garment.user_id == user_id)
        .group_by(WearLog.garment_id)
        .order_by(func.count().desc())
        .first()
    )

    # 🔥 NEW: ADVANCED STATS
    total_value = 0
    insights = []
    never_worn = []
    last_worn_items = []

    for garment in garments:
        wear_count = len(garment.wear_logs)
        price = garment.price or 0

        # ✅ FIXED: LAST WORN
        last_worn = None
        if garment.wear_logs:
            last_worn = max(log.date_worn for log in garment.wear_logs)

            last_worn_items.append({
                "name": garment.name,
                "date": last_worn
            })

        total_value += price

        # 🔁 NEVER WORN
        if wear_count == 0:
            never_worn.append(garment.name)

        # 💰 COST PER WEAR
        cost_per_wear = price / max(wear_count, 1)

        # 🧠 INSIGHTS
        if wear_count == 0:
            insights.append(f"{garment.name} is never worn 😬")

        if cost_per_wear > 20:
            insights.append(f"{garment.name} is expensive per wear 💸")

        if wear_count > 10:
            insights.append(f"{garment.name} is great value 🔥")

    # 🔁 ROTATION RATE
    rotation_rate = total_wears / max(total_garments, 1)

    # 🆕 NEW: RECENT ACTIVITY (ONLY ADDED)
    recent_wears = (
        db.query(WearLog)
        .join(Garment)
        .filter(Garment.user_id == user_id)
        .order_by(WearLog.date_worn.desc())
        .limit(5)
        .all()
    )

    recent_activity = [
    {
        "name": w.garment.name,   # ✅ get name
        "date": w.date_worn
    }
    for w in recent_wears
]

    return {
        "total_garments": total_garments,
        "total_wears": total_wears,
        "rotation_rate": round(rotation_rate, 2),
        "total_value": total_value,
        "insights": insights[:5],
        "most_worn": most_worn.garment_id if most_worn else None,
        "never_worn_items": never_worn,

        # ✅ EXISTING
        "last_worn_items": last_worn_items[:5],

        # 🆕 ONLY NEW LINE
        "recent_activity": recent_activity
    }

# ===============================
# WEATHER ONLY 🌤️
# ===============================
@router.get("/weather/{city}")
def get_weather(city: str):

    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={WEATHER_API_KEY}&units=metric"

    print("CITY:", city)
    print("API KEY:", WEATHER_API_KEY)

    res = requests.get(url)
    data = res.json()

    print("WEATHER:", data)

    # ✅ FIXED VALIDATION
    if res.status_code != 200 or str(data.get("cod")) != "200":
        return {"message": "Invalid city name"}
    

    
    return {
        "temp": data["main"]["temp"],
        "condition": data["weather"][0]["main"]
    }

# ===============================
# SMART OUTFIT 🔥 (FIXED)
# ===============================
@router.get("/recommend-outfit/{user_id}/{city}")
def recommend_outfit(user_id: int, city: str, db: Session = Depends(get_db)):

    # 🌤️ WEATHER API
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={WEATHER_API_KEY}&units=metric"

    res = requests.get(url)
    data = res.json()

    print("WEATHER:", data)

    # ✅ SAFE VALIDATION (NO CRASH)
    if res.status_code != 200 or str(data.get("cod")) != "200":
        return {"message": "Invalid city name"}

    temp = data["main"]["temp"]
    condition = data["weather"][0]["main"]

    # 🧠 EXPLANATION
    explanation = []

    if temp < 15:
        explanation.append("It's cold, so warm layers are recommended 🧥")
    elif temp > 25:
        explanation.append("It's hot, so light clothing is chosen ☀️")
    else:
        explanation.append("Mild weather, balanced outfit selected 🌤️")

    if condition.lower() in ["rain", "drizzle"]:
        explanation.append("Rain expected, choosing practical outerwear ☔")

    if condition.lower() in ["clear"]:
        explanation.append("Clear weather, flexible outfit choices 😎")

    # 👕 GET CLOTHES
    garments = db.query(Garment).filter(Garment.user_id == user_id).all()

    if not garments:
        return {"message": "No clothes found"}

    tops = [g for g in garments if g.category == "Top"]
    bottoms = [g for g in garments if g.category == "Bottom"]
    shoes = [g for g in garments if g.category == "Shoes"]
    outerwear = [g for g in garments if g.category == "Outerwear"]

    # 🔥 WEATHER FILTER
    tops = filter_by_weather(tops, temp, condition)
    bottoms = filter_by_weather(bottoms, temp, condition)
    shoes = filter_by_weather(shoes, temp, condition)
    outerwear = filter_by_weather(outerwear, temp, condition)

    if not tops or not bottoms:
        return {"message": "Not enough clothes"}

    # 🔥 JACKET LOGIC
    jacket = None

    if temp < 15:
        jacket = random.choice(outerwear) if outerwear else None
    elif temp > 25:
        jacket = None
    else:
        if outerwear and random.random() > 0.5:
            jacket = random.choice(outerwear)

    if condition.lower() in ["rain", "drizzle"] and outerwear:
        jacket = random.choice(outerwear)

    # 🔥 SMART ENGINE (FIXED INDENTATION)
    outfits = []

    for _ in range(5):
        t = random.choice(tops)
        b = random.choice(bottoms)
        s = random.choice(shoes) if shoes else None

        score = score_outfit(t, b, s)

        outfits.append({
            "items": [t, b, s],
            "score": score
        })

    # 🔥 PICK BEST
    best = max(outfits, key=lambda x: x["score"])

    # 🔥 FORMAT
    outfit = [format_item(item) for item in best["items"] if item]

    if jacket:
        outfit.append(format_item(jacket))

    explanation.append(
        f"Outfit selected with score {best['score']} based on color matching 🎨"
    )

    # ✅ FINAL RETURN (MISSING BEFORE)
    return {
        "weather": {
            "temp": temp,
            "condition": condition
        },
        "outfit": outfit,
        "explanation": explanation
    }


# ===============================
# WEATHER FILTER (UPDATED 🔥)
# ===============================
def filter_by_weather(items, temp, condition):
    filtered = []

    condition = condition.lower()

    for item in items:
        name = (item.name or "").lower()
        category = (item.category or "").lower()

        # ❄️ COLD WEATHER
        if temp < 15:
            if "short" in name:
                continue

        # 🔥 HOT WEATHER
        if temp > 25:
            if any(word in name for word in ["jacket", "hoodie", "coat", "sweater"]):
                continue

        # 🌧️ RAIN
        if "rain" in condition or "drizzle" in condition:
            if any(word in name for word in ["sandal", "slipper"]):
                continue

        # 🌬️ WIND (small upgrade)
        if temp < 20 and "wind" in condition:
            if "short" in name:
                continue

        filtered.append(item)

    # 🔁 fallback (important)
    return filtered if filtered else items
# ===============================
# SAVE OUTFIT
# ===============================
@router.post("/save-outfit")
def save_outfit(data: dict, db: Session = Depends(get_db)):

    user_id = data.get("user_id")
    items = data.get("items")

    # 🆕 NEW: allow custom date
    date = data.get("date") or str(datetime.now())

    if not items:
        raise HTTPException(status_code=400, detail="No items provided")

    garment_ids = ",".join([str(i) for i in items])

    outfit = SavedOutfit(
        user_id=user_id,
        garment_ids=garment_ids,
        date=date  # 🔥 UPDATED (was datetime.now())
    )

    db.add(outfit)
    db.commit()
    db.refresh(outfit)

    return {"message": "Outfit saved"}


# ===============================
# GET SAVED OUTFITS
# ===============================
@router.get("/saved-outfits/{user_id}")
def get_saved_outfits(user_id: int, db: Session = Depends(get_db)):

    outfits = db.query(SavedOutfit).filter(SavedOutfit.user_id == user_id).all()

    result = []

    for outfit in outfits:
        item_ids = outfit.garment_ids.split(",")

        items = []

        for gid in item_ids:
            garment = db.query(Garment).filter(Garment.id == int(gid)).first()

            if garment:
                image = garment.image_path or ""

                # 🔥 normalize Windows paths
                image = image.replace("\\", "/")

                # 🔥 extract only filename
                filename = image.split("/")[-1]

                items.append({
                    "id": garment.id,
                    "name": garment.name,
                    "image": f"/uploads/{filename}"
                })

        result.append({
            "id": outfit.id,
            "date": outfit.date,
            "items": items
        })

    return result

print("API KEY:", WEATHER_API_KEY)

# 🔥 NEW ROUTE
@router.post("/wear-outfit")
def wear_outfit(data: dict, db: Session = Depends(get_db)):

    garment_ids = data.get("items", [])

    for gid in garment_ids:
        log = WearLog(
            garment_id=gid,
            date_worn=str(datetime.now())
        )
        db.add(log)

    db.commit()

    return {"message": "Outfit logged"}

# ===============================
# DUPLICATE DETECTION 🔥
# ===============================
def check_duplicate(db, user_id, category, color):
    existing = db.query(Garment).filter(
        Garment.user_id == user_id,
        Garment.category == category,
        Garment.color == color
    ).all()

    return existing

# ===============================
# TOGGLE LAUNDRY 🔥
# ===============================
@router.put("/toggle-laundry/{garment_id}")
def toggle_laundry(garment_id: int, db: Session = Depends(get_db)):

    garment = db.query(Garment).filter(Garment.id == garment_id).first()

    if not garment:
        raise HTTPException(status_code=404, detail="Garment not found")

    garment.in_laundry = not garment.in_laundry

    db.commit()

    return {
        "message": "Updated",
        "in_laundry": garment.in_laundry
    }

# ===============================
# LAUNDRY + WORN ITEMS 🔥
# ===============================
@router.get("/laundry/{user_id}")
def get_laundry_items(user_id: int, db: Session = Depends(get_db)):

    garments = db.query(Garment).filter(Garment.user_id == user_id).all()

    worn_items = []
    laundry_items = []

    for g in garments:
        # 🧺 laundry
        if g.in_laundry:
            laundry_items.append(format_item(g))

        # 👕 worn
        if g.wear_logs:
            last_worn = max(log.date_worn for log in g.wear_logs)
            worn_items.append({
                "name": g.name,
                "date": last_worn,
                "image": g.image_path
            })

    return {
        "worn": worn_items[:10],
        "laundry": laundry_items
    }

from sqlalchemy import text

@router.get("/debug-db")
def debug_db(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT current_database()")).fetchone()
    return {"database": result[0]}

