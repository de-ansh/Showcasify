from sqlalchemy.orm import Session
import uuid
from app import models, schemas

def create_education(db: Session, education: schemas.education.EducationCreate, user_id: uuid.UUID):
    db_education = models.education.Education(**education.dict(), user_id=user_id)
    db.add(db_education)
    db.commit()
    db.refresh(db_education)
    return db_education

def get_educations(db: Session, user_id: uuid.UUID):
    return db.query(models.education.Education).filter(models.education.Education.user_id == user_id).all()

def get_education(db: Session, education_id: int, user_id: uuid.UUID):
    return db.query(models.education.Education).filter(
        models.education.Education.id == education_id,
        models.education.Education.user_id == user_id
    ).first()

def update_education(db: Session, education_id: int, education: schemas.education.EducationUpdate, user_id: uuid.UUID):
    db_education = get_education(db, education_id, user_id)
    if not db_education:
        return None
    
    for key, value in education.dict(exclude_unset=True).items():
        setattr(db_education, key, value)
    
    db.commit()
    db.refresh(db_education)
    return db_education

def delete_education(db: Session, education_id: int, user_id: uuid.UUID):
    db_education = get_education(db, education_id, user_id)
    if not db_education:
        return None
    
    db.delete(db_education)
    db.commit()
    return db_education
