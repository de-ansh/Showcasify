from pydantic import BaseModel
from typing import Optional

class PreferenceBase(BaseModel):
    primary_color: Optional[str]
    secondary_color: Optional[str]
    font_style: Optional[str]
    layout_option: Optional[str]

class PreferenceCreate(PreferenceBase):
    pass

class PreferenceOut(PreferenceBase):
    id: int

    class Config:
        orm_mode = True
