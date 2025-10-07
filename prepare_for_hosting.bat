@echo off
chcp 65001 > nul
title Подготовка файлов для хостинга
color 0A

echo.
echo ═══════════════════════════════════════════════════════════
echo     🚀 ПОДГОТОВКА ФАЙЛОВ ДЛЯ ЗАГРУЗКИ НА ХОСТИНГ
echo ═══════════════════════════════════════════════════════════
echo.

set "SOURCE_DIR=%~dp0"
set "TARGET_DIR=%SOURCE_DIR%hosting_files"

echo 📁 Исходная папка: %SOURCE_DIR%
echo 📁 Целевая папка: %TARGET_DIR%
echo.

:: Проверяем существует ли папка
if exist "%TARGET_DIR%" (
    echo ⚠️  Папка hosting_files уже существует!
    echo.
    choice /C YN /M "Удалить и создать заново?"
    if errorlevel 2 goto :cancel
    if errorlevel 1 (
        echo 🗑️  Удаляем старую папку...
        rmdir /S /Q "%TARGET_DIR%"
    )
)

:: Создаем структуру папок
echo.
echo 📦 Создаем структуру папок...
mkdir "%TARGET_DIR%"
mkdir "%TARGET_DIR%\css"
mkdir "%TARGET_DIR%\js"
mkdir "%TARGET_DIR%\images"

:: Копируем HTML файлы
echo.
echo 📄 Копируем HTML файлы...
copy "%SOURCE_DIR%index.html" "%TARGET_DIR%\" > nul
copy "%SOURCE_DIR%about.html" "%TARGET_DIR%\" > nul
copy "%SOURCE_DIR%services.html" "%TARGET_DIR%\" > nul
copy "%SOURCE_DIR%contacts.html" "%TARGET_DIR%\" > nul
echo    ✅ index.html
echo    ✅ about.html
echo    ✅ services.html
echo    ✅ contacts.html

:: Копируем PHP файлы
echo.
echo 📧 Копируем PHP файлы...
copy "%SOURCE_DIR%config.php" "%TARGET_DIR%\" > nul
copy "%SOURCE_DIR%send_mail.php" "%TARGET_DIR%\" > nul
echo    ✅ config.php
echo    ✅ send_mail.php

:: Копируем Telegram Bot
echo.
echo 🤖 Копируем Telegram Bot...
copy "%SOURCE_DIR%telegram_bot.js" "%TARGET_DIR%\" > nul
echo    ✅ telegram_bot.js

:: Копируем CSS
echo.
echo 🎨 Копируем CSS...
copy "%SOURCE_DIR%css\style.css" "%TARGET_DIR%\css\" > nul
echo    ✅ css/style.css

:: Копируем JavaScript
echo.
echo ⚡ Копируем JavaScript...
copy "%SOURCE_DIR%js\script.js" "%TARGET_DIR%\js\" > nul
echo    ✅ js/script.js

:: Копируем изображения (если есть)
echo.
echo 🖼️  Копируем изображения...
if exist "%SOURCE_DIR%images\*.*" (
    xcopy /E /I /Y "%SOURCE_DIR%images\*.*" "%TARGET_DIR%\images\" > nul
    echo    ✅ images/
) else (
    echo    ℹ️  Изображений нет
)

:: Создаем README
echo.
echo 📝 Создаем README для хостинга...
(
echo ФАЙЛЫ ГОТОВЫ ДЛЯ ЗАГРУЗКИ НА ХОСТИНГ
echo =====================================
echo.
echo 1. Загрузите все файлы из этой папки на хостинг
echo 2. Откройте config.php и проверьте настройки
echo 3. Откройте telegram_bot.js и проверьте настройки
echo 4. Установите права доступа:
echo    - Файлы: 644
echo    - Папки: 755
echo.
echo 5. Откройте сайт в браузере
echo 6. Протестируйте форму отправки
echo.
echo Подробная инструкция: ИНСТРУКЦИЯ_ХОСТИНГ.md
) > "%TARGET_DIR%\README.txt"
echo    ✅ README.txt создан

:: Создаем .htaccess для защиты
echo.
echo 🔒 Создаем .htaccess...
(
echo # Защита PHP файлов от прямого доступа
echo ^<Files config.php^>
echo     Order allow,deny
echo     Deny from all
echo ^</Files^>
echo.
echo # Перенаправление на HTTPS
echo RewriteEngine On
echo RewriteCond %%{HTTPS} off
echo RewriteRule ^(.*)$ https://%%{HTTP_HOST}%%{REQUEST_URI} [L,R=301]
echo.
echo # Сжатие файлов
echo ^<IfModule mod_deflate.c^>
echo     AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
echo ^</IfModule^>
) > "%TARGET_DIR%\.htaccess"
echo    ✅ .htaccess создан

:: Итоговая информация
echo.
echo ═══════════════════════════════════════════════════════════
echo     ✅ ФАЙЛЫ УСПЕШНО ПОДГОТОВЛЕНЫ!
echo ═══════════════════════════════════════════════════════════
echo.
echo 📁 Папка с файлами: %TARGET_DIR%
echo.
echo 📋 Что дальше:
echo.
echo    1️⃣  Откройте папку hosting_files
echo    2️⃣  Проверьте config.php (измените email)
echo    3️⃣  Проверьте telegram_bot.js (токен и Chat ID)
echo    4️⃣  Загрузите файлы на хостинг через FTP или панель
echo    5️⃣  Протестируйте сайт
echo.
echo 📖 Инструкция: ИНСТРУКЦИЯ_ХОСТИНГ.md
echo 📋 Список файлов: ФАЙЛЫ_ДЛЯ_ХОСТИНГА.txt
echo.

:: Открываем папку
choice /C YN /M "Открыть папку с файлами?"
if errorlevel 1 start "" "%TARGET_DIR%"

goto :end

:cancel
echo.
echo ❌ Отменено пользователем.
echo.

:end
echo.
echo Нажмите любую клавишу для выхода...
pause > nul

