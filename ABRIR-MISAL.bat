@echo off
rem ============================================================
rem   Misal Anglicano - servidor local
rem   Doble clic para levantar la app en http://localhost:8080
rem ============================================================
title Misal Anglicano - servidor local
cd /d "%~dp0"

echo.
echo   Levantando el servidor local del Misal Anglicano...
echo.
echo   Cuando el navegador abra, la app corre en:
echo       http://localhost:8080
echo.
echo   Para detener el servidor: cerrar esta ventana o Ctrl+C
echo.

start "" http://localhost:8080/index.html
npx -y http-server -p 8080 -c-1

pause
