@echo off
echo ========================================
echo Killing old frontend processes...
echo ========================================

REM Kill processes on port 3001, 3002, 3003
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001" ^| findstr "LISTENING"') do (
    echo Killing process on port 3001: PID %%a
    taskkill /F /PID %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3002" ^| findstr "LISTENING"') do (
    echo Killing process on port 3002: PID %%a
    taskkill /F /PID %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3003" ^| findstr "LISTENING"') do (
    echo Killing process on port 3003: PID %%a
    taskkill /F /PID %%a >nul 2>&1
)

timeout /t 2 /nobreak >nul

echo ========================================
echo Starting Frontend (React + Vite)
echo ========================================
cd frontend
call npm run dev
pause

