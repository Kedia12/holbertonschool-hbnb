#!/bin/bash

# HBnB Project Setup Script
# This script sets up both backend and frontend for development

set -e

echo "🚀 HBnB Project Setup"
echo "===================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}➜${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check prerequisites
print_status "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    print_warning "Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
fi
print_success "Node.js installed: $(node --version)"

if ! command -v npm &> /dev/null; then
    print_warning "npm is not installed. Please install npm."
    exit 1
fi
print_success "npm installed: $(npm --version)"

if ! command -v python3 &> /dev/null; then
    print_warning "Python 3 is not installed. Please install Python 3."
    exit 1
fi
print_success "Python 3 installed: $(python3 --version)"

# Setup Backend
print_status "Setting up backend..."

if [ -d "part4/hbnb" ]; then
    cd part4/hbnb

    if [ ! -d "venv" ]; then
        print_status "Creating Python virtual environment..."
        python3 -m venv venv
    fi

    print_status "Activating virtual environment..."
    source venv/bin/activate

    print_status "Installing Python dependencies..."
    pip install -r requirements.txt

    print_success "Backend dependencies installed"

    cd ../..
else
    print_warning "Backend directory not found at part4/hbnb"
fi

# Setup Frontend
print_status "Setting up frontend..."

if [ -d "frontend" ]; then
    cd frontend

    if [ ! -d "node_modules" ]; then
        print_status "Installing npm dependencies..."
        npm install
    else
        print_status "node_modules already exist, skipping npm install"
    fi

    print_success "Frontend dependencies installed"

    cd ..
else
    print_warning "Frontend directory not found"
fi

echo ""
print_success "Setup complete! 🎉"
echo ""
echo "Next steps:"
echo "==========="
echo ""
echo "1. Start the backend:"
echo "   cd part4/hbnb"
echo "   source venv/bin/activate  # macOS/Linux"
echo "   python run.py"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "For more information, see:"
echo "  - SETUP.md (frontend setup guide)"
echo "  - part4/hbnb/README.md (backend setup guide)"
