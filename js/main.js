// =============================================
// KANNAMANI CONSULTANTS PRIVATE LIMITED
// Main JavaScript
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // --- LOADER ---
  const loader = document.getElementById('loader');
  if (loader) setTimeout(() => loader.classList.add('hidden'), 1400);

  // --- NAVBAR SCROLL ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    });
  }

  // --- ACTIVE NAV LINK ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- HAMBURGER ---
  const hamburger = document.querySelector('.hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      document.body.classList.toggle('nav-mobile-open');
      const spans = hamburger.querySelectorAll('span');
      if (document.body.classList.contains('nav-mobile-open')) {
        spans[0].style.transform = 'rotate(45deg) translateY(7px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        document.body.classList.remove('nav-mobile-open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  // --- SCROLL REVEAL ---
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => obs.observe(el));
  }

  // --- COUNTER ANIMATION ---
  function animateCounter(el, target, suffix = '') {
    let start = 0;
    const duration = 2000;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          animateCounter(el, parseInt(el.dataset.count), el.dataset.suffix || '');
          cObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cObs.observe(el));
  }

  // --- GALLERY FILTER ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      galleryItems.forEach(item => {
        const match = f === 'all' || item.dataset.category === f;
        item.style.transition = 'opacity 0.3s, transform 0.3s';
        if (match) {
          item.style.display = '';
          setTimeout(() => { item.style.opacity = '1'; item.style.transform = ''; }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => { item.style.display = 'none'; }, 350);
        }
      });
    });
  });

  // --- CONTACT FORM ---
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.submit-btn');
      const orig = btn.innerHTML;
      btn.innerHTML = '✅ Application Received!';
      btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3500);
    });
  }

  // --- FAQ ACCORDION ---
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    const icon = item.querySelector('.faq-icon');
    if (q) {
      q.addEventListener('click', () => {
        const open = a.style.display === 'block';
        document.querySelectorAll('.faq-a').forEach(x => x.style.display = 'none');
        document.querySelectorAll('.faq-icon').forEach(x => x.textContent = '+');
        if (!open) { a.style.display = 'block'; icon.textContent = '−'; }
      });
    }
  });

  // --- PARALLAX GLOW ---
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    document.querySelectorAll('.hero-glow').forEach(el => {
      el.style.transform = `translateY(${sy * 0.12}px)`;
    });
  });

  // --- SUBTLE CURSOR GLOW ---
  if (window.innerWidth > 768) {
    const g = document.createElement('div');
    g.style.cssText = `
      position:fixed;pointer-events:none;z-index:0;border-radius:50%;
      width:350px;height:350px;
      background:radial-gradient(circle,rgba(27,138,62,0.05) 0%,transparent 70%);
      transform:translate(-50%,-50%);transition:left 0.5s ease,top 0.5s ease;
    `;
    document.body.appendChild(g);
    document.addEventListener('mousemove', e => {
      g.style.left = e.clientX + 'px';
      g.style.top = e.clientY + 'px';
    });
  }

});
