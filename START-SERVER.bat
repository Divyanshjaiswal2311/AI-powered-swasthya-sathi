@echo off
REM =====================================================
REM Swasthya Sathi - Server Startup Script
REM =====================================================

echo.
echo ╔════════════════════════════════════════╗
echo ║  🚀 SWASTHYA SATHI - SERVER STARTUP   ║
echo ╚════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check current directory
echo 📁 Current directory: %cd%

REM Check if package.json exists
if not exist package.json (
    echo ❌ package.json not found!
    echo Make sure you're in the project root directory.
    pause
    exit /b 1
)

echo ✅ package.json found
echo ✅ Node.js installed
echo.

REM Check if node_modules exists
if not exist node_modules (
    echo ⚠️  node_modules not found. Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed
)

echo.
echo 🔍 Checking .env file...
if not exist .env (
    echo ⚠️  .env file not found!
    if exist .env.example (
        echo 💡 Copying .env.example to .env...
        copy .env.example .env >nul
        echo ✅ .env file created (update with your values)
    )
) else (
    echo ✅ .env file found
)

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🚀 Starting Swasthya Sathi Server...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📍 Server will run on: http://localhost:5000
echo 🔗 API Endpoints: http://localhost:5000/api/v1/*
echo.
echo Press CTRL+C to stop the server
echo.

REM Start the server
npm run server

REM Check if npm run server succeeded
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Server failed to start
    echo Trying alternative method...
    echo.
    node server.js
)

pause

