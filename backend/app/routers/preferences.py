from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.preference import PreferenceCreate, PreferenceOut
from app.crud import preference as preference_crud
from app.dependencies import get_current_user

router = APIRouter(prefix="/preferences", tags=["Preferences"])

@router.post("/", response_model=PreferenceOut)
def create_or_update_preference(preference: PreferenceCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return preference_crud.create_or_update_preference(db, preference, user_id=current_user["id"])

@router.get("/", response_model=PreferenceOut)
def get_preference(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return preference_crud.get_preference(db, user_id=current_user["id"])
