from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.education import EducationCreate, EducationUpdate, EducationOut
from app.crud import education as education_crud
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/education", tags=["Education"])

@router.post("/", response_model=EducationOut)
def create_education(education: EducationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return education_crud.create_education(db, education, user_id=current_user.id)

@router.get("/", response_model=list[EducationOut])
def get_educations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return education_crud.get_educations(db, user_id=current_user.id)

@router.put("/{education_id}", response_model=EducationOut)
def update_education(
    education_id: int,
    education: EducationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_education = education_crud.update_education(db, education_id, education, user_id=current_user.id)
    if not db_education:
        raise HTTPException(status_code=404, detail="Education not found")
    return db_education

@router.delete("/{education_id}", response_model=EducationOut)
def delete_education(
    education_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_education = education_crud.delete_education(db, education_id, user_id=current_user.id)
    if not db_education:
        raise HTTPException(status_code=404, detail="Education not found")
    return db_education
