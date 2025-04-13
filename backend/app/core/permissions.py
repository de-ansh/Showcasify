from fastapi import Depends, HTTPException, status
from app.models.user import User, UserRole
from app.dependencies import get_current_user

def is_admin(current_user: User = Depends(get_current_user)) -> User:
    """
    Check if the current user is an admin.
    Raises 403 Forbidden if not.
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    return current_user

def is_admin_or_self(user_id: str, current_user: User = Depends(get_current_user)) -> User:
    """
    Check if the current user is an admin or the user being accessed.
    Raises 403 Forbidden if not.
    """
    if current_user.role != UserRole.ADMIN and str(current_user.id) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    return current_user 