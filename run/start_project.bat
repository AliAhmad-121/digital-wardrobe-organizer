@echo off

echo Starting Digital Wardrobe Project...

cd /d "%~dp0"

echo Starting Backend...
start cmd /k "cd /d ..\BackEnd && call venv\Scripts\activate && uvicorn app.main:app --reload"

echo Starting Frontend...
start cmd /k "cd /d ..\wardrobe-frontend && npm start"

echo All services launched!
pause