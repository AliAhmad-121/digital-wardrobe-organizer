from fastapi import APIRouter, Depends, Form
from sqlalchemy.orm import Session
from .database import get_db
from .models import User

router = APIRouter()

@router.post("/auth/signup")
def signup(
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):

    user = User(
        email=email,
        password=password
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "User created successfully"}


@router.post("/auth/login")
def login(
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(User.email == email).first()

    if not user or user.password != password:
        return {"error": "Invalid credentials"}

    return {
    "message": "Login successful",
    "user_id": user.id
}