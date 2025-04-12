from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import todo
from app.database.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Showcasify API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(todo.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Showcasify API"}

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "API is running"} 