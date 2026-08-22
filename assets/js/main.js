/* ==========================================================================
   Clínica Aurora — main.js (ES module, CSP-safe: no inline script, no eval)
   Handles: mobile nav (focus trap), theme toggle, accent swatches (theme-aware),
   motion toggle, appearance panel (inert when closed), demo form, image fallback.
   ========================================================================== */

const root = document.documentElement;

/* ---------- tiny storage helpers ---------- */
function store(key, value) {
  try { localStorage.setItem(key, value); } catch { /* private mode */ }
}
function read(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

/* ---------- Accent (theme-aware, fixes D1) ----------
   The palette is defined in CSS keyed on `data-accent`; here we only switch the
   attribute, and CSS recomputes --accent / --accent-deep / --on-accent together
   per theme so every text pair stays ≥ 4.5:1. No inline style overrides. */
const accentNames = ['terracota', 'salvia', 'vinho', 'petroleo'];

function setAccent(name) {
  if (!accentNames.includes(name)) return;
  root.setAttribute('data-accent', name);
  document.querySelectorAll('#swatches .swatch').forEach((sw) => {
    const active = sw.dataset.accent === name;
    sw.classList.toggle('active', active);
    sw.setAttribute('aria-pressed', String(active));
  });
  store('accent', name);
}

const swatchButtons = document.querySelectorAll('#swatches .swatch');
const savedAccent = read('accent') || 'terracota';
swatchButtons.forEach((btn) => {
  btn.setAttribute('aria-pressed', 'false');
  btn.addEventListener('click', () => setAccent(btn.dataset.accent));
});
setAccent(savedAccent);

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

/* ---------- Appearance panel (inert when closed, fixes D2) ---------- */
const tweaksPanel = document.getElementById('tweaksPanel');
const tweaksBtn = document.getElementById('tweaksBtn');
function togglePanel(open) {
  tweaksPanel.classList.toggle('open', open);
  // inert removes the closed panel from the tab order AND the accessibility tree.
  if (open) {
    tweaksPanel.removeAttribute('inert');
    tweaksPanel.removeAttribute('aria-hidden');
  } else {
    tweaksPanel.setAttribute('inert', '');
    tweaksPanel.setAttribute('aria-hidden', 'true');
  }
  tweaksBtn.setAttribute('aria-expanded', String(open));
}
tweaksPanel.setAttribute('inert', '');
tweaksPanel.setAttribute('aria-hidden', 'true');
tweaksBtn.addEventListener('click', () => {
  togglePanel(!tweaksPanel.classList.contains('open'));
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && tweaksPanel.classList.contains('open')) {
    togglePanel(false);
    tweaksBtn.focus();
  }
});

/* ---------- Mobile nav (focus trap, fixes AC-A11Y-2) ---------- */
const navLinks = document.getElementById('navLinks');
const navToggle = document.getElementById('navToggle');
function focusable(el) {
  return (
    el.getAttribute('href') != null
    || el.getAttribute('tabindex') != null
    || ['AUDIO', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName)
  );
}
function trapFocus(e, container) {
  const els = [...container.querySelectorAll('a[href], button, input, [tabindex]:not([tabindex="-1"])')]
    .filter((el) => !el.disabled && focusable(el));
  if (!els.length) return;
  const first = els[0];
  const last = els[els.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}
function setNavOpen(open) {
  navLinks.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  if (open) {
    const first = navLinks.querySelector('a');
    if (first) first.focus();
  }
}
navToggle.addEventListener('click', () => {
  const open = !navLinks.classList.contains('open');
  setNavOpen(open);
});
navLinks.addEventListener('click', (e) => {
  if (e.target.closest('a')) setNavOpen(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    setNavOpen(false);
    navToggle.focus();
  } else if (e.key === 'Tab' && navLinks.classList.contains('open')) {
    trapFocus(e, navLinks);
  }
});
document.addEventListener('click', (e) => {
  if (
    navLinks.classList.contains('open')
    && !navToggle.contains(e.target)
    && !navLinks.contains(e.target)
  ) {
    setNavOpen(false);
  }
});

/* ---------- Demo form (client-side only, no backend) ---------- */
const demoForm = document.getElementById('demoForm');
const formStatus = document.getElementById('formStatus');
demoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formStatus.hidden = false;   // role="status" live region announces it (fixes D3)
  demoForm.reset();
});

/* ---------- Graceful image fallback ---------- */
document.querySelectorAll('img').forEach((img) => {
  img.addEventListener('error', () => {
    // Hide the broken <img> so the tint frame remains polished.
    img.style.opacity = '0';
  });
});

/* FAQ accordion (botao + painel) */
document.querySelectorAll('.faq-q').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const panel = item.querySelector('.faq-a');
    const open = item.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
    if (open) panel.removeAttribute('hidden');
    else panel.setAttribute('hidden', '');
  });
});
