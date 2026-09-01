(() => {
  const POSTERS = {
    'american psycho': 'assets/posters/american-psycho.webp',
    'boyhood': 'assets/posters/boyhood.webp',
    'downfall': 'assets/posters/downfall.webp',
    'der untergang': 'assets/posters/downfall.webp',
    'dunkirk': 'assets/posters/dunkirk.webp',
    'ex machina': 'assets/posters/ex-machina.webp',
    'get out': 'assets/posters/get-out.webp',
    'harry potter': 'assets/posters/harry-potter.webp',
    'harry potter franchise': 'assets/posters/harry-potter.webp',
    'interstellar': 'assets/posters/interstellar.webp',
    'mad max': 'assets/posters/mad-max-fury-road.webp',
    'mad max fury road': 'assets/posters/mad-max-fury-road.webp',
    'mad max: fury road': 'assets/posters/mad-max-fury-road.webp',
    'moonlight': 'assets/posters/moonlight.webp',
    'parasite': 'assets/posters/parasite.webp',
    'the revenant': 'assets/posters/the-revenant.webp',
    'up': 'assets/posters/up.webp'
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
