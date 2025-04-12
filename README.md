# Showcasify

This is a full-stack Todo application with FastAPI backend and PostgreSQL database.

## Project Structure

- `backend/`: Contains the FastAPI application and API endpoints
  - `app/`: Main application code
    - `models/`: Database models
    - `schemas/`: Pydantic schemas
    - `crud/`: Database CRUD operations
    - `routers/`: API endpoint routers
    - `database/`: Database configuration
  - `requirements.txt`: Python dependencies
  - `Dockerfile`: Docker configuration for the backend
  - `.env`: Environment variables

## Setup

1. Make sure you have Docker and Docker Compose installed on your system.

2. Clone the repository and navigate to the project directory.

3. Configure environment variables:
   ```
   # Backend .env file is located at: backend/.env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/showcasify
   PORT=8000
   ENVIRONMENT=development
   ```

## Development Options

### Option 1: Using Docker (Recommended for Production-Like Environment)

1. Start the services using Docker Compose:
   ```bash
   docker-compose up --build
   ```

2. The FastAPI application will be available at `http://localhost:8000`
   - API documentation will be available at `http://localhost:8000/docs`
   - Alternative API documentation at `http://localhost:8000/redoc`

3. To stop the services:
   ```bash
   docker-compose down
   ```

### Option 2: Using Virtual Environment (Recommended for Local Development)

1. Set up a virtual environment:
   ```bash
   # Make the setup script executable
   chmod +x setup_venv.sh
   
   # Run the setup script
   ./setup_venv.sh
   ```

2. Activate the virtual environment:
   ```bash
   source venv/bin/activate
   ```

3. Start the PostgreSQL database using Docker:
   ```bash
   docker-compose up db
   ```

4. In a separate terminal, start the FastAPI application:
   ```bash
   ./run_dev.sh
   ```

5. The application will be available at the same URLs as with Docker.

6. To deactivate the virtual environment:
   ```bash
   deactivate
   ```

## API Endpoints

- `GET /todos/`: List all todos
- `POST /todos/`: Create a new todo
- `GET /todos/{id}`: Get a specific todo
- `PUT /todos/{id}`: Update a todo
- `DELETE /todos/{id}`: Delete a todo 