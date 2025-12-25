/**
 * FLIPS ID Visual Effects
 * Handles scroll animations, 3D tilt effects, and interactive elements.
 */

window.initScrollReveal = initScrollReveal;
window.initTiltEffect = initTiltEffect;

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initTiltEffect();
    initHeroParallax();
});

// --- 1. Scroll Reveal Animation ---
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

// --- 2. 3D Tilt Effect on Cards ---
function initTiltEffect() {
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
    });
}

function handleTilt(e) {
    const card = this;
    const cardRect = card.getBoundingClientRect();

    // Calculate mouse position relative to card center
    const x = e.clientX - cardRect.left;
    const y = e.clientY - cardRect.top;

    const centerX = cardRect.width / 2;
    const centerY = cardRect.height / 2;

    // Calculate rotation (max 15 degrees)
    const rotateX = ((y - centerY) / centerY) * -15; // Increased tilt
    const rotateY = ((x - centerX) / centerX) * 15;

    // Apply transform with stronger scale
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;

    // Dynamic Glare Effect
    // Calculate angle for dynamic gradient
    const angle = Math.atan2(e.clientY - cardRect.top - centerY, e.clientX - cardRect.left - centerX) * (180 / Math.PI) - 90;

    // Apply glare if it exists or create one
    let glare = card.querySelector('.glare-effect');
    if (!glare) {
        glare = document.createElement('div');
        glare.className = 'glare-effect';
        glare.style.cssText = `
            position: absolute;
            inset: 0;
            background: linear-gradient(${angle}deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 80%);
            z-index: 2;
            pointer-events: none;
            border-radius: inherit;
        `;
        card.appendChild(glare);
    } else {
        glare.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 80%)`;
    }

    const content = card.querySelector('.tilt-content');
    if (content) {
        content.style.transform = 'translateZ(40px)'; // Increased depth
    }
}

function resetTilt() {
    this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';

    const content = this.querySelector('.tilt-content');
    if (content) {
        content.style.transform = 'translateZ(0px)';
    }

    const glare = this.querySelector('.glare-effect');
    if (glare) {
        glare.style.opacity = '0';
        setTimeout(() => glare.remove(), 300);
    }
}

// --- 3. Hero Parallax (Mouse movement) ---
function initHeroParallax() {
    const heroSection = document.querySelector('.hero-animated-bg');
    if (!heroSection) return;

    const blobs = heroSection.querySelectorAll('.hero-blob');

    heroSection.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        blobs.forEach((blob, index) => {
            const speed = (index + 1) * 20; // Different speeds
            const xOffset = (x - 0.5) * speed;
            const yOffset = (y - 0.5) * speed;

            blob.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });
}
