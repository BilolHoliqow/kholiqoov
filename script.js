/* =========================================================
   Портфолио — Билол Холиков
   Скрипт интерактивности сайта
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Полоса прогресса прокрутки ---------- */
    const progressBar = document.getElementById('scroll-progress');
    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (progressBar) progressBar.style.width = pct + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    /* ---------- Активная вкладка навигации при прокрутке ---------- */
    const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
    const sections = navLinks
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    function setActiveNav() {
        let currentId = null;
        const scrollPos = window.scrollY + window.innerHeight * 0.3;

        sections.forEach(section => {
            if (section.offsetTop <= scrollPos) {
                currentId = section.id;
            }
        });

        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === '#' + currentId;
            link.classList.toggle('active', isActive);
        });
    }
    window.addEventListener('scroll', setActiveNav, { passive: true });
    setActiveNav();

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.pushState(null, '', link.getAttribute('href'));
            }
        });
    });

    /* ---------- Появление элементов при прокрутке ---------- */
    const revealTargets = document.querySelectorAll(
        '.card, .media-item, .file-card, .list-box'
    );
    revealTargets.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(el => revealObserver.observe(el));

    /* ---------- Эффект "ряби" при нажатии ---------- */
    function attachRipple(el) {
        el.style.position = el.style.position || 'relative';
        el.style.overflow = 'hidden';
        el.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size = Math.max(rect.width, rect.height);
            ripple.className = 'ripple';
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 650);
        });
    }
    document.querySelectorAll('.file-download, nav a, #to-top, .social-icon')
        .forEach(attachRipple);

    /* ---------- Кнопка "наверх" ---------- */
    const toTopBtn = document.getElementById('to-top');
    if (toTopBtn) {
        window.addEventListener('scroll', () => {
            toTopBtn.classList.toggle('visible', window.scrollY > 500);
        }, { passive: true });
        toTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* =========================================================
       ЛАЙТБОКС — надёжный просмотр фото и видео
       Не использует нативный Fullscreen API (он ломался на
       некоторых телефонах), а рисует собственное окно поверх
       страницы — работает одинаково на телефоне и на ноутбуке.
       ========================================================= */

    const mediaItems = Array.from(document.querySelectorAll('.media-item[data-media]'));
    const lightbox = document.getElementById('lightbox');

    if (lightbox && mediaItems.length) {
        const lightboxContent = lightbox.querySelector('.lightbox-content');
        const captionEl = lightbox.querySelector('.lightbox-caption');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-nav.prev');
        const nextBtn = lightbox.querySelector('.lightbox-nav.next');

        let currentIndex = 0;

        function getRealSrc(mediaEl) {
            // Чинит баг, когда <source> не заполняет video.src
            if (mediaEl.tagName === 'VIDEO') {
                if (mediaEl.currentSrc) return mediaEl.currentSrc;
                const source = mediaEl.querySelector('source');
                return source ? source.getAttribute('src') : mediaEl.getAttribute('src');
            }
            return mediaEl.getAttribute('src');
        }

        function clearLightboxMedia() {
            const existing = lightboxContent.querySelector('img, video');
            if (existing) {
                if (existing.tagName === 'VIDEO') {
                    existing.pause();
                    existing.removeAttribute('src');
                    existing.load();
                }
                existing.remove();
            }
        }

        function openLightbox(index) {
            currentIndex = index;
            const item = mediaItems[currentIndex];
            const type = item.dataset.media; // "image" или "video"
            const original = item.querySelector('img, video');
            const src = getRealSrc(original);
            const desc = item.querySelector('.media-desc');

            clearLightboxMedia();

            let el;
            if (type === 'video') {
                el = document.createElement('video');
                el.setAttribute('controls', '');
                el.setAttribute('playsinline', '');
                el.setAttribute('src', src);
                el.autoplay = true;
            } else {
                el = document.createElement('img');
                el.setAttribute('src', src);
                el.setAttribute('alt', original.getAttribute('alt') || '');
            }
            lightboxContent.insertBefore(el, captionEl);

            captionEl.textContent = desc ? desc.textContent : '';
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';

            prevBtn.style.display = mediaItems.length > 1 ? 'flex' : 'none';
            nextBtn.style.display = mediaItems.length > 1 ? 'flex' : 'none';
        }

        function closeLightbox() {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
            clearLightboxMedia();
        }

        function showNext(step) {
            const newIndex = (currentIndex + step + mediaItems.length) % mediaItems.length;
            openLightbox(newIndex);
        }

        mediaItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(index);
                }
            });
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', () => showNext(-1));
        nextBtn.addEventListener('click', () => showNext(1));

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext(1);
            if (e.key === 'ArrowLeft') showNext(-1);
        });

        // Свайп для мобильных устройств
        let touchStartX = 0;
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].clientX;
        }, { passive: true });
        lightbox.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(dx) > 50) showNext(dx > 0 ? -1 : 1);
        }, { passive: true });
    }

    /* ---------- Плавное появление файловых карточек с задержкой ---------- */
    document.querySelectorAll('.file-card').forEach((card, i) => {
        card.style.transitionDelay = (i * 0.05) + 's';
    });
});
