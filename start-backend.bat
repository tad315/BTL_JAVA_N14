@echo off
echo ========================================
echo Starting Backend (Spring Boot)
echo ========================================
cd backend
call mvnw.cmd spring-boot:run
pause

