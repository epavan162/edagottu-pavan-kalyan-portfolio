/* =========================================
   PAVAN KALYAN — PORTFOLIO JS
   ========================================= */

// ── Enable theme transitions after first paint ──
// This prevents the light→dark flash. The inline <head> script already
// set data-theme synchronously. We add 'theme-ready' after a micro-delay
// so CSS transitions only activate after the initial paint is complete.
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.documentElement.classList.add('theme-ready');
  });
});

// ── Mouse Glow (desktop only) ──
const mouseGlow = document.getElementById('mouseGlow');
if (mouseGlow && window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', e => {
    mouseGlow.style.left = e.clientX + 'px';
    mouseGlow.style.top  = e.clientY + 'px';
  }, { passive: true });
  document.addEventListener('mouseleave', () => { mouseGlow.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { mouseGlow.style.opacity = '1'; });
}

// ── Navbar scroll ──
const navbar = document.getElementById('navbar');
function getNavH() { return navbar ? Math.ceil(navbar.getBoundingClientRect().height) : 0; }
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ── Mobile Menu ──
const menuToggle = document.getElementById('menuToggle');
const navLinks   = document.getElementById('navLinks');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
}
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (navLinks && navLinks.classList.contains('active')) {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('active');
  }
});

// ── Active nav on scroll ──
const sections = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav-links a');
function updateActiveLink() {
  let current = '';
  const scrollPos = window.pageYOffset;
  const navH = getNavH();
  sections.forEach(s => {
    if (scrollPos >= s.offsetTop - navH - 10) current = s.getAttribute('id');
  });
  navItems.forEach(item => {
    item.classList.remove('active');
    const href = item.getAttribute('href') || '';
    if (href.startsWith('#') && href.slice(1) === current) item.classList.add('active');
  });
}
window.addEventListener('scroll', updateActiveLink, { passive: true });
window.addEventListener('load',   updateActiveLink);

// ── Smooth Scroll ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - getNavH(), behavior: 'smooth' });
    if (navLinks && navLinks.classList.contains('active')) {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });
});

// ── Reveal on Scroll ──
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const siblings = Array.from(el.parentElement.querySelectorAll('.reveal'));
      const idx = siblings.indexOf(el);
      el.style.transitionDelay = `${idx * 0.07}s`;
      el.classList.add('visible');
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Hero Role Cycler ──
const roles = document.querySelectorAll('.role');
let roleIdx = 0;
if (roles.length > 1) {
  setInterval(() => {
    roles[roleIdx].classList.remove('active');
    roleIdx = (roleIdx + 1) % roles.length;
    roles[roleIdx].classList.add('active');
  }, 2800);
}

// ── Counter Animation ──
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const start  = performance.now();
  const dur    = 1800;
  (function update(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
    if (p < 1) requestAnimationFrame(update);
    else el.textContent = target;
  })(start);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

// ── Hero BG text parallax ──
const heroBgText = document.querySelector('.hero-bg-text');
if (heroBgText) {
  window.addEventListener('scroll', () => {
    const s = window.pageYOffset;
    if (s < window.innerHeight) {
      heroBgText.style.transform = `translate(-50%, calc(-50% + ${s * 0.18}px))`;
    }
  }, { passive: true });
}

// ── Grid mouse parallax ──
const gridBg = document.querySelector('.grid-bg');
if (gridBg) {
  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 14;
    const y = (e.clientY / window.innerHeight - 0.5) * 14;
    gridBg.style.transform = `translate(${x}px, ${y}px)`;
  }, { passive: true });
}

// ── Theme Toggle Logic ──
const themeToggle = document.getElementById('themeToggle');
// Theme is already applied by the inline <head> script — no flash.
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

// ── Email Copy Fallback & Toast Notification ──
document.querySelectorAll('a[href^="mailto:"]').forEach(emailLink => {
  emailLink.addEventListener('click', function(e) {
    const email = 'epavan162@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast('Email copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy email: ', err);
    });
  });
});

function showToast(message) {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fas fa-check-circle" style="color: var(--accent); margin-right: 8px;"></i> ${message}`;
  toast.className = 'toast-show';
  
  if (window.toastTimeout) clearTimeout(window.toastTimeout);
  window.toastTimeout = setTimeout(() => {
    toast.className = '';
  }, 3000);
}

