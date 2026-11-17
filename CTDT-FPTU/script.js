/* ═══════════════════════════════════════════════
   KH-THCS — Interactive Script
   ═══════════════════════════════════════════════ */

// ── DOM Elements ──
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const progressBar = document.getElementById('progressBar');
const backToTopBtn = document.getElementById('backToTop');

// ══════════════════════════════════
// NAVBAR: Scroll effect & Mobile toggle
// ══════════════════════════════════
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Navbar compact on scroll
  if (scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Progress bar
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollY / docHeight) * 100;
  progressBar.style.width = progress + '%';

  // Back to top button
  if (scrollY > 500) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }

  // Update active nav link
  updateActiveNav();

  lastScroll = scrollY;
}, { passive: true });

// Mobile toggle
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');

  // Animate hamburger
  const spans = navToggle.querySelectorAll('span');
  navToggle.classList.toggle('active');

  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
  }
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
  });
});

// ══════════════════════════════════
// ACTIVE NAV LINK
// ══════════════════════════════════
function updateActiveNav() {
  const sections = ['overview', 'part1', 'part2', 'roadmap'];
  const navLinksAll = navLinks.querySelectorAll('a');
  let currentSection = '';

  sections.forEach(id => {
    const section = document.getElementById(id);
    if (section) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 150) {
        currentSection = id;
      }
    }
  });

  navLinksAll.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + currentSection) {
      link.classList.add('active');
    }
  });
}

// ══════════════════════════════════
// BACK TO TOP
// ══════════════════════════════════
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ══════════════════════════════════
// TAB SYSTEM (Chặng 1, 2, 3)
// ══════════════════════════════════
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetTab = btn.dataset.tab;

    // Deactivate all
    tabButtons.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));

    // Activate selected
    btn.classList.add('active');
    const targetPanel = document.getElementById('tab-' + targetTab);
    if (targetPanel) {
      targetPanel.classList.add('active');

      // Re-trigger fade-in animations for the new panel
      targetPanel.querySelectorAll('.fade-in, .fade-in-left').forEach(el => {
        el.classList.remove('visible');
        void el.offsetWidth; // force reflow
        el.classList.add('visible');
      });
    }
  });
});

// ══════════════════════════════════
// LECTURE CARD EXPAND/COLLAPSE
// ══════════════════════════════════
function toggleLecture(card) {
  const wasExpanded = card.classList.contains('expanded');

  // Close all other cards in the same grid
  const parent = card.closest('.lectures-grid');
  if (parent) {
    parent.querySelectorAll('.lecture-card.expanded').forEach(c => {
      if (c !== card) c.classList.remove('expanded');
    });
  }

  // Toggle this card
  if (wasExpanded) {
    card.classList.remove('expanded');
  } else {
    card.classList.add('expanded');
  }
}

// ══════════════════════════════════
// COURSE CARD EXPAND/COLLAPSE (Part 2)
// ══════════════════════════════════
function toggleCourse(courseId) {
  const card = document.getElementById(courseId);
  if (!card) return;

  const wasExpanded = card.classList.contains('expanded');

  // Close all other course cards
  document.querySelectorAll('.course-card.expanded').forEach(c => {
    if (c.id !== courseId) c.classList.remove('expanded');
  });

  // Toggle
  if (wasExpanded) {
    card.classList.remove('expanded');
  } else {
    card.classList.add('expanded');
  }
}

// ══════════════════════════════════
// SCROLL ANIMATIONS (Intersection Observer)
// ══════════════════════════════════
const observerOptions = {
  root: null,
  rootMargin: '0px 0px -60px 0px',
  threshold: 0.1
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe all fade elements
document.querySelectorAll('.fade-in, .fade-in-left').forEach(el => {
  fadeObserver.observe(el);
});

// ══════════════════════════════════
// SMOOTH SCROLL for anchor links
// ══════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = navbar.offsetHeight + 20;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ══════════════════════════════════
// TYPING EFFECT for Hero Code Block
// ══════════════════════════════════
function initTypingEffect() {
  const codeBody = document.querySelector('.hero-code-body');
  if (!codeBody) return;

  const lines = codeBody.querySelectorAll('div');
  lines.forEach((line, index) => {
    line.style.opacity = '0';
    line.style.transform = 'translateX(-10px)';
    line.style.transition = `opacity 0.3s ease ${index * 0.08}s, transform 0.3s ease ${index * 0.08}s`;

    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateX(0)';
    }, 300);
  });
}

// Run typing effect when page loads
window.addEventListener('load', initTypingEffect);

// ══════════════════════════════════
// KEYBOARD NAVIGATION
// ══════════════════════════════════
document.addEventListener('keydown', (e) => {
  // ESC to close mobile menu
  if (e.key === 'Escape') {
    navLinks.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';

    // Close all expanded cards
    document.querySelectorAll('.lecture-card.expanded, .course-card.expanded').forEach(c => {
      c.classList.remove('expanded');
    });
  }
});

// ══════════════════════════════════
// STATS COUNTER ANIMATION
// ══════════════════════════════════
function animateCounters() {
  const stats = document.querySelectorAll('.hero-stat-value');

  stats.forEach(stat => {
    const target = parseInt(stat.textContent, 10);
    if (isNaN(target)) return;

    let current = 0;
    const increment = Math.ceil(target / 30);
    const duration = 1000;
    const stepTime = duration / (target / increment);

    stat.textContent = '0';

    const counter = setInterval(() => {
      current += increment;
      if (current >= target) {
        stat.textContent = target;
        clearInterval(counter);
      } else {
        stat.textContent = current;
      }
    }, stepTime);
  });
}

// Trigger counter when hero is in view
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      heroObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const heroSection = document.getElementById('hero');
if (heroSection) {
  heroObserver.observe(heroSection);
}

console.log('✅ KH-THCS Curriculum website loaded successfully.');
