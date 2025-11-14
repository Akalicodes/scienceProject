@echo off
REM ============================================================================
REM MEIOSIS EXPLORER - WINDOWS SERVER LAUNCHER
REM ============================================================================
REM Automated server startup script for Windows
REM 
REM Functionality:
REM - Auto-detects Python or Node.js installation
REM - Starts appropriate HTTP server
REM - Opens browser automatically
REM - Provides helpful error messages
REM 
REM Usage: Double-click this file or run from command prompt
REM ============================================================================

REM ============================================================================
REM INITIALIZATION - Navigate to script directory
REM ============================================================================
cd /d "%~dp0"

echo ========================================
echo   Meiosis Explorer - Starting Server
echo ========================================
echo.
echo Location: %CD%
echo.

REM ============================================================================
REM SERVER DETECTION & LAUNCH - Check for Python
REM ============================================================================
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Python found!
    echo Starting Python HTTP Server...
    echo.
    echo ========================================
    echo   Server is running at:
    echo   http://localhost:8000
    echo ========================================
    echo.
    echo Press Ctrl+C to stop the server
    echo.
    echo Opening browser in 2 seconds...
    timeout /t 2 /nobreak >nul
    start http://localhost:8000
    python -m http.server 8000
    goto :end
)

REM ============================================================================
REM FALLBACK OPTION - Check for Node.js
REM ============================================================================
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Node.js found!
    echo Starting Node.js Server...
    echo.
    echo ========================================
    echo   Server is running at:
    echo   http://localhost:3000
    echo ========================================
    echo.
    echo Press Ctrl+C to stop the server
    echo.
    echo Opening browser in 2 seconds...
    timeout /t 2 /nobreak >nul
    start http://localhost:3000
    node server.js
    goto :end
)

REM ============================================================================
REM ERROR HANDLING - No server software found
REM ============================================================================
echo [ERROR] Neither Python nor Node.js found!
echo.
echo Please install one of the following:
echo   - Python: https://www.python.org/downloads/
echo   - Node.js: https://nodejs.org/
echo.
echo ========================================
echo   Alternative: Open Directly
echo ========================================
echo You can also just double-click index.html
echo to open it directly in your browser!
echo.
pause

:end

