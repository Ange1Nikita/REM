/**
 * БЕСПЛАТНОЕ РЕШЕНИЕ для отправки писем через EmailJS
 * Работает сразу после настройки!
 */

// 🔧 НАСТРОЙКИ EmailJS (получить на https://emailjs.com)
const EMAIL_CONFIG = {
    serviceID: 'service_rem_insait',     // Ваш Service ID
    templateID: 'template_rem_insait',   // Ваш Template ID  
    publicKey: 'YOUR_PUBLIC_KEY'         // Ваш Public Key
};

// 📧 Email для получения заявок
const ADMIN_EMAIL = 'Ange1Nikita@yandex.ru';

/**
 * Инициализация EmailJS
 */
async function initEmailJS() {
    try {
        // Загружаем библиотеку EmailJS если еще не загружена
        if (typeof emailjs === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            document.head.appendChild(script);
            
            // Ждем загрузки
            await new Promise((resolve) => {
                script.onload = resolve;
            });
        }
        
        // Инициализируем EmailJS
        emailjs.init(EMAIL_CONFIG.publicKey);
        return true;
    } catch (error) {
        console.error('Ошибка инициализации EmailJS:', error);
        return false;
    }
}

/**
 * Отправка письма через EmailJS
 */
async function sendEmailViaEmailJS(formData) {
    try {
        // Инициализируем EmailJS
        const isInitialized = await initEmailJS();
        if (!isInitialized) {
            throw new Error('EmailJS не удалось инициализировать');
        }
        
        // Преобразуем код услуги в название
        const serviceNames = {
            'video': 'Видеонаблюдение',
            'access': 'Контроль доступа',
            'intercom': 'Домофонные системы',
            'alarm': 'Охранная сигнализация',
            'automation': 'Автоматика ворот',
            'scs': 'СКС',
            'consultation': 'Консультация',
            'other': 'Другое'
        };
        
        const serviceName = serviceNames[formData.service] || formData.service || 'Не выбрана';
        
        // Параметры для шаблона письма
        const templateParams = {
            // Основные данные
            client_name: formData.name,
            client_phone: formData.phone,
            client_email: formData.email || 'Не указан',
            service_type: serviceName,
            message: formData.message || 'Не указано',
            
            // Дополнительные параметры
            to_email: ADMIN_EMAIL,
            from_name: `Сайт РЭМ-Инсайт`,
            subject: `Новая заявка - ${serviceName}`,
            date_time: new Date().toLocaleString('ru-RU'),
            
            // Для автоответа клиенту (если настроен)
            reply_to: formData.email || 'noreply@rem-insait.ru'
        };
        
        // Отправляем письмо
        const response = await emailjs.send(
            EMAIL_CONFIG.serviceID,
            EMAIL_CONFIG.templateID,
            templateParams
        );
        
        console.log('EmailJS Success:', response);
        return {
            success: true,
            message: `✅ Заявка успешно отправлена!\n\nПисьмо отправлено на ${ADMIN_EMAIL}\n\nМы свяжемся с вами в ближайшее время!\n\n📞 Или звоните: +7 989 123 39 53`
        };
        
    } catch (error) {
        console.error('EmailJS Error:', error);
        return {
            success: false,
            error: error.message || 'Неизвестная ошибка EmailJS'
        };
    }
}

/**
 * Резервное решение через Web3Forms (тоже бесплатно)
 */
