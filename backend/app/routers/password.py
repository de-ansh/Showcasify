from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.user import PasswordReset, PasswordResetConfirm
from app.crud import user as user_crud
from app.core.email import send_reset_password_email

router = APIRouter(
    prefix="/password",
    tags=["password"],
)

@router.post("/reset", status_code=status.HTTP_204_NO_CONTENT)
def request_password_reset(
    request: PasswordReset,
    db: Session = Depends(get_db)
):
    """
    Request a password reset token.
    
    A reset token will be emailed to the user if they exist in the system.
    """
    user = user_crud.get_user_by_email(db, email=request.email)
    if not user:
        # We don't want to reveal if an email exists or not
        # So we still return 204 No Content
        return
        
    token = user_crud.generate_password_reset_token(db, email=request.email)
    if token:
        send_reset_password_email(
            email_to=user.email,
            token=token,
            username=user.name
        )
    
    return

@router.post("/reset/confirm", status_code=status.HTTP_204_NO_CONTENT)
def reset_password(
    request: PasswordResetConfirm,
    db: Session = Depends(get_db)
):
    """
    Reset password using a valid token.
    
    If the token is valid and not expired, the password will be updated.
    """
    success = user_crud.reset_password_with_token(
        db, 
        token=request.token, 
        new_password=request.new_password
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token",
        )
    
    return 