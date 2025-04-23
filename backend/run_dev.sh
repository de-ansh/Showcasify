#!/bin/bash

# Check if virtual environment exists, if not create it
if [ ! -d "venv" ]; then
  echo "Virtual environment not found. Setting up..."
  ./setup_venv.sh
else
  # Activate virtual environment
  source venv/bin/activate
fi

# Change to backend directory
cd backend

# Start the application with uvicorn
echo "Starting FastAPI application in development mode..."
python run.py 