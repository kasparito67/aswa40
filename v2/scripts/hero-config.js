(()=>{
  const configs={
    '1975-1999':{
      titleArt:'../assets/header-title-1975-1999.svg',
      titleAlt:'Top films 1975–1999',
      titleMaxWidth:'728px',
      titleOffsetY:'-18px',
      titleFit:'contain'
    },
    '2000-2024':{
      titleArt:'../assets/header-title.png',
      titleAlt:'Top films 2000–2024',
      titleMaxWidth:'1060px',
      titleOffsetY:'-2px',
      titleFit:'contain'
    },
    'sci-fi-realiste':{
      image:'https://image.tmdb.org/t/p/original/kdjNM3yOwtQkJIwHZPqvyY4p0Ul.jpg',
      position:'center 42%',
      fit:'cover',
      scale:1.015,
      titleArt:'../assets/header-sci-fi.svg',
      titleAlt:'Top 25 Sci-fi réalistes et plausibles',
      titleMaxWidth:'920px',
      titleOffsetY:'0px',
      titleFit:'contain'
    },
    'animation':{
      image:'https://image.tmdb.org/t/p/original/jkwVCMIkN3j284EPIDIGnskTd69.jpg',
      position:'center 42%',
      fit:'cover',
      scale:1,
      titleArt:'../assets/header-animation-01.svg',
      titleAlt:'Top 25 Animation',
      titleMaxWidth:'920px',
      titleOffsetY:'0px',
      titleFit:'contain'
    },
    'biopics':{
      image:'https://image.tmdb.org/t/p/original/7TF4p86ZafnxFuNqWdhpHXFO244.jpg',
      position:'center 40%',
      fit:'cover',
      scale:1,
      titleArt:'../assets/header-Biopics.svg',
      titleAlt:'Top Biopics et faits vécus',
      titleMaxWidth:'920px',
      titleOffsetY:'0px',
      titleFit:'contain'
    }
  };

  TOPS.forEach(top=>{
    const config=configs[top.id];
    if(!config)return;
    Object.assign(top.hero,config);
    delete top.hero.line;
    delete top.hero.em;
  });
})();
