from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Get database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/showcasify")

# Handle the case where we're running in Docker vs local development
# In Docker, the hostname is 'db' (service name in docker-compose)
# In local development with venv, the hostname is 'localhost'
if os.getenv("ENVIRONMENT") == "docker":
    # For Docker environment
    DATABASE_URL = DATABASE_URL.replace("localhost", "db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 