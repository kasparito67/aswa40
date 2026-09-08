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
    animation.hero.image='https://image.tmdb.org/t/p/original/jkwVCMIkN3j284EPIDIGnskTd69.jpg';
    animation.hero.fit='cover';
    animation.hero.scale=1;
    animation.hero.position='center 42%';
    animation.hero.titleArt='../assets/header-animation-01.svg';
    delete animation.hero.line;
    delete animation.hero.em;
  }

  const biopics=byId('biopics');
  if(biopics){
    biopics.hero.image='https://image.tmdb.org/t/p/original/7TF4p86ZafnxFuNqWdhpHXFO244.jpg';
    biopics.hero.fit='cover';
    biopics.hero.scale=1;
    biopics.hero.position='center 40%';
    biopics.hero.titleArt='../assets/header-Biopics.svg';
    delete biopics.hero.line;
    delete biopics.hero.em;
  }

  const era2000=byId('2000-2024');
  if(era2000){
    era2000.hero.titleArt='../assets/header2000.webp';
    delete era2000.hero.line;
    delete era2000.hero.em;
  }
})();
