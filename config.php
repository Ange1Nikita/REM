<?php
/**
 * Конфигурационный файл для настройки отправки писем
 * Здесь можно легко изменить email для получения заявок
 */

// Email для получения заявок (ИЗМЕНИТЬ ПРИ НЕОБХОДИМОСТИ)
define('ADMIN_EMAIL', 'Ange1Nikita@yandex.ru');

// Email отправителя (лучше использовать домен сайта)
define('FROM_EMAIL', 'noreply@rem-insait.ru');

// Префикс темы письма
define('SUBJECT_PREFIX', 'Новая заявка с сайта РЭМ-Инсайт');

// Название компании
define('COMPANY_NAME', 'РЭМ-Инсайт - Системы безопасности');

// Включить логирование заявок (true/false)
define('ENABLE_LOGGING', true);

// Путь к файлу логов
define('LOG_FILE', 'mail_log.txt');

// Путь к файлу ошибок
define('ERROR_LOG_FILE', 'mail_errors.txt');
?>
