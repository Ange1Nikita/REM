<?php
// Подключаем конфигурацию
require_once 'config.php';

header('Content-Type: application/json; charset=utf-8');

// Настройки почты из конфигурации
$to_email = ADMIN_EMAIL;
$from_email = FROM_EMAIL;
$subject_prefix = SUBJECT_PREFIX;

// CORS заголовки для работы с JavaScript
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Проверяем метод запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Метод не поддерживается']);
    exit;
}

// Получаем данные из формы
$input = json_decode(file_get_contents('php://input'), true);

// Если данные не JSON, пробуем получить из $_POST
if (!$input) {
    $input = $_POST;
}

// Валидация обязательных полей
$required_fields = ['name', 'phone', 'privacy'];
$errors = [];

foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        $errors[] = "Поле '$field' обязательно для заполнения";
    }
}

// Проверка согласия на обработку данных
if (empty($input['privacy']) || $input['privacy'] !== 'on') {
    $errors[] = "Необходимо согласие на обработку персональных данных";
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode('. ', $errors)]);
    exit;
}

// Очистка и подготовка данных
$name = htmlspecialchars(trim($input['name']));
$phone = htmlspecialchars(trim($input['phone']));
$email = !empty($input['email']) ? htmlspecialchars(trim($input['email'])) : 'Не указан';
$service = !empty($input['service']) ? htmlspecialchars(trim($input['service'])) : 'Не выбрана';
$message = !empty($input['message']) ? htmlspecialchars(trim($input['message'])) : 'Не указано';

// Преобразование кода услуги в читаемый вид
$services_map = [
    'video' => 'Видеонаблюдение',
    'access' => 'Контроль доступа',
    'intercom' => 'Домофонные системы',
    'alarm' => 'Охранная сигнализация',
    'automation' => 'Автоматика ворот',
    'scs' => 'СКС',
    'consultation' => 'Консультация',
    'other' => 'Другое'
];

$service_name = isset($services_map[$service]) ? $services_map[$service] : $service;

// Формируем тему письма
$subject = $subject_prefix . " - " . $service_name;

// Формируем тело письма
$email_body = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>Новая заявка</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4a90e2; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #4a90e2; }
        .value { margin-top: 5px; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🔔 Новая заявка с сайта</h1>
            <p>" . COMPANY_NAME . "</p>
        </div>
        
        <div class='content'>
            <div class='field'>
                <div class='label'>👤 Имя клиента:</div>
                <div class='value'>{$name}</div>
            </div>
            
            <div class='field'>
                <div class='label'>📞 Телефон:</div>
                <div class='value'>{$phone}</div>
            </div>
            
            <div class='field'>
                <div class='label'>📧 Email:</div>
                <div class='value'>{$email}</div>
            </div>
            
            <div class='field'>
                <div class='label'>🛠️ Интересующая услуга:</div>
                <div class='value'>{$service_name}</div>
            </div>
            
            <div class='field'>
                <div class='label'>💬 Сообщение:</div>
                <div class='value'>" . nl2br($message) . "</div>
            </div>
            
            <div class='field'>
                <div class='label'>🕒 Дата и время:</div>
                <div class='value'>" . date('d.m.Y H:i:s') . "</div>
            </div>
        </div>
        
        <div class='footer'>
            <p>Это автоматическое уведомление с сайта " . COMPANY_NAME . "</p>
            <p>Свяжитесь с клиентом в ближайшее время!</p>
        </div>
    </div>
</body>
</html>
";

// Заголовки для HTML письма
$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=utf-8',
    'From: ' . $from_email,
    'Reply-To: ' . ($email !== 'Не указан' ? $email : $from_email),
    'X-Mailer: PHP/' . phpversion()
];

// Отправляем письмо
$mail_sent = mail($to_email, $subject, $email_body, implode("\r\n", $headers));

if ($mail_sent) {
    // Логирование успешной отправки
    if (ENABLE_LOGGING) {
        $log_entry = date('Y-m-d H:i:s') . " - Заявка отправлена: {$name}, {$phone}, {$service_name}, {$email}\n";
        file_put_contents(LOG_FILE, $log_entry, FILE_APPEND | LOCK_EX);
    }
    
    echo json_encode([
        'success' => true, 
        'message' => 'Спасибо за заявку! Мы свяжемся с вами в ближайшее время.'
    ]);
} else {
    // Логирование ошибки
    if (ENABLE_LOGGING) {
        $error_log = date('Y-m-d H:i:s') . " - Ошибка отправки: {$name}, {$phone}, {$service_name}\n";
        file_put_contents(ERROR_LOG_FILE, $error_log, FILE_APPEND | LOCK_EX);
    }
    
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.'
    ]);
}
?>
