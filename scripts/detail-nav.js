'use strict';

(() => {
  const modalBg = document.getElementById('mb');
  const modal = document.getElementById('modal');
  if (!modalBg || !modal || typeof showFilm !== 'function' || typeof showGhost !== 'function') return;

  const rankedFilms = [...films].sort((a, b) => Number(a.rank) - Number(b.rank));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
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

  function setCurrent(type, key) {
    current = { type, key: Number(key) };
    updateLabels();
  }

  function targetForStep(step) {
    if (!current) return null;

    if (current.type === 'film') {
      const index = rankedFilms.findIndex(film => Number(film.rank) === current.key);
      if (index < 0) return null;
      const target = rankedFilms[(index + step + rankedFilms.length) % rankedFilms.length];
      return { type: 'film', key: Number(target.rank) };
    }

    return {
      type: 'ghost',
      key: (current.key + step + ghosts.length) % ghosts.length,
    };
  }

  function showTarget(target) {
    setCurrent(target.type, target.key);
    if (target.type === 'film') showFilm(target.key);
    else showGhost(target.key);
  }

  async function navigate(step) {
    if (!current || navigating) return;
    const target = targetForStep(step);
    if (!target) return;

    if (reducedMotion.matches || typeof modal.animate !== 'function') {
      showTarget(target);
      return;
    }

    navigating = true;
    const distance = window.matchMedia('(max-width: 700px)').matches ? 64 : 46;
    const exitX = step > 0 ? -distance : distance;
    const enterX = step > 0 ? distance : -distance;

    try {
      await modal.animate([
        { transform: 'translateX(0) scale(1)', opacity: 1 },
        { transform: `translateX(${exitX}px) scale(.992)`, opacity: .36 },
      ], {
        duration: 130,
        easing: 'cubic-bezier(.4,0,1,1)',
        fill: 'forwards',
      }).finished;

      showTarget(target);

      await modal.animate([
        { transform: `translateX(${enterX}px) scale(.992)`, opacity: .36 },
        { transform: 'translateX(0) scale(1)', opacity: 1 },
      ], {
        duration: 230,
        easing: 'cubic-bezier(.16,1,.3,1)',
        fill: 'both',
      }).finished;
    } finally {
      navigating = false;
    }
  }

  document.addEventListener('click', event => {
    const tile = event.target.closest('.tile[data-r]');
    if (tile) {
      setCurrent('film', tile.dataset.r);
      return;
    }

    const ghost = event.target.closest('[data-g]');
    if (ghost) setCurrent('ghost', ghost.dataset.g);
  });

  previousButton.addEventListener('click', () => navigate(-1));
  nextButton.addEventListener('click', () => navigate(1));

  document.addEventListener('keydown', event => {
    if (!modalBg.classList.contains('open')) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      navigate(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      navigate(1);
    }
  });

  modal.addEventListener('touchstart', event => {
    if (!modalBg.classList.contains('open') || event.touches.length !== 1) return;
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    trackingTouch = true;
  }, { passive: true });

  modal.addEventListener('touchend', event => {
    if (!trackingTouch || event.changedTouches.length !== 1) return;
    trackingTouch = false;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    const horizontalDistance = Math.abs(deltaX);
    const verticalDistance = Math.abs(deltaY);

    if (horizontalDistance < 52) return;
    if (horizontalDistance < verticalDistance * 1.25) return;

    if (deltaX < 0) navigate(1);
    else navigate(-1);
  }, { passive: true });
})();
