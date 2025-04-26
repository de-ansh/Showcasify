from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
<<<<<<< HEAD
from app.routers import user, auth, password, profile
=======
from app.routers import user, auth, password, education, experiences, projects
>>>>>>> 6c61fe0 (backend and frontend to collect data (#7))
from app.database.database import engine, Base
import os
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("./uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
(UPLOAD_DIR / "avatars").mkdir(exist_ok=True)
(UPLOAD_DIR / "projects").mkdir(exist_ok=True)  # Add directory for project images

app = FastAPI(title="Showcasify API", prefix="/api")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers with API prefix
api_prefix = "/api"
app.include_router(user.router, prefix=api_prefix)
app.include_router(auth.router, prefix=api_prefix)
app.include_router(password.router, prefix=api_prefix)
app.include_router(education.router, prefix=api_prefix)
app.include_router(experiences.router, prefix=api_prefix)
app.include_router(projects.router, prefix=api_prefix)

@app.get("/")
async def root():
    return {"message": "Welcome to Showcasify API"}

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "API is running"} 