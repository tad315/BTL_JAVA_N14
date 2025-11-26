@echo off
echo ========================================
echo Stopping Backend and Frontend
echo ========================================

REM Kill Backend (port 8080)
echo Stopping Backend (port 8080)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080" ^| findstr "LISTENING"') do (
    echo Killing Backend process: PID %%a
    taskkill /F /PID %%a >nul 2>&1
)

REM Kill Frontend (ports 3001, 3002, 3003)
echo Stopping Frontend (ports 3001, 3002, 3003)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001" ^| findstr "LISTENING"') do (
    echo Killing Frontend process on port 3001: PID %%a
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3002" ^| findstr "LISTENING"') do (
    echo Killing Frontend process on port 3002: PID %%a
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3003" ^| findstr "LISTENING"') do (
    echo Killing Frontend process on port 3003: PID %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo ========================================
echo All processes stopped!
echo ========================================
timeout /t 2 /nobreak >nul

