// =============================================
//   THE BOYS MAGAZINE — MAIN JS
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ── LOADER ──────────────────────────────────
  const loader = document.getElementById('loader');
  const loaderFill = document.getElementById('loaderFill');
  let progress = 0;
  const loaderInterval = setInterval(() => {
    progress += Math.random() * 20;
    if (progress >= 100) {
      progress = 100;
      loaderFill.style.width = '100%';
      clearInterval(loaderInterval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.add('loaded');
        animateHeroIn();
      }, 500);
    } else {
      loaderFill.style.width = progress + '%';
    }
  }, 120);

  function animateHeroIn() {
    const els = document.querySelectorAll('.hero-eyebrow, .hero-t1, .hero-t2, .hero-sub, .hero-cta');
    els.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.8s ease ${i * 0.15}s, transform 0.8s ease ${i * 0.15}s`;
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 50);
    });
  }

  // ── CUSTOM CURSOR ──────────────────────────
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animateCursor() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .article-card, .featured-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
      follower.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
      follower.classList.remove('cursor-hover');
    });
  });

  // ── NAV ────────────────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Smooth scroll nav links
  document.querySelectorAll('.nav-link, .mob-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      mobileMenu.classList.remove('open');
    });
  });

  // Mobile menu
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const link = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => observer.observe(s));

  // ── SCROLL REVEAL ──────────────────────────
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  // ── BUILD ARTICLE GRID ─────────────────────
  const grid = document.getElementById('articleGrid');
  let currentFilter = 'all';

  function buildGrid(filter) {
    grid.innerHTML = '';
    const filtered = filter === 'all'
      ? ARTICLES
      : ARTICLES.filter(a => a.category === filter);

    filtered.forEach((article, i) => {
      const card = document.createElement('div');
      card.className = 'article-card reveal-item';
      card.style.animationDelay = `${i * 0.08}s`;
      card.innerHTML = `
        <div class="card-img-wrap">
          <img src="${article.image}" alt="${article.title}" loading="lazy" />
          <div class="card-overlay"></div>
          <span class="card-tag">${article.categoryLabel}</span>
        </div>
        <div class="card-body">
          <div class="card-meta">
            <span>${article.date}</span>
            <span class="card-dot">·</span>
            <span>${article.readTime}</span>
          </div>
          <h3 class="card-title">${article.title}</h3>
          <p class="card-excerpt">${article.excerpt}</p>
          <button class="card-btn" data-article="${article.id}">
            <span>Read</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
          </button>
        </div>
      `;
      grid.appendChild(card);
      setTimeout(() => revealObserver.observe(card), 50);
    });

    // Bind read buttons
    grid.querySelectorAll('.card-btn, .card-img-wrap').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.closest('[data-article]')?.dataset.article
                || btn.querySelector('[data-article]')?.dataset.article
                || btn.dataset.article;
        if (id !== undefined) openPopup(parseInt(id));
      });
    });
  }

  buildGrid('all');

  // Filter tabs
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      grid.style.opacity = '0';
      grid.style.transform = 'translateY(10px)';
      setTimeout(() => {
        buildGrid(currentFilter);
        grid.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        grid.style.opacity = '1';
        grid.style.transform = 'translateY(0)';
      }, 200);
    });
  });

  // Featured card click
  document.getElementById('featuredCard')?.addEventListener('click', () => openPopup(0));
  document.querySelector('.read-btn[data-article="0"]')?.addEventListener('click', (e) => {
    e.stopPropagation();
    openPopup(0);
  });

  // ── POPUP ──────────────────────────────────
  const overlay = document.getElementById('popupOverlay');
  const popup = document.getElementById('popup');
  const popupClose = document.getElementById('popupClose');
  const popupImg = document.getElementById('popupImg');
  const popupContent = document.getElementById('popupContent');

  function openPopup(id) {
    const article = ARTICLES[id];
    if (!article) return;

    popupImg.style.backgroundImage = `url(${article.image})`;

    popupContent.innerHTML = `
      <div class="popup-meta">
        <span class="popup-cat">${article.categoryLabel}</span>
        <span class="popup-dot">·</span>
        <span>${article.date}</span>
        <span class="popup-dot">·</span>
        <span>${article.readTime}</span>
      </div>
      <h1 class="popup-title">${article.title}</h1>
      <div class="popup-divider">
        <svg viewBox="0 0 200 6" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="3" x2="60" y2="3" stroke="#c9a96e" stroke-width="1"/>
          <polygon points="80,0 90,3 80,6" fill="#c9a96e"/>
          <polygon points="120,0 110,3 120,6" fill="#c9a96e"/>
          <line x1="140" y1="3" x2="200" y2="3" stroke="#c9a96e" stroke-width="1"/>
        </svg>
      </div>
      <div class="popup-body">${article.content}</div>
    `;

    overlay.classList.add('open');
    popup.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Reset scroll
    popup.querySelector('.popup-scroll-area').scrollTop = 0;
  }

  function closePopup() {
    overlay.classList.remove('open');
    popup.classList.remove('open');
    document.body.style.overflow = '';
  }

  popupClose.addEventListener('click', closePopup);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closePopup();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePopup();
  });

  // ── CONTACT FORM ───────────────────────────
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  contactForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    const btnText = btn.querySelector('.submit-text');
    btnText.textContent = 'Sending...';
    btn.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formStatus.className = 'form-status success';
        formStatus.textContent = '✓ Message sent! We\'ll be in touch soon.';
        contactForm.reset();
      } else {
        throw new Error('Network error');
      }
    } catch {
      formStatus.className = 'form-status error';
      formStatus.textContent = '✗ Something went wrong. Please try again.';
    }

    btnText.textContent = 'Send Message';
    btn.disabled = false;
    setTimeout(() => { formStatus.textContent = ''; formStatus.className = 'form-status'; }, 5000);
  });

  // ── HERO SCROLL PARALLAX ───────────────────
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && scrollY < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
      heroContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.7));
    }
  });

});
