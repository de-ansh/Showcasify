from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.database.database import Base

class Education(Base):
    __tablename__ = "educations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    school = Column(String, nullable=False)
    degree = Column(String)
    start_year = Column(Integer)
    end_year = Column(Integer)

    user = relationship("User", back_populates="educations")