async function sendEmailViaWeb3Forms(formData) {
    try {
        const serviceNames = {
            'video': 'Видеонаблюдение',
            'access': 'Контроль доступа',
            'intercom': 'Домофонные системы',
            'alarm': 'Охранная сигнализация',
            'automation': 'Автоматика ворот',
            'scs': 'СКС',
            'consultation': 'Консультация',
            'other': 'Другое'
        };
        
        const serviceName = serviceNames[formData.service] || formData.service || 'Не выбрана';
        
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                access_key: 'YOUR_WEB3FORMS_KEY', // Получить на https://web3forms.com
                name: formData.name,
                email: formData.email || 'noreply@rem-insait.ru',
                phone: formData.phone,
                service: serviceName,
                message: formData.message || 'Не указано',
                to: ADMIN_EMAIL,
                subject: `Новая заявка с сайта РЭМ-Инсайт - ${serviceName}`,
                from_name: 'Сайт РЭМ-Инсайт',
                redirect: false
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            return {
                success: true,
                message: `✅ Заявка успешно отправлена через Web3Forms!\n\nПисьмо отправлено на ${ADMIN_EMAIL}`
            };
        } else {
            throw new Error(result.message || 'Web3Forms error');
        }
        
    } catch (error) {
        console.error('Web3Forms Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Локальное сохранение как запасной вариант
 */
function saveLocally(formData) {
    try {
        // Сохраняем в localStorage
        const submissions = JSON.parse(localStorage.getItem('form_submissions') || '[]');
        const submission = {
            ...formData,
            timestamp: new Date().toISOString(),
            id: Date.now()
        };
        submissions.push(submission);
        localStorage.setItem('form_submissions', JSON.stringify(submissions));
        
        const serviceNames = {
            'video': 'Видеонаблюдение',
            'access': 'Контроль доступа',
            'intercom': 'Домофонные системы',
            'alarm': 'Охранная сигнализация',
            'automation': 'Автоматика ворот',
            'scs': 'СКС',
            'consultation': 'Консультация',
            'other': 'Другое'
        };
        
        const serviceName = serviceNames[formData.service] || formData.service || 'Не выбрана';
        
        return {
            success: true,
            message: `📋 ЗАЯВКА СОХРАНЕНА ЛОКАЛЬНО!\n\n` +
                    `👤 Имя: ${formData.name}\n` +
                    `📞 Телефон: ${formData.phone}\n` +
                    `📧 Email: ${formData.email || 'Не указан'}\n` +
                    `🛠️ Услуга: ${serviceName}\n` +
                    `💬 Сообщение: ${formData.message || 'Не указано'}\n\n` +
                    `📊 Просмотр заявок: view_submissions.html\n\n` +
                    `📞 Свяжитесь напрямую:\n` +
                    `Телефон: +7 989 123 39 53\n` +
                    `Email: ${ADMIN_EMAIL}`
        };
    } catch (error) {
        console.error('Local save error:', error);
        return {
            success: false,
            error: 'Ошибка локального сохранения'
        };
    }
}

/**
 * ГЛАВНАЯ ФУНКЦИЯ отправки писем
 * Пробует разные способы по очереди
 */
async function sendEmail(formData) {
    console.log('🚀 Начинаем отправку письма:', formData);
    
    // 1. Пробуем EmailJS (если настроен)
    if (!EMAIL_CONFIG.publicKey.includes('YOUR_PUBLIC_KEY')) {
        console.log('📧 Пробуем EmailJS...');
        const emailJSResult = await sendEmailViaEmailJS(formData);
        if (emailJSResult.success) {
            console.log('✅ EmailJS успешно!');
            return emailJSResult;
        }
        console.log('❌ EmailJS не сработал:', emailJSResult.error);
    }
    
    // 2. Пробуем Web3Forms (если настроен)
    console.log('📧 Пробуем Web3Forms...');
    const web3Result = await sendEmailViaWeb3Forms(formData);
    if (web3Result.success) {
        console.log('✅ Web3Forms успешно!');
        return web3Result;
    }
    console.log('❌ Web3Forms не сработал:', web3Result.error);
    
    // 3. Локальное сохранение (всегда работает)
    console.log('💾 Используем локальное сохранение...');
    return saveLocally(formData);
}

// Экспортируем для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { sendEmail };
}

// Делаем доступным глобально
window.sendEmailFree = sendEmail;
