/* =====================================================
   MUSE — main.js
   Vanilla JS only: starfield generation, mobile nav,
   scroll-reveal animations, footer year.
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------
     1. Generate a scattered field of tiny twinkling stars
     -------------------------------------------------- */
  const starsLayer = document.getElementById('starsLayer');
  if (starsLayer) {
    const STAR_COUNT = 90;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < STAR_COUNT; i++) {
      const star = document.createElement('span');
      star.className = 'star';

      // randomize size, position, and animation timing so stars feel organic
      const size = Math.random() * 2 + 1; // 1px - 3px
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 4}s`;
      star.style.animationDuration = `${3 + Math.random() * 4}s`;

      fragment.appendChild(star);
    }

    starsLayer.appendChild(fragment);
  }

  /* -----------------------------------------------------
     2. Mobile navigation toggle
     -------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // close the menu once a link is chosen
    navLinks.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* -----------------------------------------------------
     3. Sticky navbar subtle style shift on scroll
     -------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        navbar.style.top = '10px';
      } else {
        navbar.style.top = '18px';
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /* -----------------------------------------------------
     4. Fade-in-on-scroll reveal using IntersectionObserver
     -------------------------------------------------- */
  const fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    fadeEls.forEach((el) => observer.observe(el));
  } else {
    // fallback: just show everything if IO isn't supported
    fadeEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* -----------------------------------------------------
     5. Footer year
     -------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});