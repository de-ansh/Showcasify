from pydantic import BaseModel
from datetime import date
from typing import Optional

class ExperienceBase(BaseModel):
    title: str
    company: str
    start_date: date
    end_date: Optional[date]
    description: Optional[str]

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceOut(ExperienceBase):
    id: int

    class Config:
        from_attributes = True
