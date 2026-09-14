(()=>{
  if(typeof TOPS==='undefined'||!Array.isArray(TOPS)||TOPS.some(top=>top.id==='films-de-guerre'))return;

  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const known=new Map();
  TOPS.forEach(top=>(top.films||[]).forEach(f=>{if(f?.img&&!String(f.img).startsWith('data:'))known.set(norm(f.title),f.img)}));
  const placeholder=title=>`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#20231a"/><stop offset="1" stop-color="#080908"/></linearGradient></defs><rect width="600" height="900" fill="url(#g)"/><path d="M0 650L600 390V900H0Z" fill="#b7a66a" opacity=".13"/><text x="50%" y="47%" fill="#f4f1e8" font-family="Arial,sans-serif" font-size="34" font-weight="700" text-anchor="middle">${String(title).replace(/[&<>]/g,'')}</text><text x="50%" y="54%" fill="#9da18e" font-family="Arial,sans-serif" font-size="18" text-anchor="middle">ASWA40 · affiche à venir</text></svg>`)}`;
  const posterFor=title=>known.get(norm(title))||placeholder(title);
  const raw=[
    [1,'Full Metal Jacket',134,'6/6','#1',1987],[2,'Apocalypse Now',125,'6/6','#1',1979],[3,'Saving Private Ryan',119,'6/6','#1',1998],[4,'The Thin Red Line',119,'6/6','#3',1998],[5,'Inglourious Basterds',110,'6/6','#2',2009],
    [6,"Schindler's List",102,'5/6','#1',1993],[7,'Dunkirk',72,'4/6','#3',2017],[8,'Braveheart',55,'3/6','#7',1995],[9,'The Bridge on the River Kwai',48,'3/6','#5',1957],[10,'Lawrence of Arabia',46,'3/6','#4',1962],
    [11,'Das Boot',41,'2/6','#4',1981],[12,'Life Is Beautiful',38,'2/6','#5',1997],[13,'Barry Lyndon',38,'2/6','#6',1975],[14,'Downfall',36,'3/6','#8',2004],[15,'Platoon',36,'3/6','#11',1986],
    [16,'Paths of Glory',36,'2/6','#2',1957],[17,'The Last of the Mohicans',36,'2/6','#6',1992],[18,'The Pianist',30,'3/6','#7',2002],[19,'The Hurt Locker',29,'3/6','#16',2008],[20,'Zero Dark Thirty',27,'2/6','#10',2012],
    [21,'Black Hawk Down',23,'2/6','#7',2001],[22,'Gladiator',23,'1/6','#3',2000],[23,'Come and See',22,'1/6','#4',1985],[24,'Empire of the Sun',21,'2/6','#15',1987],[25,'The Last Samurai',20,'1/6','#6',2003],
    [26,'Master and Commander: The Far Side of the World',19,'2/6','#8',2003],[27,'1917',18,'2/6','#15',2019],[28,'The Battle of Algiers',18,'1/6','#8',1966],[29,'Bullet in the Head',17,'1/6','#9',1990],[30,'Good Morning, Vietnam',16,'2/6','#11',1987],
    [31,'Glory',15,'1/6','#11',1989],[32,'Kagemusha',15,'1/6','#11',1980],[33,'The Deer Hunter',15,'1/6','#11',1978],[34,'300',14,'1/6','#12',2006],[35,'Army of Shadows',14,'1/6','#12',1969],
    [36,'Blood Diamond',14,'1/6','#12',2006],[37,'Casualties of War',14,'1/6','#12',1989],[38,'Europa Europa',14,'1/6','#12',1990],[39,'Forrest Gump',13,'1/6','#13',1994],[40,'Salvador',13,'1/6','#13',1986],
    [41,'The Patriot',13,'1/6','#13',2000],[42,'Grave of the Fireflies',12,'1/6','#14',1988],[43,'Oppenheimer',12,'1/6','#14',2023],[44,'The Emperor and the Assassin',12,'1/6','#14',1998],[45,'Stalingrad',11,'1/6','#15',1993],
    [46,'Letters from Iwo Jima',10,'1/6','#16',2006],[47,'Darkest Hour',9,'1/6','#17',2017],[48,'The Zone of Interest',8,'2/6','#21',2023],[49,'Born on the Fourth of July',8,'1/6','#18',1989],[50,'Atonement',7,'1/6','#19',2007],
    [51,'The Killing Fields',7,'1/6','#19',1984],[52,'The Big Red One',6,'1/6','#20',1980],[53,'Valkyrie',6,'1/6','#20',2008],[54,"No Man's Land",5,'1/6','#21',2001],[55,'The Great Escape',4,'1/6','#22',1963],
    [56,'The Imitation Game',4,'1/6','#22',2014],[57,'M*A*S*H',3,'1/6','#23',1970],[58,'The Duellists',3,'1/6','#23',1977],[59,'Jarhead',2,'1/6','#24',2005],[60,'Three Kings',2,'1/6','#24',1999]
  ];
  const films=raw.map(([rank,title,pts,votes,best,year])=>({rank,title,pts,votes,best,year:String(year),img:posterFor(title)}));

  // The PDF's #1–60 is the complete set of films that received at least one vote.
  // Forgotten films must therefore be absent from that entire corpus: true 0-vote omissions.
  const forgotten=[
    ['La Grande Illusion','0 vote · un monument du cinéma de guerre classique absent des six listes.'],
    ['All Quiet on the Western Front','0 vote · l’un des grands archétypes du film antimilitariste, totalement absent du corpus.'],
    ['The Best Years of Our Lives','0 vote · la guerre vue par le retour des soldats et ses séquelles, une absence majeure.'],
    ['The Cranes Are Flying','0 vote · classique soviétique majeur, absent malgré la forte présence de la Seconde Guerre mondiale.'],
    ["Ivan's Childhood",'0 vote · Tarkovski et le front de l’Est ne trouvent aucune place dans les choix.'],
    ['Patton','0 vote · grand classique hollywoodien du genre, mais aucun des six ne le cite.'],
    ['The Ascent','0 vote · un autre sommet soviétique de la guerre, entièrement absent des listes.'],
    ['A Bridge Too Far','0 vote · fresque de guerre emblématique qui ne reçoit pourtant aucun vote.']
  ].map(([title,copy])=>({title,img:posterFor(title),copy}));

  const yearStart=1957,yearEnd=2017;
  const bars=Array.from({length:yearEnd-yearStart+1},()=>0);
  films.slice(0,25).forEach(f=>{const y=Number(f.year);if(y>=yearStart&&y<=yearEnd)bars[y-yearStart]++});

  TOPS.push({
    id:'films-de-guerre',
    label:'Films de guerre',
    community:'Une communauté de 6 cinéphiles',
    theme:{accent:'#b7a66a',secondary:'#929783',bg:'#090a08',panel:'#13150f'},
    hero:{image:posterFor('Full Metal Jacket'),line:'Top 25',em:'Films de guerre',position:'center 34%'},
    films,
    ghosts:forgotten,
    ovnis:{
      ranks:[29,32,36,39,43,57],
      comments:{
        29:'John Woo transforme le film de guerre en mélodrame d’action hongkongais. 1 vote, placé #9.',
        32:'Kurosawa déplace la guerre vers le Japon féodal et la fresque de pouvoir. 1 vote, placé #11.',
        36:'Le conflit passe par le thriller d’aventure et la guerre civile plutôt que par le front traditionnel.',
        39:'La guerre n’est qu’un chapitre d’une grande chronique américaine : un choix très périphérique à la catégorie.',
        43:'Un film de guerre presque sans champ de bataille : science, politique et conséquences atomiques prennent le relais.',
        57:'La satire et la comédie noire comme film de guerre. Un seul vote, placé #23.'
      }
    },
    sections:[
      {kicker:'Le palmarès collectif',title:'TOP 25',kind:'top25',count:25},
      {kicker:'Le classement complet',title:'#26–60',kind:'full',start:26,batch:35},
      {kicker:'Aucun vote',title:'Les grands oubliés',kind:'ghosts'},
      {kicker:'Les signatures personnelles',title:'Les OVNIS',kind:'bottom',count:6}
    ],
    sidebar:[
      {kind:'insight',key:'consensus',icon:'◎',title:'Le noyau dur',sub:'4 films · 6/6 votes',bullets:['Full Metal Jacket, Apocalypse Now, Saving Private Ryan et The Thin Red Line sont présents chez les six participants.','Vietnam et Seconde Guerre mondiale dominent le sommet, avec une préférence nette pour la guerre vécue de l’intérieur.']},
      {kind:'insight',icon:'✦',title:'Au plus près du collectif',sub:'Garci + Monette · 15/25 chacun',bullets:['Garci et Monette sont ceux qui placent le plus de films du Top 25 collectif dans leurs listes.','Claude en retrouve 13 sur 16, Simon 13 sur 25, Alex 12 sur 15 et Max 11 sur 12.']},
      {kind:'insight',icon:'♡',title:'Duo cinéphile',sub:'Garci + Monette · 12 films en commun',bullets:['C’est le duo le plus proche du groupe.','Simon + Garci et Simon + Claude partagent chacun 10 films.']},
      {kind:'insight',icon:'↔',title:'Définition large',sub:'Le front n’est pas obligatoire',bullets:["Schindler's List, Life Is Beautiful et Barry Lyndon côtoient Das Boot ou Saving Private Ryan.",'La guerre peut être le combat frontal, mais aussi la force historique qui structure entièrement le destin des personnages.']},
      {kind:'year',label:'Années reines',title:'1957 · 1987 · 1998',sub:'2 films chacune · 2000–2009 = 28%',bars,yearStart,notes:['1957 — The Bridge on the River Kwai · Paths of Glory','1987 — Full Metal Jacket · Empire of the Sun','1998 — Saving Private Ryan · The Thin Red Line','2000–2009 — 7 films sur 25']},
      {kind:'directors',label:'Réalisateurs',title:'Kubrick + Spielberg · 3 films',entries:[['Stanley Kubrick','Full Metal Jacket · Barry Lyndon · Paths of Glory'],['Steven Spielberg',"Saving Private Ryan · Schindler's List · Empire of the Sun"],['David Lean','The Bridge on the River Kwai · Lawrence of Arabia'],['Kathryn Bigelow','The Hurt Locker · Zero Dark Thirty'],['Ridley Scott','Black Hawk Down · Gladiator']]}
    ]
  });
})();
