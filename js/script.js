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
    
    // Проверяем видимость счетчиков
    checkStatsVisibility();
});
