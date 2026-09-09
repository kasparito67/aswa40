(()=>{
  const screen=document.querySelector('.era-screen[data-top-id="2000-2024"]');
  if(!screen)return;
  screen.classList.add('legacy-2000-parity');

  /* Header metadata parity only. Title artwork, sidebar and modal now render from shared systems. */
  const nav=screen.querySelector('.hero-nav');
  if(nav)nav.innerHTML='<span>Aimer Star Wars à 40 ans</span><span>Une communauté de 9 cinéphiles <small class="build-version" aria-label="Version 0.9.9">v0.9.9</small></span>';
})();
