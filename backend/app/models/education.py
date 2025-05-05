from sqlalchemy import Column, Integer, String, ForeignKey, Date, Boolean, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.database.database import Base

class Education(Base):
    __tablename__ = "educations"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    professional_info_id = Column(UUID(as_uuid=True), ForeignKey("professional_info.id"), nullable=False)
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

    professional_info = relationship("ProfessionalInfo", back_populates="educations")
