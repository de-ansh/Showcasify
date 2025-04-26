from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.projects import ProjectCreate, ProjectOut
from app.crud import projects as project_crud
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.post("/", response_model=ProjectOut)
def create_project(project: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return project_crud.create_project(db, project, user_id=current_user.id)

@router.get("/", response_model=list[ProjectOut])
def get_projects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return project_crud.get_projects(db, user_id=current_user.id)
