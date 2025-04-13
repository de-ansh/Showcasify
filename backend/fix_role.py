from app.database.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text("UPDATE users SET role = 'user' WHERE role IS NULL"))
    conn.commit()
    print("Updated all users with null role to 'user'.") 