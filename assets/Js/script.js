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
