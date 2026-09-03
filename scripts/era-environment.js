'use strict';

(() => {
  const body = document.body;
  if (!body) return;

  const era = body.dataset.era || (location.pathname.includes('1975-1999') ? '1975' : '2000');
  const target = era === '1975' ? '/' : '/1975-1999/';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  let navigating = false;
  let pointer = null;
  let wheelSum = 0;
  let wheelTimer = 0;

  const incoming = sessionStorage.getItem('aswa-era-dir');
  if (incoming === 'next' || incoming === 'prev') root.dataset.eraDir = incoming;
  requestAnimationFrame(() => sessionStorage.removeItem('aswa-era-dir'));

  function setProgress(px) {
    const max = innerWidth * .22;
    const clamped = Math.max(-max, Math.min(max, px));
    const ratio = Math.min(1, Math.abs(clamped) / max);
    root.style.setProperty('--era-shift', `${clamped}px`);
    root.style.setProperty('--era-opacity', String(1 - ratio * .08));
    body.classList.add('era-gesture');
  }

  function clearProgress() {
    body.classList.remove('era-gesture','era-snapback','era-committing');
    root.style.removeProperty('--era-shift');
    root.style.removeProperty('--era-opacity');
  }

  function navigate(direction) {
    if (navigating) return;
    navigating = true;
    const dir = direction === 'prev' ? 'prev' : 'next';
    root.dataset.eraDir = dir;
    sessionStorage.setItem('aswa-era-dir', dir);

    if (reduced.matches) {
      location.href = target;
      return;
    }

    const sign = dir === 'next' ? -1 : 1;
    body.classList.remove('era-snapback');
    body.classList.add('era-gesture','era-committing');
    root.style.setProperty('--era-shift', `${sign * Math.min(innerWidth * .16, 180)}px`);
    root.style.setProperty('--era-opacity', '.82');
    setTimeout(() => { location.href = target; }, 210);
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('.era-nav a,.era-nav-2000 a,.era-arrow');
    if (!link) return;
    event.preventDefault();
    const direction = link.classList.contains('left') || link.classList.contains('hero-era-arrow--prev') ? 'prev' : 'next';
    navigate(direction);
  }, true);

  // Strong horizontal trackpad swipe anywhere on the page.
  addEventListener('wheel', event => {
    if (navigating || document.querySelector('.modalbg.open,.mb.open')) return;
    if (Math.abs(event.deltaX) < Math.abs(event.deltaY) * 1.18) return;
    if (event.target.closest('.full-scroll,.full-scroll-shell,[data-horizontal-scroll]')) return;

    wheelSum += event.deltaX;
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { wheelSum = 0; }, 260);

    const preview = Math.max(-150, Math.min(150, -wheelSum * .32));
    setProgress(preview);

    if (Math.abs(wheelSum) >= 145) {
      event.preventDefault();
      navigate(wheelSum > 0 ? 'next' : 'prev');
      wheelSum = 0;
      return;
    }

    if (event.cancelable) event.preventDefault();
  }, { passive:false });

  // Touch / pen drag on the hero, matching iOS interactive navigation.
  const hero = document.querySelector('.hero-header,.hero');
  if (hero) {
    hero.addEventListener('pointerdown', event => {
      if (navigating || event.pointerType === 'mouse' || event.button !== 0 || event.target.closest('a,button')) return;
      event.stopImmediatePropagation();
      pointer = { id:event.pointerId, x:event.clientX, y:event.clientY, dx:0, t:performance.now(), locked:false };
      hero.setPointerCapture?.(event.pointerId);
    }, true);

    hero.addEventListener('pointermove', event => {
      if (!pointer || pointer.id !== event.pointerId || navigating) return;
      pointer.dx = event.clientX - pointer.x;
      const dy = event.clientY - pointer.y;
      if (!pointer.locked) {
        if (Math.abs(pointer.dx) < 8 && Math.abs(dy) < 8) return;
        if (Math.abs(dy) > Math.abs(pointer.dx) * 1.08) { pointer = null; return; }
        pointer.locked = true;
      }
      setProgress(pointer.dx * .72);
      if (event.cancelable) event.preventDefault();
    }, { passive:false, capture:true });

    function finishPointer() {
      if (!pointer || navigating) return;
      const state = pointer;
      pointer = null;
      if (!state.locked) { clearProgress(); return; }
      const velocity = state.dx / Math.max(16, performance.now() - state.t);
      const commit = Math.abs(state.dx) > innerWidth * .13 || Math.abs(velocity) > .48;
      if (commit) {
        navigate(state.dx < 0 ? 'next' : 'prev');
        return;
      }
      body.classList.add('era-snapback');
      root.style.setProperty('--era-shift','0px');
      root.style.setProperty('--era-opacity','1');
      setTimeout(clearProgress, 380);
    }

    hero.addEventListener('pointerup', finishPointer, true);
    hero.addEventListener('pointercancel', finishPointer, true);
  }
})();
