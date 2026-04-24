from sqlalchemy import Column, Integer, String, ForeignKey, Boolean 
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    password = Column(String)

    garments = relationship("Garment", back_populates="owner")
    saved_outfits = relationship("SavedOutfit", back_populates="user")  # ✅ NEW


class Garment(Base):
    __tablename__ = "garments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    category = Column(String)
    color = Column(String)
    image_path = Column(String)

    # 🔥 FIX: make price safe (prevents crashes)
    price = Column(Integer, default=0, nullable=False)

    # 🔥 NEW: LAUNDRY STATUS
    in_laundry = Column(Boolean, default=False)

    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="garments")
    wear_logs = relationship("WearLog", back_populates="garment")


class Outfit(Base):
    __tablename__ = "outfits"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))


class WearLog(Base):
    __tablename__ = "wear_logs"

    id = Column(Integer, primary_key=True, index=True)
    garment_id = Column(Integer, ForeignKey("garments.id"))
    date_worn = Column(String)

    garment = relationship("Garment", back_populates="wear_logs")


class SavedOutfit(Base):
    __tablename__ = "saved_outfits"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    garment_ids = Column(String)  # "1,5,8,10"
    date = Column(String, nullable=True)  # for planning

    # 🔥 FIX: proper relationship (you were missing back_populates)
    user = relationship("User", back_populates="saved_outfits")
    