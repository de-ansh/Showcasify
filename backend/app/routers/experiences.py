from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.experiences import ExperienceCreate, ExperienceOut
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
