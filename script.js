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

// Visionneuse des captures de projet (galerie interface / modélisation)
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

let galleryImages = [];
let galleryIndex = 0;
let lastFocusedThumb = null;

function openLightbox(images, index, triggerEl) {
  galleryImages = images;
  galleryIndex = index;
  lastFocusedThumb = triggerEl;
  showLightboxImage();
  lightbox.hidden = false;
  lightboxClose.focus();
}

function showLightboxImage() {
  const current = galleryImages[galleryIndex];
  lightboxImage.src = current.full;
  lightboxImage.alt = current.caption;
  lightboxCaption.textContent = `${current.caption} (${galleryIndex + 1}/${galleryImages.length})`;
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = '';
  lastFocusedThumb?.focus();
}

document.querySelectorAll('.project-card').forEach((card) => {
  const thumbs = [...card.querySelectorAll('.gallery-thumb')];
  const images = thumbs.map((thumb) => ({
    full: thumb.dataset.full,
    caption: thumb.dataset.caption,
  }));

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => openLightbox(images, index, thumb));
  });
});

lightboxClose?.addEventListener('click', closeLightbox);

lightboxPrev?.addEventListener('click', () => {
  galleryIndex = (galleryIndex - 1 + galleryImages.length) % galleryImages.length;
  showLightboxImage();
});

lightboxNext?.addEventListener('click', () => {
  galleryIndex = (galleryIndex + 1) % galleryImages.length;
  showLightboxImage();
});

lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener('keydown', (event) => {
  if (lightbox?.hidden) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') lightboxPrev?.click();
  if (event.key === 'ArrowRight') lightboxNext?.click();
});
