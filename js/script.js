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

    // Smart links for WhatsApp / Telegram: корректно открываем чат на мобиле и веб на десктопе
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    function setupSmartMessengerLinks() {
        const waSelectors = [
            'a.contact-link.whatsapp',
            'a.contact-value[href*="whatsapp"], a.contact-value[href*="wa.me"]'
        ];
        const tgSelectors = [
            'a.contact-link.telegram',
            'a.contact-value[href*="telegram"], a.contact-value[href*="web.telegram.org"], a.contact-value[href^="tg://"]'
        ];

        const updateLinkBehavior = (elements, getUrl) => {
            elements.forEach(el => {
                el.addEventListener('click', function(e) {
                    // Всегда открываем корректную ссылку в зависимости от устройства
                    e.preventDefault();
                    const url = getUrl();
                    // Используем window.open, чтобы не блокировалось
                    window.open(url, '_blank');
                });
            });
        };

        // WhatsApp
        const waElements = document.querySelectorAll(waSelectors.join(','));
        updateLinkBehavior(waElements, () => {
            const mobileUrl = 'https://wa.me/79891233953';
            const desktopUrl = 'https://web.whatsapp.com/send?phone=79891233953';
            return isMobileDevice() ? mobileUrl : desktopUrl;
        });

        // Telegram (ID: 7706008166)
        const tgElements = document.querySelectorAll(tgSelectors.join(','));
        updateLinkBehavior(tgElements, () => {
            // Используем t.me — Telegram сам предложит выбор: приложение или Web
            return 'https://t.me/Vyacheslav_REMINSAID';
        });
    }

    setupSmartMessengerLinks();

    // Небольшое модальное окно с выбором: Приложение / Браузер
    function showMessengerChoice(title, appUrl, webUrl) {
        const existing = document.getElementById('messenger-choice-modal');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'messenger-choice-modal';
        overlay.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);z-index:10000;padding:16px;';

        const box = document.createElement('div');
        box.style.cssText = 'max-width:420px;width:100%;background:#1f1f1f;border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:24px;color:#fff;font-family:inherit;box-shadow:0 12px 40px rgba(0,0,0,.4)';
        box.innerHTML = `
            <div style="font-size:1.1rem;font-weight:600;margin-bottom:10px;">Открыть ${title}</div>
            <div style="color:#b0b0b0;font-size:.95rem;margin-bottom:18px;">Выберите, где открыть диалог.</div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">
                <button id="open-app" style="flex:1;min-width:160px;padding:12px 16px;border-radius:10px;border:1px solid #4a90e2;background:#4a90e2;color:#fff;font-weight:600;cursor:pointer;">Открыть приложение</button>
                <button id="open-web" style="flex:1;min-width:160px;padding:12px 16px;border-radius:10px;border:1px solid rgba(255,255,255,.2);background:transparent;color:#fff;font-weight:600;cursor:pointer;">Открыть в браузере</button>
            </div>
            <div style="text-align:center;margin-top:12px;">
                <button id="close-choice" style="background:transparent;border:none;color:#b0b0b0;cursor:pointer">Отмена</button>
            </div>
        `;

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        box.querySelector('#close-choice').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

        box.querySelector('#open-app').addEventListener('click', () => {
            window.location.href = appUrl;
            setTimeout(() => { window.open(webUrl, '_blank'); }, 800);
            overlay.remove();
        });
        box.querySelector('#open-web').addEventListener('click', () => {
            window.open(webUrl, '_blank');
            overlay.remove();
        });
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
    
    // FAQ Toggle functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        
        if (question && answer && toggle) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherToggle = otherItem.querySelector('.faq-toggle');
                        if (otherToggle) otherToggle.textContent = '+';
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    toggle.textContent = '+';
                } else {
                    item.classList.add('active');
                    toggle.textContent = '−';
                }
            });
        }
    });
    
    // Form validation and submission
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
                    message: formData.get('message'),
                    privacy: privacy ? 'on' : 'off'
                };
                
                // 1. ПРИОРИТЕТ: Telegram Bot (если подключен)
                if (typeof window.sendEmailFree100 === 'function') {
                    console.log('🤖 Отправляем через Telegram Bot...');
                    const telegramResult = await window.sendEmailFree100(data);
                    
                    if (telegramResult.success) {
                        alert(telegramResult.message);
                        contactForm.reset();
                        return;
                    } else {
                        console.log('❌ Telegram не сработал, пробуем другие способы...');
                    }
                }
                
                // 2. Пробуем PHP (если сервер поддерживает)
                try {
                    const response = await fetch('send_mail.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    });
                    
                    if (response.ok) {
                        const result = await response.json();
                        if (result.success) {
                            alert(result.message);
                            contactForm.reset();
                            return;
                        }
                    }
                } catch (phpError) {
                    console.log('PHP не доступен, используем локальное сохранение');
                }
                
                // 3. Запасной вариант - локальное сохранение
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
                
                const serviceName = serviceNames[data.service] || data.service || 'Не выбрана';
                
                // Сохраняем заявку локально
                const submissions = JSON.parse(localStorage.getItem('form_submissions') || '[]');
                const submission = {
                    ...data,
                    serviceName: serviceName,
                    timestamp: new Date().toISOString(),
                    id: Date.now()
                };
                submissions.push(submission);
                localStorage.setItem('form_submissions', JSON.stringify(submissions));
                
                // Показываем сообщение
                const message = `📋 ЗАЯВКА СОХРАНЕНА ЛОКАЛЬНО!\n\n` +
                      `👤 Имя: ${data.name}\n` +
                      `📞 Телефон: ${data.phone}\n` +
                      `📧 Email: ${data.email || 'Не указан'}\n` +
                      `🛠️ Услуга: ${serviceName}\n` +
                      `💬 Сообщение: ${data.message || 'Не указано'}\n` +
                      `🕒 Время: ${new Date().toLocaleString('ru-RU')}\n\n` +
                      `⚠️ Telegram Bot не настроен или не доступен.\n\n` +
                      `📞 Свяжитесь напрямую:\n` +
                      `Телефон: +7 989 123 39 53\n` +
                      `WhatsApp: wa.me/79891233953\n` +
                      `Telegram: @rem_insait`;
                
                alert(message);
                contactForm.reset();
                
            } catch (error) {
                console.error('Критическая ошибка:', error);
                alert('Произошла ошибка при отправке заявки.\n\nПожалуйста, свяжитесь с нами напрямую:\n📞 +7 989 123 39 53\n💬 WhatsApp: wa.me/79891233953');
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
    
    // Smooth scrolling for anchor links with header offset
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
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
    
    // Проверяем счетчики при загрузке страницы
    setTimeout(checkStatsVisibility, 100);
});

