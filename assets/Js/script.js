const scrollTopBtn = document.querySelector('.scrolltop');

function onScroll() {
  if (!scrollTopBtn) return;
  const show = window.scrollY > 400;
  scrollTopBtn.classList.toggle('show', show);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

scrollTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Prevent newsletter form submit from navigating during static preview
const newsletter = document.querySelector('.newsletter');
newsletter?.addEventListener('submit', (e) => {
  e.preventDefault();
});

// Image fallbacks (for offline previews / blocked remote images)
document.querySelectorAll('img[data-fallback]').forEach((img) => {
  const fallbackSrc = img.getAttribute('data-fallback');
  if (!fallbackSrc) return;

  const applyFallback = () => {
    if (img.dataset.fallbackApplied === '1') return;
    img.dataset.fallbackApplied = '1';
    img.src = fallbackSrc;
  };

  img.addEventListener('error', applyFallback);
  if (img.complete && img.naturalWidth === 0) applyFallback();
});

// Imported "parts" section: play button
const playBtn = document.querySelector('.parts-play-btn');
playBtn?.addEventListener('click', () => {
  // Placeholder behavior (no video source provided)
  alert('Video player would open here.');
});

// Mobile drawer menu
const drawer = document.querySelector('.drawer');
const drawerOverlay = document.querySelector('.drawer-overlay');
const navToggle = document.querySelector('.nav-toggle');
const drawerCloseEls = document.querySelectorAll('[data-drawer-close]');

function setDrawerOpen(open) {
  if (!drawer || !drawerOverlay || !navToggle) return;

  document.body.classList.toggle('drawer-open', open);
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');

  drawer.hidden = !open;
  drawerOverlay.hidden = !open;

  if (open) {
    const firstLink = drawer.querySelector('a, button');
    firstLink?.focus?.();
  } else {
    navToggle.focus?.();
  }
}

navToggle?.addEventListener('click', () => {
  const isOpen = document.body.classList.contains('drawer-open');
  setDrawerOpen(!isOpen);
});

drawerCloseEls.forEach((el) => {
  el.addEventListener('click', () => setDrawerOpen(false));
});

window.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!document.body.classList.contains('drawer-open')) return;
  setDrawerOpen(false);
});

// Animated counters (hero stats)
function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
}

function formatCounterValue(value, { prefix = '', suffix = '' } = {}) {
  return `${prefix}${value}${suffix}`;
}

function animateCounter(el) {
  if (!el) return;
  if (el.dataset.animated === '1') return;

  const target = Number(el.getAttribute('data-count'));
  if (!Number.isFinite(target)) return;

  const prefix = el.getAttribute('data-prefix') || '';
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 1200;

  el.dataset.animated = '1';

  if (prefersReducedMotion()) {
    el.textContent = formatCounterValue(target, { prefix, suffix });
    return;
  }

  const start = performance.now();
  const from = 0;

  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    // easeOutCubic
    const eased = 1 - Math.pow(1 - t, 3);
    const current = Math.round(from + (target - from) * eased);
    el.textContent = formatCounterValue(current, { prefix, suffix });
    if (t < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

const counterEls = document.querySelectorAll('.stat-num[data-count]');
if (counterEls.length) {
  if ('IntersectionObserver' in window && !prefersReducedMotion()) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.35 }
    );
    counterEls.forEach((el) => io.observe(el));
  } else {
    counterEls.forEach((el) => animateCounter(el));
  }
}
