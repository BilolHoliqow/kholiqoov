// 1. Плавная прокрутка для меню навигации
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
       
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 30, // Небольшой отступ сверху
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
// Находим все карточки и медиа, чтобы добавить к ним анимацию
document.querySelectorAll('.card, .media-item, .list-box').forEach((element) => {
    element.classList.add('hidden'); // Скрываем их до прокрутки
    observer.observe(element);
});
