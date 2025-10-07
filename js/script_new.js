// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Ensure proper positioning on page load for mobile devices
    if (window.innerWidth <= 768) {
        // Small delay to ensure page is fully loaded
        setTimeout(() => {
            const currentPath = window.location.pathname;
            const isHomePage = currentPath === '/' || currentPath.includes('index.html') || currentPath === '';
            
            if (isHomePage && window.location.hash === '') {
                // If we're on home page without hash, ensure we're at the top
                window.scrollTo(0, 0);
            }
        }, 100);
    }
    const burgerMenu = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (burgerMenu && navMenu) {
        burgerMenu.addEventListener('click', function() {
            burgerMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                burgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
                
                // If it's an internal link, handle scroll offset
                const href = link.getAttribute('href');
                if (href && href.includes('.html')) {
                    // For main page navigation, scroll to top after page loads
                    if (href === 'index.html' && window.location.pathname.includes('index.html') === false) {
                        setTimeout(() => {
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            });
                        }, 100);
                    }
                    // For other page navigation, let it proceed normally
                    return;
                }
                
                // For anchor links within the same page
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        setTimeout(() => {
                            const headerHeight = document.querySelector('.header').offsetHeight;
                            const elementPosition = targetElement.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

                            window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                            });
                        }, 300); // Small delay to let menu close first
                    }
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!burgerMenu.contains(event.target) && !navMenu.contains(event.target)) {
                burgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // FAQ Toggle
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.querySelector('.faq-question').addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
    
    // 🚀 НОВАЯ СИСТЕМА ОТПРАВКИ ПИСЕМ
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('.form-submit');
            const originalButtonText = submitButton.textContent;
            
            // Basic form validation
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const privacy = document.getElementById('privacy').checked;
            
            if (!name) {
                alert('Пожалуйста, введите ваше имя');
                return;
            }
            
            if (!phone) {
                alert('Пожалуйста, введите номер телефона');
                return;
            }
            
            if (!privacy) {
                alert('Необходимо согласие на обработку персональных данных');
                return;
            }
            
            // Disable submit button and show loading
            submitButton.disabled = true;
            submitButton.textContent = 'Отправляем...';
            
            try {
                // Prepare data for sending
                const data = {
                    name: formData.get('name'),
                    phone: formData.get('phone'),
                    email: formData.get('email'),
                    service: formData.get('service'),
                    message: formData.get('message')
                };
                
                // 🎯 ИСПОЛЬЗУЕМ НОВУЮ СИСТЕМУ ОТПРАВКИ
                let result;
                
                // Проверяем, загружен ли модуль отправки писем
                if (typeof window.sendEmailFree === 'function') {
                    console.log('🚀 Используем продвинутую систему отправки');
                    result = await window.sendEmailFree(data);
                } else {
                    // Резервный способ - загружаем модуль динамически
                    console.log('📦 Загружаем модуль отправки писем...');
                    try {
                        const script = document.createElement('script');
                        script.src = 'send_email_free.js';
                        document.head.appendChild(script);
                        
                        await new Promise((resolve) => {
                            script.onload = resolve;
                        });
                        
                        if (typeof window.sendEmailFree === 'function') {
                            result = await window.sendEmailFree(data);
                        } else {
                            throw new Error('Модуль не загрузился');
                        }
                    } catch (moduleError) {
                        console.log('❌ Ошибка загрузки модуля, используем базовое решение');
                        result = await basicEmailSolution(data);
                    }
                }
                
                // Показываем результат
                if (result.success) {
                    alert(result.message);
                    contactForm.reset();
                } else {
                    alert('Ошибка отправки: ' + result.error);
                }
                
            } catch (error) {
                console.error('Общая ошибка:', error);
                
                // Последний резерв - локальное сохранение
                const fallbackResult = await basicEmailSolution({
                    name: formData.get('name'),
                    phone: formData.get('phone'),
                    email: formData.get('email'),
                    service: formData.get('service'),
                    message: formData.get('message')
                });
                
                alert(fallbackResult.message);
                if (fallbackResult.success) {
                    contactForm.reset();
                }
                
            } finally {
                // Restore submit button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
        
        // Phone number formatting
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    if (value[0] === '8') {
                        value = '7' + value.slice(1);
                    }
                    if (value[0] === '7') {
                        value = value.replace(/^7(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/, function(match, p1, p2, p3, p4) {
                            let formatted = '+7';
                            if (p1) formatted += ' (' + p1;
                            if (p2) formatted += ') ' + p2;
                            if (p3) formatted += '-' + p3;
                            if (p4) formatted += '-' + p4;
                            return formatted;
                        });
                    }
                }
                e.target.value = value;
            });
        }
    }
});

/**
 * 🔥 БАЗОВОЕ РЕШЕНИЕ для отправки писем
 * Работает всегда, даже если основной модуль не загрузился
 */
async function basicEmailSolution(formData) {
    try {
        // 1. Пробуем отправить через EmailJS (если библиотека уже загружена)
        if (typeof emailjs !== 'undefined') {
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
            
            try {
                const response = await emailjs.send(
                    'service_rem_insait', // Service ID
                    'template_rem_insait', // Template ID
                    {
                        client_name: formData.name,
                        client_phone: formData.phone,
                        client_email: formData.email || 'Не указан',
                        service_type: serviceName,
                        message: formData.message || 'Не указано',
                        to_email: 'Ange1Nikita@yandex.ru',
                        date_time: new Date().toLocaleString('ru-RU')
                    }
                );
                
                return {
                    success: true,
                    message: `✅ Заявка отправлена через EmailJS!\n\nПисьмо отправлено на Ange1Nikita@yandex.ru\n\nМы свяжемся с вами в ближайшее время!`
                };
            } catch (emailjsError) {
                console.log('EmailJS не сработал:', emailjsError);
            }
        }
        
        // 2. Локальное сохранение как резерв
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
            message: `📋 ЗАЯВКА СОХРАНЕНА!\n\n` +
                    `👤 Имя: ${formData.name}\n` +
                    `📞 Телефон: ${formData.phone}\n` +
                    `📧 Email: ${formData.email || 'Не указан'}\n` +
                    `🛠️ Услуга: ${serviceName}\n` +
                    `💬 Сообщение: ${formData.message || 'Не указано'}\n\n` +
                    `📊 Просмотр заявок: view_submissions.html\n\n` +
                    `📞 Свяжитесь напрямую:\n` +
                    `Телефон: +7 989 123 39 53\n` +
                    `Email: Ange1Nikita@yandex.ru`
        };
        
    } catch (error) {
        console.error('Ошибка базового решения:', error);
        return {
            success: false,
            error: 'Не удалось отправить заявку'
        };
    }
}

// Utility function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Animation on scroll
window.addEventListener('scroll', function() {
    const animatedElements = document.querySelectorAll('.product-card, .brand-card, .service-card, .advantage-item');
    
    animatedElements.forEach(element => {
        if (isInViewport(element) && !element.classList.contains('animated')) {
            element.classList.add('animated');
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});
