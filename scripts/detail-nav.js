'use strict';

(() => {
  const modalBg = document.getElementById('mb');
  const modal = document.getElementById('modal');
  if (!modalBg || !modal || typeof showFilm !== 'function' || typeof showGhost !== 'function') return;

  const rankedFilms = [...films].sort((a, b) => Number(a.rank) - Number(b.rank));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const preloaded = new Set();
  let current = null;
  let touchStartX = 0;
  let touchStartY = 0;
  let trackingTouch = false;
  let navigating = false;

  modal.insertAdjacentHTML('beforeend', [
    '<button class="modal-nav modal-nav-prev" type="button" aria-label="Film précédent">',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>',
    '</button>',
    '<button class="modal-nav modal-nav-next" type="button" aria-label="Film suivant">',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>',
    '</button>',
  ].join(''));

  const previousButton = modal.querySelector('.modal-nav-prev');
  const nextButton = modal.querySelector('.modal-nav-next');

  function updateLabels() {
    if (!current) return;
    if (current.type === 'film') {
      const index = rankedFilms.findIndex(film => Number(film.rank) === current.key);
      if (index < 0) return;
      const previous = rankedFilms[(index - 1 + rankedFilms.length) % rankedFilms.length];
      const next = rankedFilms[(index + 1) % rankedFilms.length];
      previousButton.setAttribute('aria-label', `Film précédent : #${previous.rank} ${previous.title}`);
      nextButton.setAttribute('aria-label', `Film suivant : #${next.rank} ${next.title}`);
      return;
    }
    const previousIndex = (current.key - 1 + ghosts.length) % ghosts.length;
    const nextIndex = (current.key + 1) % ghosts.length;
    previousButton.setAttribute('aria-label', `Film précédent : ${ghosts[previousIndex][0]}`);
    nextButton.setAttribute('aria-label', `Film suivant : ${ghosts[nextIndex][0]}`);
  }

  function targetForStep(step) {
    if (!current) return null;
    if (current.type === 'film') {
      const index = rankedFilms.findIndex(film => Number(film.rank) === current.key);
      if (index < 0) return null;
      const target = rankedFilms[(index + step + rankedFilms.length) % rankedFilms.length];
      return { type: 'film', key: Number(target.rank) };
    }
    return { type: 'ghost', key: (current.key + step + ghosts.length) % ghosts.length };
  }

  function targetAssets(target) {
    if (!target) return [];
    if (target.type === 'film') {
      const film = films.find(item => Number(item.rank) === target.key);
      return film ? [film.img, filmBackdrops[film.rank]].filter(Boolean) : [];
    }
    const ghost = ghosts[target.key];
    return ghost ? [ghost[2], ghostBackdrops[ghost[0]]].filter(Boolean) : [];
  }

  function preloadAsset(src) {
    if (!src || preloaded.has(src)) return Promise.resolve();
    return new Promise(resolve => {
      const image = new Image();
      const done = () => { preloaded.add(src); resolve(); };
      image.onload = done;
      image.onerror = done;
      image.src = src;
      if (image.complete) done();
    });
  }
  function preloadTarget(target) { return Promise.all(targetAssets(target).map(preloadAsset)); }
  function warmNeighbours() { if (current) [targetForStep(-1), targetForStep(1)].forEach(preloadTarget); }
  function setCurrent(type, key) { current = { type, key: Number(key) }; updateLabels(); requestAnimationFrame(warmNeighbours); }
  function showTarget(target) { setCurrent(target.type, target.key); if (target.type === 'film') showFilm(target.key); else showGhost(target.key); }

  async function navigate(step) {
    if (!current || navigating) return;
    const target = targetForStep(step);
    if (!target) return;
    navigating = true;
    try {
      await Promise.race([preloadTarget(target), new Promise(resolve => setTimeout(resolve, 500))]);
      if (reducedMotion.matches || typeof modal.animate !== 'function') { showTarget(target); return; }
      const distance = window.matchMedia('(max-width: 700px)').matches ? 42 : 34;
      const exitX = step > 0 ? -distance : distance;
      const enterX = step > 0 ? distance : -distance;
      await modal.animate([{ transform: 'translate3d(0,0,0)', opacity: 1 },{ transform: `translate3d(${exitX}px,0,0)`, opacity: .92 }],{ duration: 105, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' }).finished;
      showTarget(target);
      await new Promise(resolve => requestAnimationFrame(resolve));
      await modal.animate([{ transform: `translate3d(${enterX}px,0,0)`, opacity: .92 },{ transform: 'translate3d(0,0,0)', opacity: 1 }],{ duration: 175, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }).finished;
    } finally { navigating = false; }
  }

  document.addEventListener('click', event => {
    const tile = event.target.closest('.tile[data-r]');
    if (tile) { setCurrent('film', tile.dataset.r); return; }
    const ghost = event.target.closest('[data-g]');
    if (ghost) setCurrent('ghost', ghost.dataset.g);
  });
  previousButton.addEventListener('click', () => navigate(-1));
  nextButton.addEventListener('click', () => navigate(1));
  document.addEventListener('keydown', event => {
    if (!modalBg.classList.contains('open')) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); navigate(-1); }
    else if (event.key === 'ArrowRight') { event.preventDefault(); navigate(1); }
  });
  modal.addEventListener('touchstart', event => {
    if (!modalBg.classList.contains('open') || event.touches.length !== 1 || navigating) return;
    const touch = event.touches[0]; touchStartX = touch.clientX; touchStartY = touch.clientY; trackingTouch = true;
  }, { passive: true });
  modal.addEventListener('touchend', event => {
    if (!trackingTouch || event.changedTouches.length !== 1 || navigating) return;
    trackingTouch = false;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    const horizontalDistance = Math.abs(deltaX);
    const verticalDistance = Math.abs(deltaY);
    if (horizontalDistance < 52 || horizontalDistance < verticalDistance * 1.25) return;
    navigate(deltaX < 0 ? 1 : -1);
  }, { passive: true });
})();

