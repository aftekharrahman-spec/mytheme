/**
 * ZadaVibe Luxury Motion & Smooth Scroll Engine
 * High-performance, zero-dependency, 60fps animations
 * Senior Engineer Architectural Implementation
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initParallax();
    initAnimatedCounters();
    initCardTilt();
    initSmoothAccordion();
  });

  /* 1. Scroll-Triggered Reveal Animations */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(
      '.zv-hero-grid, .zv-ugc-card, .zv-callout-card, .zv-benefit-item, .zv-stat-card, .zv-dark-card, .zv-feed-item, .zv-card, .zv-comparison-wrapper, .zv-faq-item, .zv-gallery-sticky, .zv-product-info'
    );

    if (!revealElements.length) return;

    const observerOptions = {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Staggered reveal effect
          setTimeout(() => {
            entry.target.classList.add('zv-revealed');
          }, (index % 4) * 80);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => {
      el.classList.add('zv-reveal-init');
      revealObserver.observe(el);
    });
  }

  /* 2. Smooth Subtle Parallax on Scroll */
  function initParallax() {
    const parallaxImages = document.querySelectorAll(
      '.zv-hero-image-card img, .zv-benefits-photo img, .zv-stats-photo img, .zv-collection-banner'
    );

    if (!parallaxImages.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.pageYOffset;

          parallaxImages.forEach((img) => {
            const rect = img.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
              const speed = 0.06;
              const yOffset = (rect.top - window.innerHeight / 2) * speed;
              img.style.transform = `translate3d(0, ${yOffset}px, 0) scale(1.02)`;
            }
          });

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* 3. Stat Numbers Count-Up Animation */
  function initAnimatedCounters() {
    const statCards = document.querySelectorAll('.zv-stat-card');
    if (!statCards.length) return;

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const numEl = entry.target.querySelector('.zv-stat-number');
          if (numEl && !numEl.dataset.counted) {
            numEl.dataset.counted = 'true';
            animateNumber(numEl);
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statCards.forEach((card) => counterObserver.observe(card));
  }

  function animateNumber(element) {
    const rawText = element.textContent.trim();
    const targetMatch = rawText.match(/(\d+[\.,]?\d*)/);
    if (!targetMatch) return;

    const fullTarget = parseFloat(targetMatch[0].replace(',', ''));
    const suffix = rawText.replace(targetMatch[0], '');
    const duration = 1400;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeProgress * fullTarget);

      if (rawText.includes('.')) {
        element.textContent = (easeProgress * fullTarget).toFixed(1) + suffix;
      } else {
        element.textContent = currentVal.toLocaleString() + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = rawText;
      }
    }

    requestAnimationFrame(update);
  }

  /* 4. Interactive 3D Card Tilt for Desktop */
  function initCardTilt() {
    if (window.innerWidth < 1024) return;

    const cards = document.querySelectorAll('.zv-callout-card, .zv-bundle-card, .zv-card');

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  /* 5. Fluid Accordion Collapse / Expand */
  function initSmoothAccordion() {
    const detailsList = document.querySelectorAll('.zv-faq-item details');

    detailsList.forEach((detail) => {
      const summary = detail.querySelector('summary');
      const answer = detail.querySelector('.zv-faq-answer');

      if (!summary || !answer) return;

      summary.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = detail.hasAttribute('open');

        if (isOpen) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
          requestAnimationFrame(() => {
            answer.style.maxHeight = '0px';
            answer.style.opacity = '0';
          });
          setTimeout(() => {
            detail.removeAttribute('open');
          }, 260);
        } else {
          detail.setAttribute('open', '');
          answer.style.maxHeight = '0px';
          answer.style.opacity = '0';
          requestAnimationFrame(() => {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            answer.style.opacity = '1';
          });
        }
      });
    });
  }
})();
