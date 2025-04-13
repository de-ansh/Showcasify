from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
import shutil
import os
from pathlib import Path

from app.schemas.user import User, UserCreate, UserUpdate
from app.crud import user as user_crud
from app.database.database import get_db
from app.dependencies import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("./uploads/avatars")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.get("/", response_model=List[User])
def read_users(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all users. Only available to authenticated users.
    """
    users = user_crud.get_users(db, skip=skip, limit=limit)
    return users

@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user. This endpoint is public to allow registration.
    """
    # Check if user with this email already exists
    db_user = user_crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    return user_crud.create_user(db=db, user=user)

@router.get("/me", response_model=User)
def read_user_me(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user.
    """
    return current_user

@router.put("/me", response_model=User)
def update_user_me(
    user: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update current authenticated user.
    """
    # If email is being updated, check that it's not already in use by another user
    if user.email:
        existing_user = user_crud.get_user_by_email(db, email=user.email)
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
    
    return user_crud.update_user(db, user_id=current_user.id, user=user)

@router.post("/me/avatar", response_model=User)
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Upload a profile avatar image for the current user.
    """
    # Check file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="File must be an image"
        )
    
    # Create a unique filename
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"{current_user.id}{file_extension}"
    file_path = UPLOAD_DIR / filename
    
    # Save the file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Update the user's avatar field
    avatar_url = f"/uploads/avatars/{filename}"
    user_update = UserUpdate(avatar=avatar_url)
    
    return user_crud.update_user(db, user_id=current_user.id, user=user_update)

@router.get("/{user_id}", response_model=User)
def read_user(
    user_id: uuid.UUID, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get user by ID. Only available to authenticated users.
    """
    db_user = user_crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.put("/{user_id}", response_model=User)
def update_user(
    user_id: uuid.UUID, 
    user: UserUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update user by ID. Only available to authenticated users.
    """
    # If email is being updated, check that it's not already in use
    if user.email:
        existing_user = user_crud.get_user_by_email(db, email=user.email)
        if existing_user and existing_user.id != user_id:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
    
    db_user = user_crud.update_user(db, user_id=user_id, user=user)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: uuid.UUID, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete user by ID. Only available to authenticated users.
    """
    success = user_crud.delete_user(db, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return None 