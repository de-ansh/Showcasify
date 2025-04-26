from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.education import EducationCreate, EducationOut
from app.crud import education as education_crud
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/educations", tags=["Educations"])

@router.post("/", response_model=EducationOut)
def create_education(education: EducationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return education_crud.create_education(db, education, user_id=current_user.id)

@router.get("/", response_model=list[EducationOut])
def get_educations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return education_crud.get_educations(db, user_id=current_user.id)
