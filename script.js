// 1. Плавная прокрутка для меню навигации
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            window.scrollTo({
                top: targetElement.offsetTop - headerHeight - 20,
                behavior: 'smooth'
            });
        }
    });
});

// 2. Анимация плавного появления элементов при скролле вниз
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.remove('hidden');
            entry.target.classList.add('show');
            observer.unobserve(entry.target); // Анимируем только один раз
        }
    });
}, observerOptions);

// Находим все элементы для анимации (карточки, списки, блоки документов)
document.querySelectorAll('.card, .list-box, .doc-item, .media-item').forEach((element) => {
    element.classList.add('hidden'); // Изначально скрываем
    observer.observe(element); // Начинаем слежку
});

// 3. Подсветка активного пункта меню при скролле
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const headerHeight = document.querySelector('header').offsetHeight;
        if (scrollY >= sectionTop - headerHeight - 50) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// 4. Добавляем стили для активного пункта меню
const style = document.createElement('style');
style.textContent = `
    nav a.active {
        background-color: rgba(56, 189, 248, 0.2);
        color: #38bdf8;
    }
`;
document.head.appendChild(style);
