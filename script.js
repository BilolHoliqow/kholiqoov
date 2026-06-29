// script.js — Улучшенная версия

// 1. Плавная прокрутка для навигации
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// 2. Подключаем GSAP (если ещё не подключен)
if (typeof gsap === "undefined") {
    const gsapScript = document.createElement('script');
    gsapScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
    document.head.appendChild(gsapScript);

    gsapScript.onload = () => {
        const scrollScript = document.createElement('script');
        scrollScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js";
        document.head.appendChild(scrollScript);
        
        scrollScript.onload = initAnimations;
    };
} else {
    initAnimations();
}

// Основные анимации
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Анимация появления карточек
    gsap.from(".card, .list-box", {
        scrollTrigger: {
            trigger: ".card, .list-box",
            start: "top 85%",
        },
        y: 80,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out"
    });

    // Анимация фото профиля
    gsap.from(".profile-img", {
        duration: 1.4,
        scale: 0.5,
        rotation: -20,
        ease: "back.out(1.7)",
        delay: 0.3
    });

    // Hover-эффект для медиа
    document.querySelectorAll('.media-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, { scale: 1.05, duration: 0.4, ease: "power2.out" });
        });
        item.addEventListener('mouseleave', () => {
            gsap.to(item, { scale: 1, duration: 0.4, ease: "power2.out" });
        });
    });

    // Анимация документов
    document.querySelectorAll('.doc-item').forEach((item, i) => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                y: -12,
                boxShadow: "0 20px 40px rgba(0, 245, 255, 0.3)",
                duration: 0.4
            });
        });
        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                y: 0,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
                duration: 0.4
            });
        });
    });

    // Пульсация социальных иконок
    gsap.to(".social-icon", {
        scale: 1.15,
        duration: 2,
        stagger: 0.3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });
}

// 3. Дополнительные эффекты при скролле
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(17, 22, 34, 0.98)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'linear-gradient(135deg, #1b2230, #111622)';
    }
});
