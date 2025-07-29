# Showcasify Backend

This is the FastAPI backend for the Showcasify application, now powered by **uv** for faster dependency management.

## Features

- RESTful API with FastAPI
- PostgreSQL database
- Docker container deployment
- Todo API endpoints (CRUD operations)
- Fast dependency management with uv

## Prerequisites

- Python 3.9+
- uv package manager

## Quick Setup

1. **Install uv** (if not already installed):
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

2. **Run the setup script**:
   ```bash
   ./setup_uv.sh
   ```

3. **Create a `.env` file** with the following variables:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/showcasify
   PORT=8000
   ENVIRONMENT=development
   ```

## Running Locally

### Option 1: Use the convenience script
```bash
./run_dev.sh
```

### Option 2: Manual commands
```bash
cd backend
uv sync                    # Install dependencies
uv run python dev.py       # Start development server
```

### Option 3: Direct uvicorn
```bash
cd backend
uv run uvicorn app.main:app --reload
```

## Development Commands

```bash
# Install dependencies
uv sync

# Add new dependency
uv add package-name

# Add development dependency  
uv add --dev package-name

# Run tests (when available)
uv run pytest

# Format code
uv run black .
uv run isort .
```

## Migration from pip

The project has been migrated from pip to uv for:
- ⚡ **Faster installs** - 10-100x faster than pip
- 🔒 **Better dependency resolution** - More reliable than pip
- 📦 **Unified tooling** - Package management and virtual environments
- 🎯 **Reproducible builds** - Lock file ensures consistent environments

Legacy files (`requirements.txt`, `setup_venv.sh`) are kept for reference but `pyproject.toml` is now the source of truth.

## API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc` 