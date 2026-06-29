// 1. Плавная прокрутка для меню навигации
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 20,
                behavior: 'smooth'
            });
        }
    });
});

// 2. Анимация плавного появления элементов при скролле вниз
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target); // Анимируем только один раз
        }
    });
}, { threshold: 0.1 });

// Находим все карточки, чтобы добавить к ним анимацию выезда
document.querySelectorAll('.card').forEach((element) => {
    element.classList.add('hidden'); // Изначально скрываем
    observer.observe(element); // Начинаем слежку
});
