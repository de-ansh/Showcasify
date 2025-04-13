from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password
from typing import List, Optional
import uuid
import secrets
from datetime import datetime, timedelta

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    return db.query(User).offset(skip).limit(limit).all()

def get_user(db: Session, user_id: uuid.UUID) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate) -> User:
    # Hash the password
    hashed_password = get_password_hash(user.password)
    
    # Create user with hashed password
    db_user = User(
        email=user.email,
        name=user.name,
        password=hashed_password,
        role=user.role
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: uuid.UUID, user: UserUpdate) -> Optional[User]:
    db_user = get_user(db, user_id)
    if db_user:
        update_data = user.model_dump(exclude_unset=True)
        
        # Hash password if it's being updated
        if "password" in update_data:
            update_data["password"] = get_password_hash(update_data["password"])
            
        for key, value in update_data.items():
            setattr(db_user, key, value)
            
        db.commit()
        db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: uuid.UUID) -> bool:
    db_user = get_user(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.password):
        return None
    return user

def generate_password_reset_token(db: Session, email: str) -> Optional[str]:
    """
    Generate a password reset token for the user and store it in the database
    """
    user = get_user_by_email(db, email)
    if not user:
        return None
        
    # Generate a random token
    token = secrets.token_urlsafe(32)
    expires = datetime.utcnow() + timedelta(hours=24)
    
    # Store the token and expiry in the database
    user.reset_token = token
    user.reset_token_expires = expires
    db.commit()
    
    return token

def reset_password_with_token(db: Session, token: str, new_password: str) -> bool:
    """
    Reset a user's password using a valid reset token
    """
    # Find the user with this token
    user = db.query(User).filter(
        User.reset_token == token,
        User.reset_token_expires > datetime.utcnow()
    ).first()
    
    if not user:
        return False
        
    # Update the password and clear the reset token
    user.password = get_password_hash(new_password)
    user.reset_token = None
    user.reset_token_expires = None
    db.commit()
    
    return True 