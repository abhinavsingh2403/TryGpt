@echo off
echo ==============================================
echo Building TryGPT for Production...
echo ==============================================

echo [1/3] Navigating to client folder...
cd client

echo [2/3] Installing frontend dependencies (just in case)...
call npm install

echo [3/3] Building the React frontend...
call npm run build

echo.
echo ==============================================
echo ✅ BUILD COMPLETE!
echo The 'client/dist' folder has been generated.
echo To run in production mode, go to the 'server' 
echo folder and run:
echo    set NODE_ENV=production
echo    node server.js
echo ==============================================
pause
