@echo off
echo Stopping Digital Wardrobe Project...

taskkill /F /IM node.exe
taskkill /F /IM python.exe

echo All servers stopped!
pause
