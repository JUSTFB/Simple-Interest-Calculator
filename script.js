/* ============================================
   DOM References
   ============================================ */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const DOM = {
    header: $('header'),
    form: $('#recommendationForm'),
    grid: $('#recommendationsGrid'),
    popup: $('#popup'),
    popupClose: $('#popupClose'),
    inputName: $('#inputName'),
    inputProfession: $('#inputProfession'),
    inputRecommendation: $('#inputRecommendation'),
    progressBars: $$('.progress-fill')
};

/* ============================================
   Smooth Scrolling
   ============================================ */

function setupSmoothScrolling() {
    $$('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = link.getAttribute('href');

            if (id === '#top') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const target = $(id);
            if (target) {
                const headerHeight = DOM.header.offsetHeight;
                const position = target.offsetTop - headerHeight;
                window.scrollTo({ top: position, behavior: 'smooth' });
            }
        });
    });
}

/* ============================================
   Header Shadow on Scroll
   ============================================ */

function setupHeaderScroll() {
    window.addEventListener('scroll', () => {
        DOM.header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
}

/* ============================================
   Progress Bar Animation
   ============================================ */

function animateProgressBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.progress-fill');
                bars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width + '%';
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const skillsSection = $('#skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
}

/* ============================================
   Scroll Animations
   ============================================ */

function setupScrollAnimations() {
    const elements = $$('.skill, .project-card, .recommendation');

    elements.forEach(el => el.classList.add('fade-in'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => observer.observe(el));
}

/* ============================================
   Popup
   ============================================ */

function showPopup() {
    if (!DOM.popup) return;
    DOM.popup.classList.add('active');
}

function hidePopup() {
    if (!DOM.popup) return;
    DOM.popup.classList.remove('active');
}

/* ============================================
   Recommendation Form
   ============================================ */

function addRecommendation(e) {
    e.preventDefault();

    const name = DOM.inputName.value.trim();
    const profession = DOM.inputProfession.value.trim();
    const message = DOM.inputRecommendation.value.trim();

    /* Validation: name and recommendation are required */
    if (name === '' || message === '') {
        alert('Please fill in both Name and Recommendation fields.');
        return;
    }

    /* Build new recommendation card */
    const card = document.createElement('div');
    card.className = 'recommendation fade-in visible';

    const text = document.createElement('p');
    text.className = 'recommendation-text';
    text.textContent = `"${message}"`;

    const author = document.createElement('div');
    author.className = 'recommendation-author';

    const authorName = document.createElement('strong');
    authorName.textContent = name;

    const authorRole = document.createElement('span');
    authorRole.textContent = profession || 'Community Member';

    author.appendChild(authorName);
    author.appendChild(authorRole);
    card.appendChild(text);
    card.appendChild(author);

    /* Append to grid */
    DOM.grid.appendChild(card);

    /* Clear form */
    DOM.form.reset();

    /* Show success popup ONLY after successful submission */
    showPopup();
}

/* ============================================
   Initialize
   ============================================ */

function init() {
    setupSmoothScrolling();
    setupHeaderScroll();
    animateProgressBars();
    setupScrollAnimations();

    if (DOM.form) {
        DOM.form.addEventListener('submit', addRecommendation);
    }

    if (DOM.popupClose) {
        DOM.popupClose.addEventListener('click', hidePopup);
    }

    /* Close popup on overlay click */
    if (DOM.popup) {
        DOM.popup.addEventListener('click', (e) => {
            if (e.target === DOM.popup) hidePopup();
        });
    }
}

document.addEventListener('DOMContentLoaded', init);
