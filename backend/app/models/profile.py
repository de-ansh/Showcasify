from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Date, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.database.database import Base

class ProfessionalInfo(Base):
    __tablename__ = "professional_info"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    contact_info = Column(JSON)  # Email, phone, location, etc.
    social_links = Column(JSON)  # LinkedIn, GitHub, Portfolio, etc.
    skills = Column(JSON)  # Array of skills
    profile_image_url = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="professional_info")
    educations = relationship("Education", back_populates="professional_info", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="professional_info", cascade="all, delete-orphan")
    experiences = relationship("Experience", back_populates="professional_info", cascade="all, delete-orphan")