// Cross-era navigation for the 2000–2024 landing page.
(() => {
  const hero = document.querySelector('.hero-header');
  if (!hero || hero.querySelector('.era-nav-2000')) return;
  const style = document.createElement('style');
  style.textContent = `
    @view-transition{navigation:auto}
    .era-nav-2000{position:absolute;inset:0;z-index:12;pointer-events:none}
    .era-nav-2000 a{position:absolute;top:50%;transform:translateY(-50%);width:58px;height:82px;display:grid;place-items:center;pointer-events:auto;color:rgba(255,255,255,.78);text-decoration:none;font:300 32px/1 Inter,Arial,sans-serif}
    .era-nav-2000 .left{left:16px}.era-nav-2000 .right{right:16px}
    .era-nav-2000 a:after{content:attr(data-tip);position:absolute;top:50%;padding:8px 10px;border:1px solid rgba(255,255,255,.13);background:rgba(8,10,11,.94);color:#fff;font:750 11px/1.1 Inter,Arial,sans-serif;white-space:nowrap;opacity:0;visibility:hidden;transform:translateY(-50%);transition:opacity .16s ease .7s,visibility 0s linear .86s}
    .era-nav-2000 .left:after{left:calc(100% + 7px)}.era-nav-2000 .right:after{right:calc(100% + 7px)}
    .era-nav-2000 a:hover{color:#fff}.era-nav-2000 a:hover:after,.era-nav-2000 a:focus-visible:after{opacity:1;visibility:visible;transition-delay:.7s}
    @media(max-width:700px){.era-nav-2000 a{width:44px}.era-nav-2000 .left{left:5px}.era-nav-2000 .right{right:5px}.era-nav-2000 a:after{display:none}}
  `;
  document.head.appendChild(style);
  const nav = document.createElement('nav');
  nav.className = 'era-nav-2000';
  nav.setAttribute('aria-label','Navigation entre les classements');
  nav.innerHTML = '<a class="left" href="/1975-1999/" data-tip="Top films 1975–1999" aria-label="Top films 1975–1999">←</a><a class="right" href="/1975-1999/" data-tip="Top films 1975–1999" aria-label="Top films 1975–1999">→</a>';
  hero.appendChild(nav);
})();
