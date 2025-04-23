from typing import Optional, List
from pydantic import BaseModel, HttpUrl, EmailStr
from datetime import date, datetime
from uuid import UUID

# Education Schemas
class EducationBase(BaseModel):
    institution: str
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_current: bool = False
    description: Optional[str] = None
    gpa: Optional[str] = None

class EducationCreate(EducationBase):
    pass

class EducationUpdate(EducationBase):
    pass

class Education(EducationBase):
    id: int
    professional_info_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Project Schemas
class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    technologies: List[str] = []
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_current: bool = False
    project_url: Optional[HttpUrl] = None
    github_url: Optional[HttpUrl] = None
    achievements: List[str] = []
    images: List[HttpUrl] = []

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    professional_info_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Professional Info Schemas
class ContactInfo(BaseModel):
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    location: Optional[str] = None

class SocialLinks(BaseModel):
    linkedin: Optional[HttpUrl] = None
    github: Optional[HttpUrl] = None
    twitter: Optional[HttpUrl] = None
    portfolio: Optional[HttpUrl] = None

class ProfessionalInfoBase(BaseModel):
    full_name: str
    professional_title: Optional[str] = None
    bio: Optional[str] = None
    contact_info: ContactInfo
    social_links: SocialLinks
    skills: List[str] = []
    profile_image_url: Optional[HttpUrl] = None

class ProfessionalInfoCreate(ProfessionalInfoBase):
    pass

class ProfessionalInfoUpdate(ProfessionalInfoBase):
    pass

class ProfessionalInfo(ProfessionalInfoBase):
    id: int
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    education: List[Education] = []
    projects: List[Project] = []

    class Config:
        from_attributes = True 