(()=>{
  const art=(id,url)=>{
    const screen=document.querySelector(`.era-screen[data-top-id="${id}"]`);
    const title=screen?.querySelector('.hero-title');
    if(!title)return;
    title.innerHTML=`<div class="hero-title-art hero-title-art-final" style="background-image:url('${url}')"></div>`;
  };

  // Final source-of-truth pass: use the supplied title artworks directly.
  // This runs after legacy parity so no earlier script can replace them.
  requestAnimationFrame(()=>{
    art('sci-fi-realiste','../assets/header-sci-fi.svg');
    art('animation','../assets/header-animation-01.svg');
    art('biopics','../assets/header-Biopics.svg');
    art('2000-2024','../assets/header2000.webp');
  });
})();
