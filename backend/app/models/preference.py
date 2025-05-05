from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database.database import Base
from datetime import datetime

class Preference(Base):
    __tablename__ = "preferences"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True)
    primary_color = Column(String, nullable=True)
    secondary_color = Column(String, nullable=True)
    font_style = Column(String, nullable=True)
    layout_option = Column(String, nullable=True)
    theme = Column(String, default="light")
    language = Column(String, default="en")
    created_at = Column(DateTime, default=datetime.utcnow())
    updated_at = Column(DateTime, default=datetime.utcnow(), onupdate=datetime.utcnow)

    user = relationship("User", back_populates="preference")
