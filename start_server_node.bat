@echo off
echo ================================================
echo  Запуск локального веб-сервера (Node.js)
echo ================================================
echo.
echo Сервер будет доступен по адресу: http://localhost:3000
echo Для остановки нажмите Ctrl+C
echo.
echo Проверяем наличие Node.js...

node --version >nul 2>&1
if %errorlevel% == 0 (
    echo Node.js найден. Устанавливаем live-server...
    npm install -g live-server
    echo.
    echo Запускаем сервер...
    live-server --port=3000
) else (
    echo Node.js не найден!
    echo.
    echo Установите Node.js с https://nodejs.org
    echo Или используйте Python версию (start_server.bat).
    echo.
    pause
)
