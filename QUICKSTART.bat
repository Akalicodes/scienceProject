@echo off
REM Super simple server starter - just double-click this file!

REM Change to the directory where this batch file is located
cd /d "%~dp0"

echo.
echo ========================================
echo   MEIOSIS EXPLORER - Quick Start
echo ========================================
echo.
echo Current directory: %CD%
echo.
echo Starting server in 2 seconds...
timeout /t 2 /nobreak >nul
echo.

REM Start the server
echo Server starting at: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Open browser after 2 seconds
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:8000"

REM Start Python server
python -m http.server 8000

