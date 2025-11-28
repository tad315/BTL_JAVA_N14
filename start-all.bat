@echo off
echo ========================================
echo Starting Backend and Frontend
echo ========================================

REM Kill old frontend processes
echo Killing old frontend processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3002" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3003" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

timeout /t 2 /nobreak >nul

REM Start Backend in new window
echo Starting Backend...
start "Backend - Spring Boot" cmd /k "cd backend && call mvnw.cmd spring-boot:run"

REM Wait a bit for backend to start
timeout /t 5 /nobreak >nul

REM Start Frontend in new window
echo Starting Frontend...
start "Frontend - React" cmd /k "cd frontend && call npm run dev"

echo ========================================
echo Backend and Frontend are starting...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3001
echo ========================================
echo.
echo Check the Backend and Frontend windows for logs.
echo Close this window if you don't need it.
echo.

