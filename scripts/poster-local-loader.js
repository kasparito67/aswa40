(() => {
  const POSTERS = {
    'american psycho': 'assets/posters/poster-american-psycho.jpg',
    'boyhood': 'assets/posters/poster-boyhood.jpg',
    'downfall': 'assets/posters/poster-downfall.jpg',
    'der untergang': 'assets/posters/poster-downfall.jpg',
    'dunkirk': 'assets/posters/poster-dunkirk.jpg',
    'ex machina': 'assets/posters/poster-ex-machina.jpg',
    'get out': 'assets/posters/poster-get-out.jpg',
    'harry potter': 'assets/posters/poster-harry-potter.jpg',
    'harry potter franchise': 'assets/posters/poster-harry-potter.jpg',
    'interstellar': 'assets/posters/poster-interstellar.jpg',
    'mad max': 'assets/posters/poster-mad-max-fury-road.jpg',
    'mad max fury road': 'assets/posters/poster-mad-max-fury-road.jpg',
    'mad max: fury road': 'assets/posters/poster-mad-max-fury-road.jpg',
    'moonlight': 'assets/posters/poster-moonlight.jpg',
    'parasite': 'assets/posters/poster-parasite.jpg',
    'the revenant': 'assets/posters/poster-the-revenant.jpg',
    'up': 'assets/posters/poster-up.jpg'
  };

  const normalize = (value = '') => value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/^[#]?\d+[.)]?\s*/, '')
    .replace(/[–—]/g, '-')
    .replace(/[()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  function usePoster(tile, src, label) {
    const probe = new Image();
    probe.decoding = 'async';
    probe.onload = () => {
      let img = tile.querySelector('img');
      if (!img) {
        img = document.createElement('img');
        tile.insertBefore(img, tile.firstChild);
      }
      img.src = src;
      img.alt = label;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.removeAttribute('srcset');
      img.removeAttribute('data-src');
      img.classList.remove('poster-deferred');
      img.classList.add('is-loaded');
      img.dataset.localPoster = '1';
    };
    probe.src = src;
  }

  function applyLocalPosters() {
    document.querySelectorAll('.tile').forEach((tile) => {
      if (tile.querySelector('img[data-local-poster="1"]')) return;
      const name = tile.querySelector('.name');
      if (!name) return;
      const label = name.textContent.trim();
      const src = POSTERS[normalize(label)];
      if (src) usePoster(tile, src, label);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyLocalPosters, { once: true });
  } else {
    applyLocalPosters();
  }

  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      applyLocalPosters();
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
