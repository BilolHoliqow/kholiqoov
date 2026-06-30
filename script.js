// ===========================
// ИНИЦИАЛИЗАЦИЯ И ОБЩИЕ ФУНКЦИИ
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initDownloadButtons();
    initScrollAnimations();
    initInteractiveElements();
    initParallax();
});

// ===========================
// НАВИГАЦИЯ И АКТИВНЫЕ ССЫЛКИ
// ===========================

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navIndicator = document.querySelector('.nav-indicator');
    
    function updateIndicator(link) {
        const { offsetLeft, offsetWidth } = link;
        navIndicator.style.left = offsetLeft + 'px';
        navIndicator.style.width = offsetWidth + 'px';
    }

    // Инициализация индикатора
    const activeLink = document.querySelector('.nav-link.active') || navLinks[0];
    if (activeLink) {
        updateIndicator(activeLink);
    }

    // Обработка кликов по навигации
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Удаляем активный класс со всех
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Добавляем активный класс текущей ссылке
            link.classList.add('active');
            updateIndicator(link);
            
            // Переходим к секции
            const sectionId = link.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            
            if (section) {
                setTimeout(() => {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        });

        // Обновляем индикатор при наведении
        link.addEventListener('mouseenter', () => {
            updateIndicator(link);
        });
    });

    // Обновляем активную ссылку при скролле
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
                updateIndicator(link);
            }
        });
    });
}

// ===========================
// ФУНКЦИОНАЛ СКАЧИВАНИЯ ФАЙЛОВ
// ===========================

function initDownloadButtons() {
    const downloadBtns = document.querySelectorAll('.download-btn');
    
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const fileName = btn.getAttribute('data-file');
            
            // Создаём элемент ссылки для скачивания
            const link = document.createElement('a');
            link.href = `#`; // Здесь будет путь к файлу
            link.download = fileName;
            
            // Анимация кнопки при скачивании
            const originalContent = btn.innerHTML;
            btn.innerHTML = '<span class="btn-icon">✓</span>Загружено!';
            btn.style.background = 'linear-gradient(135deg, #34d399, #06b6d4)';
            
            // Имитация скачивания (в реальном приложении здесь будет скачивание)
            console.log(`Скачивание: ${fileName}`);
            showNotification(`Загружаем: ${fileName}`, 'success');
            
            // Возвращаем оригинальное состояние кнопки
            setTimeout(() => {
                btn.innerHTML = originalContent;
                btn.style.background = '';
            }, 2000);
        });
    });
}

// ===========================
// УВЕДОМЛЕНИЯ
// ===========================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Стили для уведомлений
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        zIndex: '1000',
        animation: 'slideInRight 0.3s ease',
        backdropFilter: 'blur(10px)',
    });

    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #34d399, #06b6d4)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #60a5fa, #38bdf8)';
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

// ===========================
// АНИМАЦИИ ПРИ СКРОЛЛЕ
// ===========================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Наблюдаем за всеми карточками
    document.querySelectorAll('.card, .section-card, .article-card, .file-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Анимация для элементов списков
    document.querySelectorAll('.list-content li').forEach((li, index) => {
        li.style.opacity = '0';
        li.style.transform = 'translateX(-20px)';
        li.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(li);
    });
}

// ===========================
// ИНТЕРАКТИВНЫЕ ЭЛЕМЕНТЫ
// ===========================

function initInteractiveElements() {
    // Эффект для карточек при наведении
    const cards = document.querySelectorAll('.card, .section-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Интерактивность для элементов медиа
    const mediaItems = document.querySelectorAll('.media-item');
    
    mediaItems.forEach(item => {
        const img = item.querySelector('img, video');
        
        if (img) {
            img.addEventListener('click', () => {
                openMediaViewer(img.src || img.querySelector('source').src);
            });
            
            // Добавляем курсор для указания возможности открыть
            item.style.cursor = 'pointer';
        }
    });

    // Интерактивность для тегов
    const tags = document.querySelectorAll('.tag, .article-tag, .file-size, .file-type');
    
    tags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });

        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// ===========================
