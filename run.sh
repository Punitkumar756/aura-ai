#!/bin/bash
# Quick Start Script for Aura AI on Linux/Mac

echo "============================================"
echo "Aura AI Agent System - Quick Start"
echo "============================================"
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 not found. Install Python 3.11+"
    exit 1
fi

# Create venv
echo "Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Configure .env
if [ ! -f .env ]; then
    echo "Copying .env.example to .env..."
    cp .env.example .env
    echo "WARNING: Edit .env with your GitLab token and webhook secret"
fi

# Start server
echo ""
echo "============================================"
echo "Starting Aura AI Server on http://localhost:8000"
echo "============================================"
echo ""
python -m src.main
