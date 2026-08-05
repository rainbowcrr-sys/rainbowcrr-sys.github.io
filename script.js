/* ========================================
   Search Enhancer — Site JavaScript
   ======================================== */

(function () {
    'use strict';

    // ========================================
    // GitHub Star Count (live from API)
    // ========================================
    const REPO = 'rainbowcrr-sys/search-enhancer';
    const API_URL = `https://api.github.com/repos/${REPO}`;
    const STAR_COUNT_ID = 'starCount';

    async function fetchStarCount() {
        const el = document.getElementById(STAR_COUNT_ID);
        if (!el) return;

        try {
            const res = await fetch(API_URL, {
                headers: { 'Accept': 'application/vnd.github.v3+json' }
            });
            if (!res.ok) throw new Error('API error: ' + res.status);
            const data = await res.json();
            const stars = data.stargazers_count || 0;
            el.textContent = formatNumber(stars);
        } catch (err) {
            console.warn('[Search Enhancer] Failed to fetch star count:', err);
            el.textContent = '—';
        }
    }

    // Format: 1.2k, 3.4k, 12k, etc.
    function formatNumber(n) {
        if (n >= 1000) {
            return (n / 1000).toFixed(1).replace('.0', '') + 'k';
        }
        return String(n);
    }

    // Refresh every 5 minutes
    fetchStarCount();
    setInterval(fetchStarCount, 5 * 60 * 1000);

    // ========================================
    // Navbar scroll effect
    // ========================================
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const current = window.scrollY;
        if (current > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = current;
    }, { passive: true });

    // ========================================
    // Mobile nav toggle
    // ========================================
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close on link click
        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // ========================================
    // Scroll reveal animation
    // ========================================
    const revealEls = document.querySelectorAll(
        '.feature-card, .install-col, .privacy-card, .section-header, .labels-table-wrap, .cta-card'
    );

    revealEls.forEach(el => el.classList.add('reveal'));

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

        revealEls.forEach(el => observer.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('visible'));
    }

    // ========================================
    // Smooth scroll for anchor links (already handled by CSS,
    // but ensure nav doesn't cover targets)
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 70;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

})();
