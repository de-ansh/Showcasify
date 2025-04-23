from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.schemas.profile import (
    ProfessionalInfo,
    ProfessionalInfoCreate,
    ProfessionalInfoUpdate,
    Education,
    EducationCreate,
    EducationUpdate,
    Project,
    ProjectCreate,
    ProjectUpdate,
)
from app.crud import profile as crud_profile

router = APIRouter(prefix="/api/profile", tags=["profile"])

# Professional Info endpoints
@router.post("/", response_model=ProfessionalInfo)
def create_professional_info(
    *,
    db: Session = Depends(get_db),
    professional_info_in: ProfessionalInfoCreate,
    current_user: User = Depends(get_current_user)
):
    """Create professional info for the current user."""
    db_obj = crud_profile.get_professional_info(db=db, user_id=str(current_user.id))
    if db_obj:
        raise HTTPException(
            status_code=400,
            detail="Professional info already exists for this user",
        )
    return crud_profile.create_professional_info(
        db=db, user_id=str(current_user.id), obj_in=professional_info_in
    )

@router.get("/", response_model=ProfessionalInfo)
def get_professional_info(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get professional info for the current user."""
    db_obj = crud_profile.get_professional_info(db=db, user_id=str(current_user.id))
    if not db_obj:
        raise HTTPException(
            status_code=404,
            detail="Professional info not found",
        )
    return db_obj

@router.put("/", response_model=ProfessionalInfo)
def update_professional_info(
    *,
    db: Session = Depends(get_db),
    professional_info_in: ProfessionalInfoUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update professional info for the current user."""
    db_obj = crud_profile.get_professional_info(db=db, user_id=str(current_user.id))
    if not db_obj:
        raise HTTPException(
            status_code=404,
            detail="Professional info not found",
        )
    return crud_profile.update_professional_info(db=db, db_obj=db_obj, obj_in=professional_info_in)

# Education endpoints
@router.post("/education/", response_model=Education)
def create_education(
    *,
    db: Session = Depends(get_db),
    education_in: EducationCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new education entry."""
    prof_info = crud_profile.get_professional_info(db=db, user_id=str(current_user.id))
    if not prof_info:
        raise HTTPException(
            status_code=404,
            detail="Professional info not found. Create professional info first.",
        )
    return crud_profile.create_education(
        db=db, professional_info_id=prof_info.id, obj_in=education_in
    )

@router.get("/education/", response_model=List[Education])
def list_educations(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all education entries for the current user."""
    prof_info = crud_profile.get_professional_info(db=db, user_id=str(current_user.id))
    if not prof_info:
        raise HTTPException(
            status_code=404,
            detail="Professional info not found",
        )
    return crud_profile.get_educations_by_professional_info(
        db=db, professional_info_id=prof_info.id
    )

@router.put("/education/{education_id}", response_model=Education)
def update_education(
    *,
    db: Session = Depends(get_db),
    education_id: int,
    education_in: EducationUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update an education entry."""
    education = crud_profile.get_education(db=db, id=education_id)
    if not education:
        raise HTTPException(
            status_code=404,
            detail="Education entry not found",
        )
    prof_info = crud_profile.get_professional_info(db=db, user_id=str(current_user.id))
    if not prof_info or education.professional_info_id != prof_info.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions",
        )
    return crud_profile.update_education(db=db, db_obj=education, obj_in=education_in)

@router.delete("/education/{education_id}", response_model=Education)
def delete_education(
    *,
    db: Session = Depends(get_db),
    education_id: int,
    current_user: User = Depends(get_current_user)
):
    """Delete an education entry."""
    education = crud_profile.get_education(db=db, id=education_id)
    if not education:
        raise HTTPException(
            status_code=404,
            detail="Education entry not found",
        )
    prof_info = crud_profile.get_professional_info(db=db, user_id=str(current_user.id))
    if not prof_info or education.professional_info_id != prof_info.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions",
        )
    return crud_profile.delete_education(db=db, id=education_id)

# Project endpoints
@router.post("/projects/", response_model=Project)
def create_project(
    *,
    db: Session = Depends(get_db),
    project_in: ProjectCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new project entry."""
    prof_info = crud_profile.get_professional_info(db=db, user_id=str(current_user.id))
    if not prof_info:
        raise HTTPException(
            status_code=404,
            detail="Professional info not found. Create professional info first.",
        )
    return crud_profile.create_project(
        db=db, professional_info_id=prof_info.id, obj_in=project_in
    )

@router.get("/projects/", response_model=List[Project])
def list_projects(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all project entries for the current user."""
    prof_info = crud_profile.get_professional_info(db=db, user_id=str(current_user.id))
    if not prof_info:
        raise HTTPException(
            status_code=404,
            detail="Professional info not found",
        )
    return crud_profile.get_projects_by_professional_info(
        db=db, professional_info_id=prof_info.id
    )

@router.put("/projects/{project_id}", response_model=Project)
def update_project(
    *,
    db: Session = Depends(get_db),
    project_id: int,
    project_in: ProjectUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update a project entry."""
    project = crud_profile.get_project(db=db, id=project_id)
    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project entry not found",
        )
    prof_info = crud_profile.get_professional_info(db=db, user_id=str(current_user.id))
    if not prof_info or project.professional_info_id != prof_info.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions",
        )
    return crud_profile.update_project(db=db, db_obj=project, obj_in=project_in)

@router.delete("/projects/{project_id}", response_model=Project)
def delete_project(
    *,
    db: Session = Depends(get_db),
    project_id: int,
    current_user: User = Depends(get_current_user)
):
    """Delete a project entry."""
    project = crud_profile.get_project(db=db, id=project_id)
    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project entry not found",
        )
    prof_info = crud_profile.get_professional_info(db=db, user_id=str(current_user.id))
    if not prof_info or project.professional_info_id != prof_info.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions",
        )
    return crud_profile.delete_project(db=db, id=project_id) 