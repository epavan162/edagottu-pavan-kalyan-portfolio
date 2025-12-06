

// get navbar element
const navbar = document.getElementById('navbar');

// helper to get current navbar height (rounded)
function getNavHeight() {
  return navbar ? Math.ceil(navbar.getBoundingClientRect().height) : 0;
}

/* NAVBAR scroll effect */
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

/* MOBILE MENU toggle (defensive) */
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
}

/* Close menu when clicking a nav link (keeps menu UX consistent) */
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (menuToggle && navLinks && navLinks.classList.contains('active')) {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    }
    // don't prevent default here — anchor handler below will manage scrolling
  });
});

/* Active link on scroll — uses dynamic navbar height */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

function updateActiveLink() {
  let current = '';
  const scrollPos = window.pageYOffset;
  const navHeight = getNavHeight();

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    // mark section active when we've scrolled past its top (account for navbar)
    if (scrollPos >= sectionTop - navHeight - 5) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    item.classList.remove('active');
    const href = item.getAttribute('href') || '';
    if (href.startsWith('#') && href.slice(1) === current) {
      item.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveLink);
window.addEventListener('load', updateActiveLink);

/* Smooth scroll for anchor links with dynamic navbar height,
   closes mobile menu after navigation */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    // compute current navbar height and exact scroll position
    const navHeight = getNavHeight();
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const scrollTo = targetPosition - navHeight; // no extra gap

    window.scrollTo({
      top: scrollTo,
      behavior: 'smooth'
    });

    // close mobile menu if open
    if (menuToggle && navLinks && navLinks.classList.contains('active')) {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });
});

/* Intersection Observer for reveal-on-scroll */
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target); // stop observing once revealed
    }
  });
}, observerOptions);

document.querySelectorAll('.project-card, .timeline-item, .skill-category, .contact-item, .achievement-card, .certification-card, .education-card')
  .forEach(el => revealObserver.observe(el));
