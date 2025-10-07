@echo off
echo ================================================
echo  Запуск локального веб-сервера для тестирования
echo ================================================
echo.
echo Сервер будет доступен по адресу: http://localhost:8000
echo Для остановки нажмите Ctrl+C
echo.
echo Проверяем наличие Python...

python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Python найден. Запускаем сервер...
    echo.
    python -m http.server 8000
) else (
    echo Python не найден!
    echo.
    echo Установите Python с https://python.org
    echo Или используйте другой способ запуска сервера.
    echo.
    pause
)
