# Showcasify

This is a full-stack Todo application with FastAPI backend, PostgreSQL database, and Next.js frontend.

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
  - `.env`: Environment variables (not tracked in git)
  - `.env.example`: Example environment file to guide setup

- `frontend/`: Contains the Next.js application
  - `src/`: Main application code
    - `app/`: Next.js app router
    - `components/`: React components including shadcn/ui
    - `lib/`: Utility functions and API clients
    - `hooks/`: Custom React hooks
  - `package.json`: JavaScript dependencies
  - `Dockerfile`: Docker configuration for the frontend
  - `.env.local`: Environment variables for frontend (not tracked in git)
  - `.env.example`: Example environment file to guide setup

## Setup

1. Make sure you have Docker and Docker Compose installed on your system.

2. Clone the repository and navigate to the project directory.

3. Configure environment variables:
   ```bash
   # Copy the example environment files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   
   # Edit the .env files to match your environment
   nano backend/.env
   nano frontend/.env.local
   ```
   
   The backend `.env` file should contain:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/showcasify
   PORT=8000
   ENVIRONMENT=development
   ```

   The frontend `.env.local` file should contain:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

## Running with Docker Compose

### Start the Application

To start the entire stack (frontend, backend, and database):

```bash
docker-compose up --build
```

This will:
- Build and start the FastAPI backend at http://localhost:8000
- Build and start the Next.js frontend at http://localhost:3000
- Start the PostgreSQL database

You can access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API documentation: http://localhost:8000/docs

### Start in Detached Mode

To run the application in the background:

```bash
docker-compose up -d --build
```

### Check Container Status

To check the status of your containers:

```bash
docker-compose ps
```

### View Logs

To view the logs of all containers:

```bash
docker-compose logs
```

To follow the logs in real-time:

```bash
docker-compose logs -f
```

To view logs for a specific service:

```bash
docker-compose logs [service_name]  # e.g., docker-compose logs frontend
```

### Stop the Application

To stop all running containers without removing them:

```bash
docker-compose stop
```

### Start Existing Containers

To start previously stopped containers:

```bash
docker-compose start
```

### Stop and Remove Containers

To stop and remove containers, networks, and volumes:

```bash
docker-compose down
```

### Full Cleanup

To stop and remove containers, networks, volumes, and images:

```bash
docker-compose down --rmi all -v
```

## Development Options

### Option 1: Using Docker (Recommended for Production-Like Environment)

Use the Docker Compose commands above to work with the full stack.

### Option 2: Using Local Development Environment

#### Backend:

1. Set up a Python virtual environment:
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

#### Frontend:

1. Install dependencies:
   ```bash
   cd frontend
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. The frontend will be available at `http://localhost:3000`

## API Endpoints

- `GET /todos/`: List all todos
- `POST /todos/`: Create a new todo
- `GET /todos/{id}`: Get a specific todo
- `PUT /todos/{id}`: Update a todo
- `DELETE /todos/{id}`: Delete a todo

## Security Notes

- `.env` files containing sensitive information are not tracked in git
- For production deployment, always use strong, unique secrets and credentials
- When deploying to production, set `ENVIRONMENT=production` in your `.env` file 