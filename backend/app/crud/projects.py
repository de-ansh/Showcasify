from sqlalchemy.orm import Session
import uuid
from app import models, schemas

def create_project(db: Session, project: schemas.projects.ProjectCreate, user_id: uuid.UUID):
    db_project = models.projects.Project(**project.dict(), user_id=user_id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def get_projects(db: Session, user_id: uuid.UUID):
    return db.query(models.projects.Project).filter(models.projects.Project.user_id == user_id).all()

def get_project(db: Session, project_id: int, user_id: uuid.UUID):
    return db.query(models.projects.Project).filter(
        models.projects.Project.id == project_id,
        models.projects.Project.user_id == user_id
    ).first()

def update_project(db: Session, project_id: int, project: schemas.projects.ProjectUpdate, user_id: uuid.UUID):
    db_project = get_project(db, project_id, user_id)
    if not db_project:
        return None
    
    for key, value in project.dict(exclude_unset=True).items():
        setattr(db_project, key, value)
    
    db.commit()
    db.refresh(db_project)
    return db_project

def delete_project(db: Session, project_id: int, user_id: uuid.UUID):
    db_project = get_project(db, project_id, user_id)
    if not db_project:
        return None
    
    db.delete(db_project)
    db.commit()
    return db_project
