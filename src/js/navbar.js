/**
 * JOYLE DEEP TECH — Navbar Scroll & Mobile Menu
 */

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const allLinks = navLinks ? navLinks.querySelectorAll('a') : [];

// ── Scroll: add glass effect when page is scrolled ──────────────────────
if (navbar) {
    const SCROLL_THRESHOLD = 40;

    const onScroll = () => {
        if (window.scrollY > SCROLL_THRESHOLD) {
            navbar.classList.add('is-scrolled');
        } else {
            navbar.classList.remove('is-scrolled');
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Run on load in case page is already scrolled
}

// ── Mobile hamburger menu ────────────────────────────────────────────────
if (hamburger && navLinks) {
    const openMenu = () => {
        hamburger.classList.add('is-open');
        navLinks.classList.add('is-open');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        hamburger.classList.remove('is-open');
        navLinks.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.contains('is-open');
        isOpen ? closeMenu() : openMenu();
    });

    // Close on nav link click
    allLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (
            navLinks.classList.contains('is-open') &&
            !navLinks.contains(e.target) &&
            !hamburger.contains(e.target)
        ) {
            closeMenu();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
            closeMenu();
            hamburger.focus();
        }
    });
}

// ── Active link on scroll (highlight current section) ───────────────────
const sections = document.querySelectorAll('section[id], .hero[id]');
if (sections.length && allLinks.length) {
    const observerOpts = {
        root: null,
        rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue('--navbar-height').trim() || '72px'} 0px -60% 0px`,
        threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                allLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    const isActive = href === `#${id}` && !link.classList.contains('navbar__link--cta');
                    link.classList.toggle('is-active', isActive);
                });
            }
        });
    }, observerOpts);

    sections.forEach(s => observer.observe(s));
}
