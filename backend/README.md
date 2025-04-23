# Showcasify Backend

This is the FastAPI backend for the Showcasify application.

## Features

- RESTful API with FastAPI
- PostgreSQL database
- Docker container deployment
- Todo API endpoints (CRUD operations)

## Setup

1. Create a `.env` file with the following variables:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/showcasify
   PORT=8000
   ENVIRONMENT=development
   ```

## Running Locally

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the application:
   ```bash
   python run.py
   ```
   
   Or directly with uvicorn:
   ```bash
   uvicorn app.main:app --reload
   ```

s

## API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc` 