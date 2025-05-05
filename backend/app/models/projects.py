from sqlalchemy import Column, Integer, String, Text, ForeignKey, Date, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSON
import uuid
from datetime import datetime
from app.database.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    professional_info_id = Column(UUID(as_uuid=True), ForeignKey("professional_info.id"), nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    technologies = Column(JSON)  # Array of technologies used
    start_date = Column(Date)
    end_date = Column(Date)
    is_current = Column(Boolean, default=False)
    project_url = Column(String(255))
    github_url = Column(String(255))
    achievements = Column(JSON)  # Array of key achievements
    images = Column(JSON)  # Array of project image URLs
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    professional_info = relationship("ProfessionalInfo", back_populates="projects")
