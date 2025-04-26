from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
import uuid
import enum
from app.database.database import Base
from sqlalchemy.orm import relationship

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    password = Column(String)
    role = Column(Enum(UserRole), nullable=True, default=UserRole.USER)
    bio = Column(String, nullable=True)
    avatar = Column(String, nullable=True)
    reset_token = Column(String, nullable=True)
    reset_token_expires = Column(DateTime(timezone=True), nullable=True)
    projects = relationship("Project", back_populates="user")
    experiences = relationship("Experience", back_populates="user")
    educations = relationship("Education", back_populates="user")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    professional_info = relationship("ProfessionalInfo", back_populates="user", uselist=False) 