// Utility: consider element visible when верх попадает в зону видимости на 20–30%
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    // Триггерим, когда верх элемента появился в нижних 80% окна и элемент ещё не ушёл выше
    return rect.top < viewportHeight * 0.9 && rect.bottom > 0;
}

// Counter animation for stats
let statsAnimated = false;

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Обновляем текст с учетом суффикса
        const suffix = element.textContent.includes('%') ? '%' : '+';
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

function checkStatsVisibility() {
    const statsSection = document.querySelector('.experience');
    if (!statsSection || statsAnimated) return;
    
    const rect = statsSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isVisible) {
        statsAnimated = true;
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const special = stat.getAttribute('data-special');
            
            if (special) {
                // Для специальных значений типа "24/7" просто показываем их
                stat.textContent = special;
            } else if (target) {
                // Анимируем число
                animateCounter(stat, target);
            }
        });
    }
}

// Обработчик анимаций (вызываем при загрузке и при скролле)
function processScrollAnimations() {
    const animatedElements = document.querySelectorAll('.product-card, .brand-card, .service-card, .advantage-item');
    animatedElements.forEach(element => {
        if (isInViewport(element) && !element.classList.contains('animated')) {
            element.classList.add('animated');
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
    checkStatsVisibility();
}

// Стартовая инициализация без ожидания скролла (особенно важно на мобильных)
document.addEventListener('DOMContentLoaded', function() {
    // Небольшая задержка, чтобы избежать сдвигов макета
    setTimeout(processScrollAnimations, 50);
});

// Троттлим обработчик прокрутки для производительности
let scrollTimeout;
window.addEventListener('scroll', function() {
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(() => {
        processScrollAnimations();
        scrollTimeout = null;
    }, 50);
});
