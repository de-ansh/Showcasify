from sqlalchemy.orm import Session
import uuid
from app import models
from app.schemas import projects

def create_project(db: Session, project: projects.ProjectCreate, user_id: uuid.UUID):
    db_project = models.projects.Project(**project.dict(), user_id=user_id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def get_projects(db: Session, user_id: uuid.UUID):
    return db.query(models.projects.Project).filter(models.projects.Project.user_id == user_id).all()
