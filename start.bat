@echo off
echo Starting TryGPT Full-Stack Application...

echo Starting Backend Server...
start cmd /k "cd server && npm run dev"

echo Starting Frontend Client...
start cmd /k "cd client && npm run dev"

echo Both servers are starting in new windows!
echo Once they load, open http://localhost:5173 in your browser.
pause
