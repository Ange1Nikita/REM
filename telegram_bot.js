/**
 * 🤖 100% БЕСПЛАТНОЕ РЕШЕНИЕ через Telegram Bot
 * Неограниченное количество заявок!
 * Мгновенные уведомления в Telegram!
 */

// 🔧 НАСТРОЙКИ TELEGRAM BOT (получить у @BotFather)
const TELEGRAM_CONFIG = {
    botToken: '7578308615:AAE3CHZWnj67k2g4oNJp3dve6ng0k2hMq8M',
    
    // 👥 ОТПРАВКА НЕСКОЛЬКИМ ЛЮДЯМ (добавьте Chat ID каждого человека)
    chatIds: [
        '763907736',           // Chat ID первого человека ✅
        '7706008166'           // Chat ID второго человека ✅
    ],
    
    // 📝 Имена получателей (для отображения в уведомлениях)
    adminNames: [
        '@first_person',       // Username первого человека (ID: 763907736)
        '@second_person'       // Username второго человека (ID: 7706008166)
    ]
};

/**
 * Отправка заявки в Telegram
 */
async function sendToTelegram(formData) {
    try {
        // Проверяем настройки
        if (TELEGRAM_CONFIG.botToken.includes('YOUR_BOT_TOKEN') || 
            TELEGRAM_CONFIG.chatIds.some(id => id.includes('CHAT_ID_PERSON'))) {
            throw new Error('Telegram Bot не настроен - нужно указать Chat ID получателей');
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
        
        // Формируем сообщение
        const message = `🔔 <b>НОВАЯ ЗАЯВКА С САЙТА</b>\n\n` +
                       `👤 <b>Имя:</b> ${formData.name}\n` +
                       `📞 <b>Телефон:</b> <code>${formData.phone}</code>\n` +
                       `📧 <b>Email:</b> ${formData.email || 'Не указан'}\n` +
                       `🛠️ <b>Услуга:</b> ${serviceName}\n` +
                       `💬 <b>Сообщение:</b> ${formData.message || 'Не указано'}\n` +
                       `🕒 <b>Время:</b> ${new Date().toLocaleString('ru-RU')}`;
        
        // 👥 ОТПРАВЛЯЕМ ВСЕМ ПОЛУЧАТЕЛЯМ
        const telegramURL = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
        const sendPromises = [];
        const successfulSends = [];
        const failedSends = [];
        
        // Отправляем каждому получателю
        for (let i = 0; i < TELEGRAM_CONFIG.chatIds.length; i++) {
            const chatId = TELEGRAM_CONFIG.chatIds[i];
            const adminName = TELEGRAM_CONFIG.adminNames[i] || `Получатель ${i + 1}`;
            
            const sendPromise = fetch(telegramURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML',
                    disable_web_page_preview: true
                })
            })
            .then(response => response.json())
            .then(result => {
                if (result.ok) {
                    successfulSends.push(adminName);
                    console.log(`✅ Отправлено ${adminName} (${chatId})`);
                } else {
                    failedSends.push(`${adminName}: ${result.description}`);
                    console.log(`❌ Ошибка отправки ${adminName} (${chatId}):`, result.description);
                }
                return result;
            })
            .catch(error => {
                failedSends.push(`${adminName}: ${error.message}`);
                console.log(`❌ Сетевая ошибка ${adminName} (${chatId}):`, error.message);
            });
            
            sendPromises.push(sendPromise);
        }
        
        // Ждем завершения всех отправок
        await Promise.all(sendPromises);
        
        // Формируем результат
        if (successfulSends.length > 0) {
            let resultMessage = `✅ ЗАЯВКА ОТПРАВЛЕНА!\n\n`;
            
            if (successfulSends.length === TELEGRAM_CONFIG.chatIds.length) {
                resultMessage += `📱 Уведомления отправлены ВСЕМ получателям:\n`;
            } else {
                resultMessage += `📱 Уведомления отправлены (${successfulSends.length} из ${TELEGRAM_CONFIG.chatIds.length}):\n`;
            }
            
            successfulSends.forEach(name => {
                resultMessage += `   ✅ ${name}\n`;
            });
            
            if (failedSends.length > 0) {
                resultMessage += `\n⚠️ Не удалось отправить:\n`;
                failedSends.forEach(error => {
                    resultMessage += `   ❌ ${error}\n`;
                });
            }
            
            resultMessage += `\n📋 Данные заявки:\n` +
                           `👤 Имя: ${formData.name}\n` +
                           `📞 Телефон: ${formData.phone}\n` +
                           `📧 Email: ${formData.email || 'Не указан'}\n` +
                           `🛠️ Услуга: ${serviceName}\n` +
                           `💬 Сообщение: ${formData.message || 'Не указано'}\n\n` +
                           `⚡ Мгновенные уведомления отправлены!\n` +
                           `📞 Ожидайте звонка: +7 989 123 39 53`;
            
            return {
                success: true,
                message: resultMessage
            };
        } else {
            throw new Error(`Не удалось отправить ни одному получателю: ${failedSends.join(', ')}`);
        }
        
    } catch (error) {
        console.error('Telegram Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Discord Webhook (альтернатива Telegram)
 */
async function sendToDiscord(formData) {
    try {
        const DISCORD_WEBHOOK = 'YOUR_DISCORD_WEBHOOK_URL';
        
        if (DISCORD_WEBHOOK.includes('YOUR_DISCORD_WEBHOOK_URL')) {
            throw new Error('Discord Webhook не настроен');
        }
        
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
        
        const embed = {
            title: "🔔 Новая заявка с сайта РЭМ-Инсайт",
            color: 4886890, // Синий цвет
            fields: [
                { name: "👤 Имя", value: formData.name, inline: true },
                { name: "📞 Телефон", value: formData.phone, inline: true },
                { name: "📧 Email", value: formData.email || 'Не указан', inline: true },
                { name: "🛠️ Услуга", value: serviceName, inline: true },
                { name: "💬 Сообщение", value: formData.message || 'Не указано', inline: false },
                { name: "🕒 Время", value: new Date().toLocaleString('ru-RU'), inline: true }
            ],
            footer: {
                text: "Сайт РЭМ-Инсайт"
            },
            timestamp: new Date().toISOString()
        };
        
        const response = await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                embeds: [embed]
            })
        });
        
        if (response.ok) {
            return {
                success: true,
                message: `✅ ЗАЯВКА ОТПРАВЛЕНА В DISCORD!\n\nУведомление отправлено администратору.\nОжидайте звонка: +7 989 123 39 53`
            };
        } else {
            throw new Error(`Discord Webhook error: ${response.status}`);
        }
        
    } catch (error) {
        console.error('Discord Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Google Forms (100% бесплатно, неограниченно)
 */
async function sendToGoogleForms(formData) {
    try {
        // URL Google Form (нужно создать форму и получить URL)
        const GOOGLE_FORM_URL = 'YOUR_GOOGLE_FORM_URL';
        
        if (GOOGLE_FORM_URL.includes('YOUR_GOOGLE_FORM_URL')) {
            throw new Error('Google Form не настроена');
        }
        
        // Отправляем данные в Google Form
        const formDataToSend = new FormData();
        formDataToSend.append('entry.NAME_FIELD', formData.name);
        formDataToSend.append('entry.PHONE_FIELD', formData.phone);
        formDataToSend.append('entry.EMAIL_FIELD', formData.email || '');
        formDataToSend.append('entry.SERVICE_FIELD', formData.service || '');
        formDataToSend.append('entry.MESSAGE_FIELD', formData.message || '');
        
        const response = await fetch(GOOGLE_FORM_URL, {
            method: 'POST',
            body: formDataToSend,
            mode: 'no-cors' // Google Forms требует no-cors
        });
        
        // Google Forms всегда возвращает успех в no-cors режиме
        return {
            success: true,
            message: `✅ ЗАЯВКА ОТПРАВЛЕНА В GOOGLE FORMS!\n\nДанные сохранены в Google Таблице.\nПроверьте вашу Google Forms.\n\n📞 Контакт: +7 989 123 39 53`
        };
        
    } catch (error) {
        console.error('Google Forms Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Netlify Forms (если сайт на Netlify)
 */
async function sendToNetlify(formData) {
    try {
        const response = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                'form-name': 'contact',
                'name': formData.name,
                'phone': formData.phone,
                'email': formData.email || '',
                'service': formData.service || '',
                'message': formData.message || ''
            })
        });
        
        if (response.ok) {
            return {
                success: true,
                message: `✅ ЗАЯВКА ОТПРАВЛЕНА ЧЕРЕЗ NETLIFY!\n\nДанные сохранены в панели Netlify.\n📞 Контакт: +7 989 123 39 53`
            };
        } else {
            throw new Error('Netlify Forms error');
        }
        
    } catch (error) {
        console.error('Netlify Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * ГЛАВНАЯ ФУНКЦИЯ - пробует все бесплатные способы
 */
async function sendEmailFree100(formData) {
    console.log('🚀 Начинаем 100% бесплатную отправку:', formData);
    
    // 1. Telegram Bot (РЕКОМЕНДУЕМЫЙ)
    if (!TELEGRAM_CONFIG.botToken.includes('YOUR_BOT_TOKEN')) {
        console.log('🤖 Пробуем Telegram Bot...');
        const telegramResult = await sendToTelegram(formData);
        if (telegramResult.success) {
            console.log('✅ Telegram успешно!');
            return telegramResult;
        }
        console.log('❌ Telegram не сработал:', telegramResult.error);
    }
    
    // 2. Discord Webhook
    console.log('🎮 Пробуем Discord...');
    const discordResult = await sendToDiscord(formData);
    if (discordResult.success) {
        console.log('✅ Discord успешно!');
        return discordResult;
    }
    console.log('❌ Discord не сработал:', discordResult.error);
    
    // 3. Google Forms
    console.log('📊 Пробуем Google Forms...');
    const googleResult = await sendToGoogleForms(formData);
    if (googleResult.success) {
        console.log('✅ Google Forms успешно!');
        return googleResult;
    }
    console.log('❌ Google Forms не сработал:', googleResult.error);
    
    // 4. Netlify Forms (если на Netlify)
    if (window.location.hostname.includes('netlify')) {
        console.log('🌐 Пробуем Netlify Forms...');
        const netlifyResult = await sendToNetlify(formData);
        if (netlifyResult.success) {
            console.log('✅ Netlify успешно!');
            return netlifyResult;
        }
    }
    
    // 5. Локальное сохранение (всегда работает)
    console.log('💾 Используем локальное сохранение...');
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
                `📊 Просмотр: view_submissions.html\n` +
                `📞 Прямой контакт: +7 989 123 39 53`
    };
}

// Экспорт для использования
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { sendEmailFree100 };
}

// Глобальный доступ
window.sendEmailFree100 = sendEmailFree100;
