@echo off
echo ======================================================================
echo    Starting RoadGuard AI - Single Unified Production Server
echo ======================================================================
echo.
echo Launching unified server at: http://localhost:8000/
echo (Frontend, REST APIs, AI Engine, GIS Map, and WebSockets combined)
echo.

cd /d "%~dp0\backend"
"C:\Users\ruthw\AppData\Local\Programs\Python311\python.exe" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause
