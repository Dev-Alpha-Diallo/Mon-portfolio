// Menu mobile et navigation
const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');

menuButton?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navItems.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

// Smooth scroll déjà géré par CSS, mais on garde un fallback JS pour les ancres
navItems.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (targetId?.startsWith('#')) {
      event.preventDefault();
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// Animation d'apparition par Intersection Observer
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px',
  }
);

document.querySelectorAll('.fade-in').forEach((section) => observer.observe(section));

// Mise à jour du lien actif dans la navigation
const sections = document.querySelectorAll('main section[id]');

window.addEventListener('scroll', () => {
  const scrollPosition = window.scrollY + 120;
  let activeId = '';

  sections.forEach((section) => {
    const top = section.offsetTop;
    if (scrollPosition >= top) {
      activeId = section.id;
    }
  });

  navItems.forEach((link) => {
    if (link.getAttribute('href') === `#${activeId}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});
