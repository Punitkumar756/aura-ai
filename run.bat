@echo off
REM Quick Start Script for Aura AI on Windows

echo ============================================
echo Aura AI Agent System - Quick Start
echo ============================================

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found. Install Python 3.11+
    exit /b 1
)

REM Create venv
echo Creating virtual environment...
python -m venv venv
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Configure .env
if not exist .env (
    echo Copying .env.example to .env...
    copy .env.example .env
    echo WARNING: Edit .env with your GitLab token and webhook secret
)

REM Start server
echo.
echo ============================================
echo Starting Aura AI Server on http://localhost:8000
echo ============================================
echo.
python -m src.main
