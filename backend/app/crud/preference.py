from sqlalchemy.orm import Session
from app import models, schemas

def create_or_update_preference(db: Session, preference: schemas.preference.PreferenceCreate, user_id: int):
    db_pref = db.query(models.preference.Preference).filter(models.preference.Preference.user_id == user_id).first()
    if db_pref:
        for key, value in preference.dict().items():
            setattr(db_pref, key, value)
    else:
        db_pref = models.preference.Preference(**preference.dict(), user_id=user_id)
        db.add(db_pref)
    db.commit()
    db.refresh(db_pref)
    return db_pref

def get_preference(db: Session, user_id: int):
    return db.query(models.preference.Preference).filter(models.preference.Preference.user_id == user_id).first()
