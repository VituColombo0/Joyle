/**
 * JOYLE DEEP TECH — Scroll-Reveal Animations (IntersectionObserver)
 *
 * Elements with class `.reveal-on-scroll` are invisible initially.
 * When they enter the viewport, the `is-visible` class is added
 * which triggers the CSS transition.
 */

// Exclude the hero content — it's triggered manually via setTimeout below
const revealItems = document.querySelectorAll('.reveal-on-scroll:not(.hero__content)');

if (revealItems.length) {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',  // Trigger 80px before element fully enters viewport
        threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    revealItems.forEach((el) => observer.observe(el));
}

// ── Hero entrance: trigger immediately on page load ──────────────────────
const heroContent = document.querySelector('.hero__content.reveal-on-scroll');
if (heroContent) {
    // Small delay so the page is painted first
    setTimeout(() => {
        heroContent.classList.add('is-visible');
    }, 200);
}

