@echo off
chcp 65001 >nul
color 0B
title 🚀 Подготовка файлов для хостинга

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║     🚀 ПОДГОТОВКА САЙТА ДЛЯ ХОСТИНГА                     ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

:: Создаем папку для хостинга
set "HOSTING_FOLDER=hosting_ready"

if exist "%HOSTING_FOLDER%" (
    echo 🗑️  Удаляем старую папку...
    rmdir /s /q "%HOSTING_FOLDER%"
)

echo 📁 Создаем новую папку для хостинга...
mkdir "%HOSTING_FOLDER%"
mkdir "%HOSTING_FOLDER%\css"
mkdir "%HOSTING_FOLDER%\js"
mkdir "%HOSTING_FOLDER%\images"

echo.
echo ═══════════════════════════════════════════════════════════
echo  📄 КОПИРОВАНИЕ ФАЙЛОВ
echo ═══════════════════════════════════════════════════════════
echo.

:: Копируем HTML файлы
echo ✅ Копируем HTML страницы...
copy "index.html" "%HOSTING_FOLDER%\" >nul
copy "about.html" "%HOSTING_FOLDER%\" >nul
copy "services.html" "%HOSTING_FOLDER%\" >nul
copy "contacts.html" "%HOSTING_FOLDER%\" >nul
echo    - index.html
echo    - about.html
echo    - services.html
echo    - contacts.html

:: Копируем CSS
echo.
echo ✅ Копируем CSS стили...
copy "css\style.css" "%HOSTING_FOLDER%\css\" >nul
echo    - css/style.css

:: Копируем JavaScript
echo.
echo ✅ Копируем JavaScript...
copy "js\script.js" "%HOSTING_FOLDER%\js\" >nul
copy "telegram_bot.js" "%HOSTING_FOLDER%\" >nul
echo    - js/script.js
echo    - telegram_bot.js

:: Копируем изображения (если есть)
echo.
echo ✅ Копируем изображения...
if exist "images\*.*" (
    xcopy "images\*.*" "%HOSTING_FOLDER%\images\" /E /I /Y >nul
    echo    - images/ (все файлы)
) else (
    echo    - images/ (пусто - пропускаем)
)

echo.
echo ═══════════════════════════════════════════════════════════
echo  ✅ ГОТОВО!
echo ═══════════════════════════════════════════════════════════
echo.
echo 📁 Все файлы скопированы в папку: %HOSTING_FOLDER%
echo.
echo ═══════════════════════════════════════════════════════════
echo  📋 СЛЕДУЮЩИЕ ШАГИ:
echo ═══════════════════════════════════════════════════════════
echo.
echo  1️⃣  Откройте папку "%HOSTING_FOLDER%"
echo  2️⃣  Проверьте telegram_bot.js (Bot Token и Chat ID)
echo  3️⃣  Создайте ZIP архив из содержимого папки
echo  4️⃣  Загрузите на хостинг (GitHub Pages, Netlify и т.д.)
echo.
echo ═══════════════════════════════════════════════════════════
echo  🌐 РЕКОМЕНДУЕМЫЕ БЕСПЛАТНЫЕ ХОСТИНГИ:
echo ═══════════════════════════════════════════════════════════
echo.
echo  ⭐ GitHub Pages    - github.com
echo  ⭐ Netlify         - netlify.com
echo  ⭐ Vercel          - vercel.com
echo.
echo 📖 Подробная инструкция: ГОТОВО_К_ХОСТИНГУ.md
echo.
echo Нажмите любую клавишу для выхода...
pause >nul

:: Открываем папку с файлами
explorer "%HOSTING_FOLDER%"

