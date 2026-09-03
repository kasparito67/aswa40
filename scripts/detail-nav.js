'use strict';

(() => {
  const modalBg = document.getElementById('mb');
  const modal = document.getElementById('modal');
  if (!modalBg || !modal || typeof showFilm !== 'function' || typeof showGhost !== 'function') return;

  const rankedFilms = [...films].sort((a, b) => Number(a.rank) - Number(b.rank));
  let current = null;
  let touchStartX = 0;
  let touchStartY = 0;
  let trackingTouch = false;

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

  function navigate(step) {
    if (!current) return;

    if (current.type === 'film') {
      const index = rankedFilms.findIndex(film => Number(film.rank) === current.key);
      if (index < 0) return;
      const target = rankedFilms[(index + step + rankedFilms.length) % rankedFilms.length];
      setCurrent('film', target.rank);
      showFilm(target.rank);
      return;
    }

    const targetIndex = (current.key + step + ghosts.length) % ghosts.length;
    setCurrent('ghost', targetIndex);
    showGhost(targetIndex);
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
