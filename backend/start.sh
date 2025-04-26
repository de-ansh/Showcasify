#!/bin/bash

echo "Starting Showcasify API setup..."

# Make sure .env exists
if [ ! -f ".env" ]; then
  echo "ERROR: .env file not found!"
  echo "Creating default .env file..."
  echo "DATABASE_URL=postgresql://postgres:postgres@db:5432/showcasify" > .env
  echo "ENVIRONMENT=docker" >> .env
  echo "SECRET_KEY=your_secret_key_for_jwt" >> .env
  echo "ACCESS_TOKEN_EXPIRE_MINUTES=30" >> .env
fi

# Ensure upload directories exist
mkdir -p uploads/avatars uploads/projects

# Check if we're in a virtual environment
if [ -d "venv" ] && [ -f "venv/bin/activate" ]; then
  echo "Activating virtual environment..."
  source venv/bin/activate
fi

# Check if alembic is installed
if ! command -v alembic &> /dev/null; then
  echo "Installing required packages..."
  pip install -r requirements.txt
fi

# Run database migrations
echo "Running database migrations..."
alembic upgrade head

# Start the application
echo "Starting FastAPI application..."
python run.py 