/* =========================================
   PAVAN KALYAN — PORTFOLIO JS
   ========================================= */

// ── Custom Cursor ──
const cursor        = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

if (cursor && cursorFollower) {
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });
  (function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  })();

  const hoverables = 'a, button, .skill-chip, .sg-chips span, .project-card, .ach-card, .exp-card';
  document.querySelectorAll(hoverables).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width  = '18px';
      cursor.style.height = '18px';
      cursorFollower.style.width  = '48px';
      cursorFollower.style.height = '48px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width  = '10px';
      cursor.style.height = '10px';
      cursorFollower.style.width  = '36px';
      cursorFollower.style.height = '36px';
    });
  });
  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; cursorFollower.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; cursorFollower.style.opacity = '1'; });
}

// ── Navbar scroll ──
const navbar = document.getElementById('navbar');
function getNavH() { return navbar ? Math.ceil(navbar.getBoundingClientRect().height) : 0; }
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

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
window.addEventListener('scroll', updateActiveLink);
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
new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); }
  });
}, { threshold: 0.5 }).observe;

// Fix: proper observer assignment
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
  });
}

// ── Grid mouse parallax ──
const gridBg = document.querySelector('.grid-bg');
if (gridBg) {
  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 14;
    const y = (e.clientY / window.innerHeight - 0.5) * 14;
    gridBg.style.transform = `translate(${x}px, ${y}px)`;
  });
}

// ── Blinking cursor in code snippet ──
const codeEl = document.querySelector('.code-body code');
if (codeEl) {
  const blink = document.createElement('span');
  blink.style.cssText = 'display:inline-block;width:2px;height:0.9em;background:var(--accent);margin-left:2px;vertical-align:middle;animation:blink 1s step-end infinite;';
  const style = document.createElement('style');
  style.textContent = '@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}';
  document.head.appendChild(style);
  codeEl.appendChild(blink);
}
