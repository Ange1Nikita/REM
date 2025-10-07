// JavaScript решение для отправки писем через EmailJS
// Это работает без PHP сервера!

// Настройки EmailJS (нужно будет зарегистрироваться на emailjs.com)
const EMAILJS_CONFIG = {
    service_id: 'service_rem_insait',
    template_id: 'template_rem_insait', 
    public_key: 'YOUR_PUBLIC_KEY' // Получить на emailjs.com
};

// Альтернативное решение - отправка через FormSpree
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'; // Получить на formspree.io

// Функция отправки письма через EmailJS
async function sendEmailViaEmailJS(formData) {
    try {
        // Подключаем EmailJS если еще не подключен
        if (typeof emailjs === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            document.head.appendChild(script);
            
            await new Promise(resolve => {
                script.onload = resolve;
            });
            
            emailjs.init(EMAILJS_CONFIG.public_key);
        }

        const templateParams = {
            to_email: 'Ange1Nikita@yandex.ru',
            from_name: formData.name,
            from_phone: formData.phone,
            from_email: formData.email || 'Не указан',
            service_type: getServiceName(formData.service),
            message: formData.message || 'Не указано',
            date_time: new Date().toLocaleString('ru-RU')
        };

        const result = await emailjs.send(
            EMAILJS_CONFIG.service_id,
            EMAILJS_CONFIG.template_id,
            templateParams
        );

        return { success: true, message: 'Письмо отправлено через EmailJS!' };
    } catch (error) {
        console.error('EmailJS Error:', error);
        return { success: false, error: error.message };
    }
}

// Функция отправки через FormSpree
async function sendEmailViaFormSpree(formData) {
    try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                service: getServiceName(formData.service),
                message: formData.message,
                _subject: `Новая заявка с сайта РЭМ-Инсайт - ${getServiceName(formData.service)}`,
                _replyto: formData.email || 'noreply@example.com'
            })
        });

        if (response.ok) {
            return { success: true, message: 'Письмо отправлено через FormSpree!' };
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        console.error('FormSpree Error:', error);
        return { success: false, error: error.message };
    }
}

// Локальное решение - показать данные и сохранить в localStorage
function handleLocalSubmission(formData) {
    // Сохраняем заявку локально
    const submissions = JSON.parse(localStorage.getItem('form_submissions') || '[]');
    const submission = {
        ...formData,
        timestamp: new Date().toISOString(),
        id: Date.now()
    };
    submissions.push(submission);
    localStorage.setItem('form_submissions', JSON.stringify(submissions));

    // Показываем данные пользователю
    const serviceName = getServiceName(formData.service);
    
    alert(`✅ ЗАЯВКА ПРИНЯТА (локально)!\n\n` +
          `👤 Имя: ${formData.name}\n` +
          `📞 Телефон: ${formData.phone}\n` +
          `📧 Email: ${formData.email || 'Не указан'}\n` +
          `🛠️ Услуга: ${serviceName}\n` +
          `💬 Сообщение: ${formData.message || 'Не указано'}\n` +
          `🕒 Время: ${new Date().toLocaleString('ru-RU')}\n\n` +
          `📧 Эти данные сохранены локально.\n` +
          `На реальном сайте они будут отправлены на:\n` +
          `Ange1Nikita@yandex.ru\n\n` +
          `📞 Или свяжитесь напрямую:\n` +
          `Телефон: +7 989 123 39 53\n` +
          `WhatsApp: wa.me/79891233953\n` +
          `Telegram: @rem_insait`);

    return { success: true, message: 'Заявка сохранена локально!' };
}

// Преобразование кода услуги в название
function getServiceName(serviceCode) {
    const services = {
        'video': 'Видеонаблюдение',
        'access': 'Контроль доступа',
        'intercom': 'Домофонные системы',
        'alarm': 'Охранная сигнализация',
        'automation': 'Автоматика ворот',
        'scs': 'СКС',
        'consultation': 'Консультация',
        'other': 'Другое'
    };
    return services[serviceCode] || serviceCode || 'Не выбрана';
}

// Основная функция отправки
async function sendEmail(formData) {
    // Пробуем разные способы отправки
    
    // 1. Пробуем FormSpree (если настроен)
    if (FORMSPREE_ENDPOINT.includes('formspree.io') && !FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) {
        const result = await sendEmailViaFormSpree(formData);
        if (result.success) return result;
    }
    
    // 2. Пробуем EmailJS (если настроен)
    if (!EMAILJS_CONFIG.public_key.includes('YOUR_PUBLIC_KEY')) {
        const result = await sendEmailViaEmailJS(formData);
        if (result.success) return result;
    }
    
    // 3. Локальное решение (всегда работает)
    return handleLocalSubmission(formData);
}

// Экспортируем функцию для использования в основном скрипте
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { sendEmail, getServiceName };
}
