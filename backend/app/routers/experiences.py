from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.experiences import ExperienceCreate, ExperienceUpdate, ExperienceOut
from app.crud import experiences as experience_crud
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/experiences", tags=["Experiences"])

@router.post("/", response_model=ExperienceOut)
def create_experience(experience: ExperienceCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return experience_crud.create_experience(db, experience, user_id=current_user.id)

@router.get("/", response_model=list[ExperienceOut])
def get_experiences(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return experience_crud.get_experiences(db, user_id=current_user.id)

@router.put("/{experience_id}", response_model=ExperienceOut)
def update_experience(
    experience_id: int,
    experience: ExperienceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_experience = experience_crud.update_experience(db, experience_id, experience, user_id=current_user.id)
    if not db_experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    return db_experience

@router.delete("/{experience_id}", response_model=ExperienceOut)
def delete_experience(
    experience_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_experience = experience_crud.delete_experience(db, experience_id, user_id=current_user.id)
    if not db_experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    return db_experience
