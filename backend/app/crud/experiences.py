from sqlalchemy.orm import Session
import uuid
from app import models, schemas

def create_experience(db: Session, experience: schemas.experiences.ExperienceCreate, user_id: uuid.UUID):
    # Get or create professional_info for the user
    professional_info = db.query(models.profile.ProfessionalInfo).filter(
        models.profile.ProfessionalInfo.user_id == user_id
    ).first()
    
    if not professional_info:
        professional_info = models.profile.ProfessionalInfo(
            user_id=user_id,
            contact_info={},
            social_links={},
            skills=[]
        )
        db.add(professional_info)
        db.commit()
        db.refresh(professional_info)
    
    db_experience = models.experiences.Experience(**experience.dict(), professional_info_id=professional_info.id)
    db.add(db_experience)
    db.commit()
    db.refresh(db_experience)
    return db_experience

def get_experiences(db: Session, user_id: uuid.UUID):
    professional_info = db.query(models.profile.ProfessionalInfo).filter(
        models.profile.ProfessionalInfo.user_id == user_id
    ).first()
    if not professional_info:
        return []
    
    return db.query(models.experiences.Experience).filter(
        models.experiences.Experience.professional_info_id == professional_info.id
    ).all()

def get_experience(db: Session, experience_id: int, user_id: uuid.UUID):
    professional_info = db.query(models.profile.ProfessionalInfo).filter(
        models.profile.ProfessionalInfo.user_id == user_id
    ).first()
    if not professional_info:
        return None
    
    return db.query(models.experiences.Experience).filter(
        models.experiences.Experience.id == experience_id,
        models.experiences.Experience.professional_info_id == professional_info.id
    ).first()

def update_experience(db: Session, experience_id: int, experience: schemas.experiences.ExperienceUpdate, user_id: uuid.UUID):
    db_experience = get_experience(db, experience_id, user_id)
    if not db_experience:
        return None
    
    for key, value in experience.dict(exclude_unset=True).items():
        setattr(db_experience, key, value)
    
    db.commit()
    db.refresh(db_experience)
    return db_experience

def delete_experience(db: Session, experience_id: int, user_id: uuid.UUID):
    db_experience = get_experience(db, experience_id, user_id)
    if not db_experience:
        return None
    
    db.delete(db_experience)
    db.commit()
    return db_experience
