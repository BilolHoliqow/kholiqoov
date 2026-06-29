// script.js — Мобильная + Крутая версия

document.addEventListener('DOMContentLoaded', () => {

    // 1. Плавная прокрутка
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 2. GSAP анимации
    if (typeof gsap !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        // Анимация карточек
        gsap.from(".card, .list-box", {
            scrollTrigger: { trigger: ".card, .list-box", start: "top 85%" },
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out"
        });

        // Большой заголовок hi Dude
        gsap.from(".big-title", {
            duration: 1.2,
            y: 50,
            opacity: 0,
            ease: "power4.out"
        });
    }

    // 3. Hamburger Menu (ОЧЕНЬ ВАЖНО для телефона!)
    function createMobileMenu() {
        const header = document.querySelector('header');
        const nav = document.querySelector('nav');
        
        const hamburger = document.createElement('div');
        hamburger.className = 'hamburger';
        hamburger.innerHTML = '☰';
        hamburger.style.cssText = `
            display: none; font-size: 28px; cursor: pointer; color: #00f5ff;
            position: absolute; top: 20px; right: 20px; z-index: 1000;
        `;
        
        header.appendChild(hamburger);

        let isOpen = false;

        hamburger.addEventListener('click', () => {
            isOpen = !isOpen;
            hamburger.textContent = isOpen ? '✕' : '☰';
            nav.style.display = isOpen ? 'flex' : 'none';
            nav.style.flexDirection = 'column';
            nav.style.gap = '15px';
            nav.style.marginTop = '20px';
        });

        // Прячем hamburger только на больших экранах
        function checkScreen() {
            if (window.innerWidth <= 768) {
                hamburger.style.display = 'block';
                nav.style.display = 'none';
            } else {
                hamburger.style.display = 'none';
                nav.style.display = 'block';
            }
        }

        window.addEventListener('resize', checkScreen);
        checkScreen();
    }

    createMobileMenu();

    // 4. Кнопка "Наверх"
    function addBackToTop() {
        const btn = document.createElement('button');
        btn.innerHTML = '↑';
        btn.style.cssText = `
            position: fixed; bottom: 30px; right: 30px; 
            width: 50px; height: 50px; border-radius: 50%;
            background: rgba(0, 245, 255, 0.9); color: black;
            font-size: 24px; border: none; cursor: pointer;
            display: none; z-index: 999; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(btn);

        window.addEventListener('scroll', () => {
            btn.style.display = window.scrollY > 500 ? 'block' : 'none';
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    addBackToTop();

    // 5. Активная ссылка в меню при скролле
    function activeNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (scrollY >= sectionTop - 150) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    activeNavLink();

    // 6. Лёгкий эффект на touch (для мобильных)
    document.querySelectorAll('.card, .media-item, .doc-item').forEach(el => {
        el.addEventListener('touchstart', () => {
            el.style.transform = 'scale(0.97)';
        });
        el.addEventListener('touchend', () => {
            el.style.transform = 'scale(1)';
        });
    });
});
