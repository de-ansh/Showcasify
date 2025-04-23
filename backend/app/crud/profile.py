from typing import List, Optional, Union
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder

from app.models.profile import ProfessionalInfo, Education, Project
from app.schemas.profile import (
    ProfessionalInfoCreate,
    ProfessionalInfoUpdate,
    EducationCreate,
    EducationUpdate,
    ProjectCreate,
    ProjectUpdate,
)

# Professional Info CRUD operations
def create_professional_info(db: Session, *, user_id: str, obj_in: ProfessionalInfoCreate) -> ProfessionalInfo:
    obj_in_data = jsonable_encoder(obj_in)
    db_obj = ProfessionalInfo(**obj_in_data, user_id=user_id)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_professional_info(db: Session, user_id: str) -> Optional[ProfessionalInfo]:
    return db.query(ProfessionalInfo).filter(ProfessionalInfo.user_id == user_id).first()

def update_professional_info(
    db: Session,
    *,
    db_obj: ProfessionalInfo,
    obj_in: Union[ProfessionalInfoUpdate, dict]
) -> ProfessionalInfo:
    obj_data = jsonable_encoder(db_obj)
    if isinstance(obj_in, dict):
        update_data = obj_in
    else:
        update_data = obj_in.dict(exclude_unset=True)
    for field in obj_data:
        if field in update_data:
            setattr(db_obj, field, update_data[field])
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

# Education CRUD operations
def create_education(
    db: Session, *, professional_info_id: int, obj_in: EducationCreate
) -> Education:
    obj_in_data = jsonable_encoder(obj_in)
    db_obj = Education(**obj_in_data, professional_info_id=professional_info_id)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_education(db: Session, id: int) -> Optional[Education]:
    return db.query(Education).filter(Education.id == id).first()

def get_educations_by_professional_info(
    db: Session, professional_info_id: int
) -> List[Education]:
    return db.query(Education).filter(Education.professional_info_id == professional_info_id).all()

def update_education(
    db: Session,
    *,
    db_obj: Education,
    obj_in: Union[EducationUpdate, dict]
) -> Education:
    obj_data = jsonable_encoder(db_obj)
    if isinstance(obj_in, dict):
        update_data = obj_in
    else:
        update_data = obj_in.dict(exclude_unset=True)
    for field in obj_data:
        if field in update_data:
            setattr(db_obj, field, update_data[field])
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_education(db: Session, *, id: int) -> Education:
    obj = db.query(Education).get(id)
    db.delete(obj)
    db.commit()
    return obj

# Project CRUD operations
def create_project(
    db: Session, *, professional_info_id: int, obj_in: ProjectCreate
) -> Project:
    obj_in_data = jsonable_encoder(obj_in)
    db_obj = Project(**obj_in_data, professional_info_id=professional_info_id)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_project(db: Session, id: int) -> Optional[Project]:
    return db.query(Project).filter(Project.id == id).first()

def get_projects_by_professional_info(
    db: Session, professional_info_id: int
) -> List[Project]:
    return db.query(Project).filter(Project.professional_info_id == professional_info_id).all()

def update_project(
    db: Session,
    *,
    db_obj: Project,
    obj_in: Union[ProjectUpdate, dict]
) -> Project:
    obj_data = jsonable_encoder(db_obj)
    if isinstance(obj_in, dict):
        update_data = obj_in
    else:
        update_data = obj_in.dict(exclude_unset=True)
    for field in obj_data:
        if field in update_data:
            setattr(db_obj, field, update_data[field])
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_project(db: Session, *, id: int) -> Project:
    obj = db.query(Project).get(id)
    db.delete(obj)
    db.commit()
    return obj 