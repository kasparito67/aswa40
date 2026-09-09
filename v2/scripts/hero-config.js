(()=>{
  const configs={
    '1975-1999':{
      titleArt:'../assets/header-1975-1999-normalized.svg',
      titleAlt:'Top films 1975–1999'
    },
    '2000-2024':{
      titleArt:'../assets/header-title.png',
      titleAlt:'Top films 2000–2024'
    },
    'sci-fi-realiste':{
      image:'https://image.tmdb.org/t/p/original/kdjNM3yOwtQkJIwHZPqvyY4p0Ul.jpg',
      position:'center 42%',
      fit:'cover',
      scale:1.015,
      titleArt:'../assets/header-sci-fi-realiste-normalized.svg',
      titleAlt:'Top 25 Sci-fi réalistes et plausibles'
    },
    'animation':{
      image:'https://image.tmdb.org/t/p/original/jkwVCMIkN3j284EPIDIGnskTd69.jpg',
      position:'center 42%',
      fit:'cover',
      scale:1,
      titleArt:'../assets/header-animation-normalized.svg',
      titleAlt:'Top 25 Animation'
    },
    'biopics':{
      image:'https://image.tmdb.org/t/p/original/7TF4p86ZafnxFuNqWdhpHXFO244.jpg',
      position:'center 40%',
      fit:'cover',
      scale:1,
      titleArt:'../assets/header-biopics-normalized.svg',
      titleAlt:'Top Biopics et faits vécus'
    }
  };

  TOPS.forEach(top=>{
    const config=configs[top.id];
    if(!config)return;
    Object.assign(top.hero,config);
    delete top.hero.line;
    delete top.hero.em;
    delete top.hero.titleMaxWidth;
    delete top.hero.titleOffsetY;
    delete top.hero.titleFit;
  });
})();
