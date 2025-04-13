import logging
from typing import Dict

# In a real app, you would use an email sending service like SendGrid, SMTP, etc.
# This is a mock implementation
logger = logging.getLogger(__name__)

def send_email(email_to: str, subject: str, template_name: str, template_data: Dict[str, str]) -> bool:
    """
    Send email using the provided template and data.
    
    In a real application, this would use an email service or SMTP.
    For this example, we'll just log the email details.
    """
    logger.info(
        f"Mock email sent to: {email_to}, subject: {subject}, "
        f"template: {template_name}, data: {template_data}"
    )
    return True

def send_reset_password_email(email_to: str, token: str, username: str) -> bool:
    """
    Send a password reset email with the reset token
    """
    subject = "Password Reset Request"
    template_name = "reset_password.html"
    reset_url = f"http://localhost:3000/reset-password?token={token}"
    
    template_data = {
        "username": username,
        "reset_url": reset_url,
        "token": token
    }
    
    return send_email(
        email_to=email_to,
        subject=subject,
        template_name=template_name,
        template_data=template_data
    ) 