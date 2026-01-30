from sqlalchemy import Column, Integer, String, Enum, Boolean
from app.database import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    password_hash = Column(String(255))
    role = Column(Enum("Admin", "User"))
    is_active = Column(Boolean, default=True)
