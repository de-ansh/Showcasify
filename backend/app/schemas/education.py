from pydantic import BaseModel
from typing import Optional

class EducationBase(BaseModel):
    school: str
    degree: Optional[str]
    start_year: Optional[int]
    end_year: Optional[int]

class EducationCreate(EducationBase):
    pass

class EducationOut(EducationBase):
    id: int

    class Config:
        from_attributes = True
