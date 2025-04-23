from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Date, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from ..database.base_class import Base

class ProfessionalInfo(Base):
    __tablename__ = "professional_info"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    full_name = Column(String(100), nullable=False)
    professional_title = Column(String(100))
    bio = Column(Text)
    contact_info = Column(JSON)  # Email, phone, location, etc.
    social_links = Column(JSON)  # LinkedIn, GitHub, Portfolio, etc.
    skills = Column(JSON)  # Array of skills
    profile_image_url = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="professional_info")
    education = relationship("Education", back_populates="professional_info", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="professional_info", cascade="all, delete-orphan")

class Education(Base):
    __tablename__ = "education"

    id = Column(Integer, primary_key=True, index=True)
    professional_info_id = Column(Integer, ForeignKey("professional_info.id"), nullable=False)
    institution = Column(String(200), nullable=False)
    degree = Column(String(100))
    field_of_study = Column(String(100))
    start_date = Column(Date)
    end_date = Column(Date)
    is_current = Column(Boolean, default=False)
    description = Column(Text)
    gpa = Column(String(10))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    professional_info = relationship("ProfessionalInfo", back_populates="education")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    professional_info_id = Column(Integer, ForeignKey("professional_info.id"), nullable=False)
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

    # Relationships
    professional_info = relationship("ProfessionalInfo", back_populates="projects") 