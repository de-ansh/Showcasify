from pydantic import BaseModel
from typing import Optional

class ProjectBase(BaseModel):
    title: str
    description: Optional[str]
    project_url: Optional[str]
    github_url: Optional[str]

class ProjectCreate(ProjectBase):
    pass

class ProjectOut(ProjectBase):
    id: int

    class Config:
        from_attributes = True
