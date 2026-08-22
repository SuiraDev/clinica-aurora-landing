/* ==========================================================================
   Clínica Aurora — main.js (ES module, CSP-safe: no inline script, no eval)
   Handles: mobile nav, theme toggle, accent swatches, motion toggle, tweaks
   panel, demo form, and graceful image fallback.
   ========================================================================== */

const root = document.documentElement;

/* ---------- tiny storage helpers ---------- */
function store(key, value) {
  try { localStorage.setItem(key, value); } catch { /* private mode */ }
}
function read(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

/* ---------- Accent (color swatches) ---------- */
function shade(hex, pct) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  const f = (v) =>
    Math.max(0, Math.min(255, Math.round(v + (pct / 100) * 255)));
  return (
    '#' +
    [f(r), f(g), f(b)]
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')
  );
}

function setAccent(hex) {
  root.style.setProperty('--accent', hex);
  root.style.setProperty('--accent-ink', shade(hex, -18));
  document.querySelectorAll('#swatches .swatch').forEach((sw) => {
    sw.classList.toggle('active', sw.dataset.accent.toLowerCase() === hex.toLowerCase());
  });
}

const swatchButtons = document.querySelectorAll('#swatches .swatch');
const savedAccent = read('accent');
swatchButtons.forEach((btn) => {
  const hex = btn.dataset.accent;
  if (hex.toLowerCase() === (savedAccent || '#A85B4B').toLowerCase()) {
    btn.classList.add('active');
  }
  btn.addEventListener('click', () => {
    setAccent(hex);
    store('accent', hex);
  });
});
if (savedAccent) setAccent(savedAccent);

/* ---------- Theme ---------- */
const themeButtons = document.querySelectorAll('#themeToggle button');
function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  themeButtons.forEach((b) => {
    const active = b.dataset.theme === theme;
    b.classList.toggle('active', active);
    b.setAttribute('aria-pressed', String(active));
  });
  store('theme', theme);
}
const savedTheme = read('theme') || 'light';
themeButtons.forEach((b) => {
  b.addEventListener('click', () => setTheme(b.dataset.theme));
});
setTheme(savedTheme);

/* ---------- Motion ---------- */
const motionToggle = document.getElementById('motionToggle');
const savedMotion = read('motion');
motionToggle.checked = savedMotion !== 'off';
function applyMotion(checked) {
  document.body.classList.toggle('no-motion', !checked);
}
motionToggle.addEventListener('change', () => {
  applyMotion(motionToggle.checked);
  store('motion', motionToggle.checked ? 'on' : 'off');
});
if (savedMotion === 'off') applyMotion(false);
// Respect prefers-reduced-motion unless the user has explicitly chosen a setting.
if (savedMotion === null && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  motionToggle.checked = false;
  applyMotion(false);
}

/* ---------- Tweaks panel ---------- */
const tweaksPanel = document.getElementById('tweaksPanel');
const tweaksBtn = document.getElementById('tweaksBtn');
function togglePanel(open) {
  tweaksPanel.classList.toggle('open', open);
  tweaksBtn.setAttribute('aria-expanded', String(open));
}
tweaksBtn.addEventListener('click', () => {
  togglePanel(!tweaksPanel.classList.contains('open'));
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && tweaksPanel.classList.contains('open')) {
    togglePanel(false);
    tweaksBtn.focus();
  }
});

/* ---------- Mobile nav ---------- */
const navLinks = document.getElementById('navLinks');
const navToggle = document.getElementById('navToggle');
function setNavOpen(open) {
  navLinks.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
}
navToggle.addEventListener('click', () => {
  setNavOpen(!navLinks.classList.contains('open'));
});
navLinks.addEventListener('click', (e) => {
  if (e.target.closest('a')) setNavOpen(false);
});

/* ---------- Demo form (client-side only, no backend) ---------- */
const demoForm = document.getElementById('demoForm');
const formStatus = document.getElementById('formStatus');
demoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formStatus.hidden = false;
  demoForm.reset();
});

/* ---------- Graceful image fallback ---------- */
document.querySelectorAll('img').forEach((img) => {
  img.addEventListener('error', () => {
    // Hide the broken <img> so the tint frame + badge remain polished.
    img.style.opacity = '0';
  });
});
