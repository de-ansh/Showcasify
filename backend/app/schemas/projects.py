from pydantic import BaseModel
from typing import Optional
from datetime import date

class ProjectBase(BaseModel):
    title: str
    description: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    url: Optional[str] = None
    technologies: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    url: Optional[str] = None
    technologies: Optional[str] = None

class ProjectOut(ProjectBase):
    id: int
    user_id: str

    class Config:
        from_attributes = True
