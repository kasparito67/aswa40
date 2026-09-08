(()=>{
  const byId=id=>TOPS.find(t=>t.id===id);

  const sci=byId('sci-fi-realiste');
  if(sci){
    sci.hero.image='https://image.tmdb.org/t/p/original/kdjNM3yOwtQkJIwHZPqvyY4p0Ul.jpg';
    sci.hero.position='center 42%';
    sci.hero.titleArt='../assets/header-sci-fi.svg';
    delete sci.hero.line;
    delete sci.hero.em;
  }

  const animation=byId('animation');
  if(animation){
    animation.hero.fit='contain';
    animation.hero.scale=.86;
    animation.hero.position='center center';
    animation.hero.titleArt='../assets/header-animation-01.svg';
    delete animation.hero.line;
    delete animation.hero.em;
  }

  const biopics=byId('biopics');
  if(biopics){
    biopics.hero.fit='contain';
    biopics.hero.scale=.86;
    biopics.hero.position='center center';
    biopics.hero.titleArt='../assets/header-Biopics.svg';
    delete biopics.hero.line;
    delete biopics.hero.em;
  }

  // 2000–2024 keeps the original LOTR title artwork for typography only.
  const era2000=byId('2000-2024');
  if(era2000){
    era2000.hero.titleArt='../assets/header-title.png';
  }
})();