// ПАРАЛЛАКС ЭФФЕКТ
// ===========================

function initParallax() {
    const parallaxElements = document.querySelectorAll('.profile-img, .profile-glow');
    
    window.addEventListener('scroll', () => {
        parallaxElements.forEach(el => {
            const scrollPosition = window.pageYOffset;
            const elementOffset = el.offsetTop;
            const distance = scrollPosition - elementOffset;
            
            if (Math.abs(distance) < 500) {
                el.style.transform = `translateY(${distance * 0.1}px)`;
            }
        });
    });
}

// ===========================
// ПРОСМОТРЩИК МЕДИА
// ===========================

function openMediaViewer(src) {
    const viewer = document.createElement('div');
    viewer.className = 'media-viewer';
    
    const img = document.createElement('img');
    img.src = src;
    img.style.maxWidth = '90%';
    img.style.maxHeight = '90%';
    img.style.borderRadius = '12px';
    img.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.5)';
    
    Object.assign(viewer.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '2000',
        backdropFilter: 'blur(5px)',
        animation: 'fadeIn 0.3s ease',
        cursor: 'pointer'
    });

    viewer.appendChild(img);
    document.body.appendChild(viewer);

    // Закрытие просмотрщика
    const closeViewer = () => {
        viewer.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => viewer.remove(), 300);
    };

    viewer.addEventListener('click', closeViewer);

    // Закрытие по ESC
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            closeViewer();
            document.removeEventListener('keydown', handleEsc);
        }
    };

    document.addEventListener('keydown', handleEsc);
}

// ===========================
// АНИМАЦИИ КНОПОК
// ===========================

function initButtonAnimations() {
    const buttons = document.querySelectorAll('button, .download-btn, .social-icon');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Ripple эффект
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Инициализируем после загрузки DOM
window.addEventListener('load', () => {
    initButtonAnimations();
});

// ===========================
// ГЛАДКИЙ СКРОЛЛ ДЛЯ ЯКОРЕЙ
// ===========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===========================
// АНИМАЦИЯ ВВОДА ТЕКСТА
// ===========================

function typeEffect(element, speed = 50) {
    const text = element.textContent;
    element.textContent = '';
    let i = 0;

    const type = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };

    type();
}

// ===========================
// ТРИГГЕР ДЛЯ АНИМАЦИИ ЗАГОЛОВКА
// ===========================

const headerTitle = document.querySelector('.header-title');
if (headerTitle) {
    window.addEventListener('load', () => {
        headerTitle.style.animation = 'glow 3s ease-in-out infinite';
    });
}

// ===========================
// ОБРАБОТКА ДИНАМИЧЕСКИХ ЭЛЕМЕНТОВ
// ===========================

function observeNewElements() {
    const targetConfig = { attributes: true, childList: true, subtree: true };
    
    const callback = (mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // Переинициализируем анимации для новых элементов
                initScrollAnimations();
                initInteractiveElements();
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(document.main || document.body, targetConfig);
}

observeNewElements();

// ===========================
// ДОПОЛНИТЕЛЬНЫЕ СТИЛИ ДЛЯ АНИМАЦИЙ
// ===========================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .media-viewer img {
        animation: zoomIn 0.3s ease;
    }

    @keyframes zoomIn {
        from {
            transform: scale(0.8);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }

    /* Светящийся фон при наведении */
    .card:hover::after,
    .section-card:hover::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at center, rgba(96, 165, 250, 0.1) 0%, transparent 70%);
        pointer-events: none;
        border-radius: inherit;
    }
`;

document.head.appendChild(style);

// ===========================
// ИНИЦИАЛИЗАЦИЯ ЗАВЕРШЕНА
// ===========================

console.log('✨ Сайт загружен с интерактивными эффектами!');

// Показываем приветствие
setTimeout(() => {
    showNotification('👋 Добро пожаловать на мой сайт!', 'info');
}, 500);
