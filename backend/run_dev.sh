#!/bin/bash

# Change to backend directory
cd backend

# Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo "uv is not installed. Please install it first:"
    echo "curl -LsSf https://astral.sh/uv/install.sh | sh"
    exit 1
fi

# Install dependencies if needed
echo "Installing dependencies with uv..."
uv sync

# Start the application with uvicorn
echo "Starting FastAPI application in development mode..."
uv run python dev.py 