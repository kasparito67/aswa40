(()=>{
  if(typeof TOPS==='undefined'||!Array.isArray(TOPS)||TOPS.some(top=>top.id==='films-troublants'))return;

  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const known=new Map();
  TOPS.forEach(top=>{
    [...(top.films||[]),...(top.ghosts||[])].forEach(item=>{
      if(item?.img&&!String(item.img).startsWith('data:')&&!known.has(norm(item.title)))known.set(norm(item.title),item.img);
    });
  });
  const placeholder=title=>`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900"><rect width="600" height="900" fill="#090708"/><path d="M0 690L600 430V900H0Z" fill="#e45264" opacity=".10"/><text x="50%" y="47%" fill="#f3efed" font-family="Arial,sans-serif" font-size="34" font-weight="700" text-anchor="middle">${String(title).replace(/[&<>]/g,'')}</text><text x="50%" y="54%" fill="#9f9294" font-family="Arial,sans-serif" font-size="18" text-anchor="middle">ASWA40 · affiche à venir</text></svg>`)}`;
  const posterFor=title=>known.get(norm(title))||placeholder(title);
  const raw=[
    [1,'Requiem for a Dream',36,'5/6','#1'],
    [2,'Se7en',25,'3/6','#1'],
    [3,'The Blair Witch Project',20,'3/6','#2'],
    [4,'Incendies',15,'2/6','#1'],
    [5,'Oldboy',15,'2/6','#3'],
    [6,'Hereditary',13,'2/6','#3'],
    [7,"Jacob's Ladder",13,'2/6','#4'],
    [8,"Pan's Labyrinth",13,'2/6','#4'],
    [9,'Funny Games',10,'2/6','#5'],
    [10,'Happiness',10,'1/6','#1'],
    [11,'Salò, or the 120 Days of Sodom',10,'1/6','#1'],
    [12,'La Haine',9,'2/6','#3'],
    [13,'Come and See',9,'1/6','#2'],
    [14,'Planet of the Apes',9,'1/6','#2'],
    [15,'The Stuff',9,'1/6','#2'],
    [16,'The Piano Teacher',8,'2/6','#5'],
    [17,'The Sixth Sense',8,'2/6','#6'],
    [18,'Birth',8,'1/6','#3'],
    [19,'The Vanishing',8,'1/6','#3'],
    [20,'The Celebration',7,'2/6','#7'],
    [21,'Beau Is Afraid',7,'1/6','#4'],
    [22,'Grizzly Man',7,'1/6','#4'],
    [23,'Irreversible',7,'1/6','#4'],
    [24,'Alive',6,'1/6','#5'],
    [25,'Fight Club',6,'1/6','#5'],
    [26,'Outbreak',5,'1/6','#6'],
    [27,'The Mist',5,'1/6','#6'],
    [28,'The Zone of Interest',4,'2/6','#9'],
    [29,'American History X',4,'1/6','#7'],
    [30,'Dancer in the Dark',4,'1/6','#7'],
    [31,'Arlington Road',3,'1/6','#8'],
    [32,'I Spit on Your Grave',3,'1/6','#8'],
    [33,'Men',3,'1/6','#8'],
    [34,'Lost Highway',2,'1/6','#9'],
    [35,'The Others',2,'1/6','#9'],
    [36,'The Witch',2,'1/6','#9'],
    [37,'Aftersun',1,'1/6','#10'],
    [38,'Captain Phillips',1,'1/6','#10'],
    [39,'Raw',1,'1/6','#10'],
    [40,'Saw',1,'1/6','#10'],
    [41,'The Dog Who Stopped the War',1,'1/6','#10']
  ];
  const films=raw.map(([rank,title,pts,votes,best])=>({rank,title,pts,votes,best,img:posterFor(title)}));

  const ghosts=[
    ['We Need to Talk About Kevin','0 vote · trauma familial, culpabilité et malaise humain : une absence très naturelle pour cette catégorie.'],
    ['The Act of Killing','0 vote · le réel devient lui-même profondément dérangeant lorsque les bourreaux rejouent leurs actes.'],
    ['Threads','0 vote · un cauchemar nucléaire construit autour du désespoir plutôt que de l’horreur traditionnelle.'],
    ['Caché','0 vote · malaise moral, paranoïa et culpabilité : exactement le territoire trouble que le groupe explore déjà.'],
    ['Dogville','0 vote · cruauté humaine et violence sociale sans recours aux codes classiques de l’horreur.']
  ].map(([title,copy])=>({title,img:posterFor(title),copy}));

  TOPS.push({
    id:'films-troublants',
    label:'Films troublants',
    community:'Une communauté de 6 cinéphiles',
    theme:{accent:'#e45264',secondary:'#ad9ca0',bg:'#080607',panel:'#130d0f'},
    hero:{image:posterFor('Requiem for a Dream'),line:'Top 10',em:'Films troublants',position:'center 38%'},
    films,
    ghosts,
    ovnis:{
      ranks:[11,10,13,14,15,22,23,19],
      comments:{
        11:'Un #1 sans autre vote : le choix le plus radical du groupe.',
        10:'Autre #1 solitaire : malaise social et moral à l’état pur.',
        13:'Un film de guerre transformé en expérience de terreur humaine.',
        14:'Parfait pour une liste construite autour des fins qui frappent fort.',
        15:'L’OVNI tonal : satire, body horror, absurdité et souvenir qui colle.',
        22:'Le documentaire inattendu où le trouble vient du réel.',
        23:'L’inconfort formel et physique poussé à l’extrême.',
        19:'Le malaise froid, méthodique, sans échappatoire émotionnelle.'
      }
    },
    sections:[
      {kicker:'Le palmarès collectif',title:'TOP 10',kind:'top25',count:11},
      {kicker:'Le classement complet',title:'#12–41',kind:'full',start:12,batch:30},
      {kicker:'Aucun vote',title:'Les grands oubliés',kind:'ghosts'},
      {kicker:'Les choix uniques',title:'Les OVNIS',kind:'bottom',count:8}
    ],
    sidebar:[
      {kind:'insight',key:'consensus',icon:'◎',title:'Un champion hors norme',sub:'Requiem · 36 pts · 5/6',bullets:['Requiem for a Dream apparaît dans cinq listes sur six.','Après le podium, aucun film n’est cité par plus de deux personnes.']},
      {kind:'insight',icon:'✦',title:'Le trouble est personnel',sub:'41 films · 60 positions',bullets:['27 films ne sont cités qu’une seule fois.','Seulement 14 titres reviennent au moins deux fois : près des deux tiers des choix sont personnels.']},
      {kind:'insight',icon:'↔',title:'Six façons d’être troublé',sub:'Pas seulement de l’horreur',bullets:['Peur, choc final, malaise moral, violence physique, désespoir et étrangeté cohabitent dans les listes.','Le palmarès fonctionne davantage comme une cartographie du malaise que comme un classement d’horreur.']},
      {kind:'insight',icon:'♡',title:'Cousins cinéphiles',sub:'Simon + Garci · 5 films',bullets:['Simon + Garci est le duo le plus synchronisé avec cinq films en commun.','Claude + Max suivent avec quatre titres partagés.']},
      {kind:'directors',label:'Réalisateurs',title:'4 cinéastes · 2 films chacun',entries:[
        ['David Fincher','Se7en · Fight Club'],
        ['Michael Haneke','Funny Games · The Piano Teacher'],
        ['Ari Aster','Hereditary · Beau Is Afraid'],
        ['Jonathan Glazer','Birth · The Zone of Interest']
      ]}
    ]
  });
})();