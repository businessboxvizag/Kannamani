// =============================================
// KANNAMANI CONSULTANTS PRIVATE LIMITED
// Main JavaScript
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // --- LOADER (only on first visit of the session) ---
  const loader = document.getElementById('loader');
  if (loader) {
    let seen = false;
    try { seen = sessionStorage.getItem('kc_seen'); } catch (e) {}
    if (seen) {
      loader.classList.add('hidden');
    } else {
      try { sessionStorage.setItem('kc_seen', '1'); } catch (e) {}
      setTimeout(() => loader.classList.add('hidden'), 1600);
    }
  }

  // --- PLANE rides along the header's bottom line, driven by scroll ---
  const plane = document.querySelector('.plane-icon');
  const navBar = document.querySelector('.navbar');
  if (plane && navBar) {
    document.body.appendChild(plane);   // lift out of hero so it sits above all elements
    let ticking = false;
    const update = () => {
      const max = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      const p = Math.min(Math.max(window.scrollY / max, 0), 1);
      const x = -15 + p * 130;                 // -15vw (off left) -> 115vw (off right)
      // sit centred on the header's lower edge (the line)
      const line = navBar.getBoundingClientRect().bottom;
      plane.style.top = (line - plane.offsetHeight / 2) + 'px';
      plane.style.transform = `translateX(${x}vw) rotate(18deg)`;
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

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

  // --- CONTACT / APPLICATION FORM (emails to kannamanihrconsultants@gmail.com) ---
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.submit-btn');
      const orig = btn.innerHTML;
      btn.innerHTML = 'Sending…';
      btn.disabled = true;
      const data = Object.fromEntries(new FormData(form).entries());
      data._subject = 'New Job Application — Kannamani Consultants Website';
      data._template = 'table';
      fetch('https://formsubmit.co/ajax/kannamanihrconsultants@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(r => r.json()).then(() => {
        btn.innerHTML = 'Application Received';
        btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
        setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.disabled = false; form.reset(); }, 3500);
      }).catch(() => {
        btn.innerHTML = 'Please Try Again';
        btn.disabled = false;
        setTimeout(() => { btn.innerHTML = orig; }, 3000);
      });
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

  // --- REVIEWS (submit + show on site) ---
  const reviewOpen = document.getElementById('open-review');
  const reviewOverlay = document.getElementById('review-modal');
  if (reviewOpen && reviewOverlay) {
    const reviewForm = document.getElementById('review-form');
    const grid = document.getElementById('reviews-live');
    const starWrap = reviewOverlay.querySelector('.star-input');
    const stars = starWrap ? starWrap.querySelectorAll('span') : [];
    let rating = 5;
    const paint = () => stars.forEach((s, i) => s.classList.toggle('on', i < rating));
    stars.forEach((s, i) => s.addEventListener('click', () => { rating = i + 1; paint(); }));
    paint();
    const esc = s => (s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const load = () => { try { return JSON.parse(localStorage.getItem('kc_reviews') || '[]'); } catch (e) { return []; } };
    const render = () => {
      if (!grid) return;
      const items = load();
      grid.style.display = items.length ? '' : 'none';
      grid.innerHTML = items.map(r => `
        <div class="testi-card">
          <div class="testi-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
          <p class="testi-text">${esc(r.text)}</p>
          <div class="testi-author">
            <div class="testi-avatar" style="background:linear-gradient(135deg,#1B8A3E,#22A84E);">${esc((r.name || '?').slice(0, 2).toUpperCase())}</div>
            <div><div class="testi-name">${esc(r.name)}</div><div class="testi-origin">${esc(r.place || '')}</div></div>
          </div>
        </div>`).join('');
    };
    render();
    const close = () => reviewOverlay.classList.remove('open');
    reviewOpen.addEventListener('click', () => reviewOverlay.classList.add('open'));
    reviewOverlay.addEventListener('click', e => { if (e.target === reviewOverlay) close(); });
    const closeBtn = reviewOverlay.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (reviewForm) {
      reviewForm.addEventListener('submit', e => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(reviewForm).entries());
        const items = load();
        items.unshift({ name: d.name, place: d.place, text: d.message, rating: rating });
        try { localStorage.setItem('kc_reviews', JSON.stringify(items.slice(0, 30))); } catch (e) {}
        render();
        fetch('https://formsubmit.co/ajax/kannamanihrconsultants@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ _subject: 'New Website Review — Kannamani', Name: d.name, Location: d.place, Rating: rating + '/5', Review: d.message })
        }).catch(() => {});
        reviewForm.reset(); rating = 5; paint();
        const thanks = reviewOverlay.querySelector('.review-thanks');
        if (thanks) { thanks.style.display = 'block'; setTimeout(() => { thanks.style.display = 'none'; close(); }, 1800); }
      });
    }
  }

});
