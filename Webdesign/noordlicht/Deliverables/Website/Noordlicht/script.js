// Nav scroll shadow
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 20), { passive: true });

// Hamburger
const burger = document.getElementById('burger');
const mobMenu = document.getElementById('mob-menu');
burger.addEventListener('click', () => mobMenu.classList.toggle('open'));
mobMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobMenu.classList.remove('open')));

// Menu tabs
document.querySelectorAll('.menu-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.menu-tab-btn').forEach(b => b.classList.remove('on'));
    document.querySelectorAll('.menu-pane').forEach(p => p.classList.remove('on'));
    btn.classList.add('on');
    document.getElementById('pane-' + btn.dataset.pane).classList.add('on');
  });
});

// Language switcher
function applyLang(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const text = el.getAttribute('data-' + lang);
    if (text !== null) el.innerHTML = text;
  });
  document.documentElement.lang = lang;
  // Sync active button
  document.querySelectorAll('.lang-btn').forEach(b => {
    const btnLang = b.getAttribute('title') === 'Deutsch' ? 'de' : 'en';
    b.classList.toggle('active', btnLang === lang);
  });
  // Swap map language
  const mapFrame = document.getElementById('map-frame');
  if (mapFrame) {
    const src = mapFrame.getAttribute('data-src-' + lang) || mapFrame.getAttribute('data-src-en');
    if (src) mapFrame.src = src;
  }
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.getAttribute('title') === 'Deutsch' ? 'de' : 'en';
    applyLang(lang);
  });
});

// Always start in German
applyLang('de');

// Reveal on scroll
const obs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.style.transitionDelay = (i * 0.08) + 's';
      e.target.classList.add('vis');
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ── Icon grid (single fixed layer, covers full viewport seamlessly) ───────────
(function scatterIcons() {
  const icons = [
    'graphics/icons_fettfett_01.png',
    'graphics/icons_fettfett_02.png',
    'graphics/icons_fettfett_03.png',
    'graphics/icons_fettfett_04.png',
    'graphics/icons_fettfett_05.png',
    'graphics/icons_fettfett_06.png',
    'graphics/icons_fettfett_07.png',
    'graphics/icons_fettfett_08.png',
    'graphics/icons_fettfett_09.png',
  ];

  const ICON_SIZE = 120;
  const COL_GAP   = 220;
  const ROW_GAP   = 200;

  function makeRow(cols) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const forbidden = new Set([row[c - 1] || null]);
      const available = icons.filter(ic => !forbidden.has(ic));
      row.push(available[Math.floor(Math.random() * available.length)]);
    }
    return row;
  }

  function populate(container) {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const cols = Math.max(1, Math.floor(w / COL_GAP) + 1);
    const rows = Math.ceil(h / ROW_GAP) + 2;

    for (let r = 0; r < rows; r++) {
      const rowIcons = makeRow(cols);
      const baseCY = r * ROW_GAP;

      for (let c = 0; c < cols; c++) {
        const cy = baseCY + (c % 2 === 1 ? -ROW_GAP / 2 : 0);
        const x  = c * COL_GAP;
        const y  = cy - ICON_SIZE / 2;

        if (x < 0 || x + ICON_SIZE > w) continue;

        const rot = (Math.random() * 24 - 12).toFixed(1);
        const img = document.createElement('img');
        img.src = rowIcons[c];
        img.alt = '';
        img.className = 'ip-icon';
        img.style.cssText =
          `width:${ICON_SIZE}px;left:${x.toFixed(1)}px;top:${y.toFixed(1)}px;transform:rotate(${rot}deg);`;
        container.appendChild(img);
      }
    }
  }

  const container = document.getElementById('global-icons');
  if (container) populate(container);
})();
