(()=>{
  const art=(id,url)=>{
    const screen=document.querySelector(`.era-screen[data-top-id="${id}"]`);
    const title=screen?.querySelector('.hero-title');
    if(!title)return;
    title.innerHTML=`<div class="hero-title-art hero-title-art-final" style="background-image:url('${url}')"></div>`;
  };

  // Run after legacy parity so nothing can overwrite the final title artwork.
  requestAnimationFrame(()=>{
    art('animation','../assets/header-animation-clean.svg');
    art('2000-2024','../assets/header2000.webp');
  });
})();
