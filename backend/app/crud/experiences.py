from sqlalchemy.orm import Session
import uuid
from app import models, schemas

def create_experience(db: Session, experience: schemas.experiences.ExperienceCreate, user_id: uuid.UUID):
    db_experience = models.experiences.Experience(**experience.dict(), user_id=user_id)
    db.add(db_experience)
    db.commit()
    db.refresh(db_experience)
    return db_experience

def get_experiences(db: Session, user_id: uuid.UUID):
    return db.query(models.experiences.Experience).filter(models.experiences.Experience.user_id == user_id).all()
