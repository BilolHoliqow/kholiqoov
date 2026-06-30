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
    
    if (!navIndicator) return;

    function updateIndicator(link) {
        const { offsetLeft, offsetWidth } = link;
        navIndicator.style.left = offsetLeft + 'px';
        navIndicator.style.width = offsetWidth + 'px';
        navIndicator.style.display = 'block';
    }

    const activeLink = document.querySelector('.nav-link.active') || navLinks[0];
    if (activeLink) {
        setTimeout(() => updateIndicator(activeLink), 100);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            updateIndicator(link);
            
            const sectionId = link.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            
            if (section) {
                setTimeout(() => {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        });

        link.addEventListener('mouseenter', () => updateIndicator(link));
        link.addEventListener('mouseleave', () => {
            const active = document.querySelector('.nav-link.active') || navLinks[0];
            if (active) updateIndicator(active);
        });
    });

    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
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

    window.addEventListener('resize', () => {
        const active = document.querySelector('.nav-link.active') || navLinks[0];
        if (active) updateIndicator(active);
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
            
            const originalContent = btn.innerHTML;
            btn.innerHTML = '<span class="btn-icon">✓</span>Загружено!';
            btn.style.background = 'linear-gradient(135deg, #34d399, #06b6d4)';
            
            console.log(`Скачивание: ${fileName}`);
            showNotification(`Загружаем: ${fileName}`, 'success');
            
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

    document.querySelectorAll('.card, .section-card, .article-card, .file-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    document.querySelectorAll('.list-content li').forEach((li, index) => {
        li.style.opacity = '0';
        li.style.transform = 'translateX(-20px)';
        li.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(li);
    });
}

// ===========================
// ИНТЕРАКТИВНЫЕ ЭЛЕМЕНТЫ (ИСПРАВЛЕН БАГ С ВИДЕО)
// ===========================

function initInteractiveElements() {
    const cards = document.querySelectorAll('.card, .section-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    const mediaItems = document.querySelectorAll('.media-item');
    
    mediaItems.forEach(item => {
        const mediaWrapper = item.querySelector('.media-image-wrapper');
        
        if (mediaWrapper) {
            const clickHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const imgElement = item.querySelector('img');
                const videoSource = item.querySelector('video source');
                
                if (imgElement) {
                    openMediaViewer(imgElement.src, 'image');
                } else if (videoSource) {
                    openMediaViewer(videoSource.src, 'video');
                }
            };
            
            mediaWrapper.addEventListener('click', clickHandler);
            mediaWrapper.style.cursor = 'pointer';
        }
    });

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
// ПРОСМОТРЩИК МЕДИА (ИСПРАВЛЕН ДЛЯ ВИДЕО И АДАПТИВНОСТИ)
// ===========================

function openMediaViewer(src, type = 'image') {
    const existingViewer = document.querySelector('.media-viewer');
    if (existingViewer) {
        existingViewer.remove();
    }

    const viewer = document.createElement('div');
    viewer.className = 'media-viewer';
    
    let mediaElement;
    if (type === 'image') {
        mediaElement = document.createElement('img');
        mediaElement.src = src;
    } else if (type === 'video') {
        mediaElement = document.createElement('video');
        mediaElement.src = src;
        mediaElement.controls = true;
        mediaElement.autoplay = true; // Видео будет сразу проигрываться
    }
    
    Object.assign(viewer.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '9999',
        backdropFilter: 'blur(5px)',
        animation: 'fadeIn 0.3s ease',
        cursor: type === 'image' ? 'pointer' : 'default', // Для видео курсор обычный, чтобы кликать на паузу
        padding: '20px'
    });

    viewer.appendChild(mediaElement);
    document.body.appendChild(viewer);

    // Предотвращаем закрытие вьювера при клике на само видео (на кнопки плеера)
    if (type === 'video') {
        mediaElement.addEventListener('click', (e) => e.stopPropagation());
    }

    const closeViewer = () => {
        viewer.style.animation = 'fadeOut 0.3s ease';
        if (type === 'video') {
            mediaElement.pause(); // Останавливаем видео при закрытии
        }
        setTimeout(() => {
            if (viewer.parentNode) {
                viewer.remove();
            }
        }, 300);
    };

    viewer.addEventListener('click', closeViewer);

    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            closeViewer();
            document.removeEventListener('keydown', handleEsc);
        }
    };

    document.addEventListener('keydown', handleEsc);
    viewer.addEventListener('touchstart', (e) => {
        if (e.target === viewer) e.preventDefault(); // Запрещаем скролл под окном
    });
}

// ===========================
// АНИМАЦИИ КНОПОК
// ===========================

function initButtonAnimations() {
    const buttons = document.querySelectorAll('button, .download-btn, .social-icon');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
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

const headerTitle = document.querySelector('.header-title');
if (headerTitle) {
    window.addEventListener('load', () => {
        headerTitle.style.animation = 'glow 3s ease-in-out infinite';
    });
}

function observeNewElements() {
    const targetConfig = { attributes: true, childList: true, subtree: true };
    
    const callback = (mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                initScrollAnimations();
                initInteractiveElements();
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(document.main || document.body, targetConfig);
}

observeNewElements();

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
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
        to { transform: scale(4); opacity: 0; }
    }
    .media-viewer img, .media-viewer video {
        animation: zoomIn 0.3s ease;
    }
    @keyframes zoomIn {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
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

console.log('✨ Сайт загружен с интерактивными эффектами!');

setTimeout(() => {
    showNotification('👋 Добро пожаловать на мой сайт!', 'info');
}, 500);
