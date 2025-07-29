#!/bin/bash

echo "Setting up backend with uv..."

# Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo "Installing uv..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    
    # Add uv to PATH for current session
    export PATH="$HOME/.cargo/bin:$PATH"
    
    echo "uv installed successfully!"
    echo "You may need to restart your terminal or run: source ~/.bashrc"
fi

# Change to backend directory
cd backend

# Initialize uv project (this will create .venv and install dependencies)
echo "Initializing uv project and installing dependencies..."
uv sync

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "To run the development server:"
echo "  cd backend && uv run python run.py"
echo ""
echo "Or use the convenience script:"
echo "  ./run_dev.sh"