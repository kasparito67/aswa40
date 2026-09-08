(()=>{
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const known=new Map();
  TOPS.forEach(top=>top.films.forEach(f=>{if(f.img)known.set(norm(f.title),f.img)}));
  const placeholder=title=>`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#171c20"/><stop offset="1" stop-color="#080a0b"/></linearGradient></defs><rect width="600" height="900" fill="url(#g)"/><text x="50%" y="48%" fill="#f4f1eb" font-family="Arial,sans-serif" font-size="38" font-weight="700" text-anchor="middle">${String(title).replace(/[&<>]/g,'')}</text><text x="50%" y="55%" fill="#8c969b" font-family="Arial,sans-serif" font-size="20" text-anchor="middle">ASWA40 · poster à venir</text></svg>`)}`;
  const posterFor=title=>known.get(norm(title))||placeholder(title);
  const makeFilms=raw=>raw.map(x=>({rank:x[0],title:x[1],pts:x[2],votes:x[3],best:x[4],img:posterFor(x[1])}));

  const era1975=TOPS.find(t=>t.id==='1975-1999');
  if(era1975){
    const y=era1975.sidebar.find(x=>x.kind==='year');
    if(y){
      y.label='Années reines';
      y.title='1995 + 1998';
      y.sub='8 films chacune · 1990–1999 = 57%';
      y.notes=['1995 — 8 films','1998 — 8 films','1997 — 7 films','1990–1999 — 57%'];
    }
    const d=era1975.sidebar.find(x=>x.kind==='directors');
    if(d){
      d.label='Réalisateur';
      d.title='Steven Spielberg · 6 films';
      d.faces=['jaws'];
      d.entries=[
        ['Steven Spielberg',"Jaws · E.T. · Schindler's List · Jurassic Park · Saving Private Ryan · Indiana Jones"],
        ['Martin Scorsese','GoodFellas · Taxi Driver · Raging Bull · Casino'],
        ['Stanley Kubrick','The Shining · Full Metal Jacket · Barry Lyndon · Eyes Wide Shut'],
        ['David Fincher','Fight Club · Se7en · The Game'],
        ['Frères Coen','Fargo · The Big Lebowski'],
        ['Akira Kurosawa','Ran · Kagemusha']
      ];
    }
  }

  const era2000=TOPS.find(t=>t.id==='2000-2024');
  if(era2000){
    era2000.hero.titleArt='../assets/header-title.png';
    delete era2000.hero.line;
    delete era2000.hero.em;
  }

  const rawSciFi=[[1,"Children of Men",103,"5/6","#1"],[2,"Gattaca",95,"5/6","#1"],[3,"Blade Runner",94,"4/6","#1"],[4,"A Clockwork Orange",79,"4/6","#2"],[5,"The Matrix",75,"4/6","#3"],[6,"Blade Runner 2049",73,"4/6","#3"],[7,"Her",67,"5/6","#9"],[8,"Ex Machina",64,"4/6","#2"],[9,"Minority Report",61,"5/6","#10"],[10,"The Martian",61,"4/6","#8"],[11,"28 Days Later",60,"3/6","#1"],[12,"2001: A Space Odyssey",56,"3/6","#1"],[13,"Jurassic Park",55,"3/6","#5"],[14,"Ghost in the Shell",54,"3/6","#7"],[15,"The Truman Show",47,"3/6","#5"],[16,"WALL-E",44,"4/6","#9"],[17,"Akira",43,"2/6","#2"],[18,"Moon",42,"3/6","#7"],[19,"RoboCop",39,"3/6","#4"],[20,"Mad Max: Fury Road",37,"2/6","#7"],[21,"Eternal Sunshine of the Spotless Mind",33,"3/6","#11"],[22,"Gravity",30,"2/6","#9"],[23,"Never Let Me Go",29,"2/6","#3"],[24,"Snowpiercer",27,"4/6","#17"],[25,"A.I. Artificial Intelligence",27,"3/6","#6"],[26,"Brazil",25,"2/6","#2"],[27,"Inception",25,"2/6","#9"],[28,"12 Monkeys",23,"2/6","#14"],[29,"Contact",22,"1/6","#4"],[30,"Terminator 2: Judgment Day",22,"1/6","#4"],[31,"Interstellar",21,"1/6","#5"],[32,"Signs",21,"1/6","#5"],[33,"Strange Days",20,"4/6","#16"],[34,"Dune",20,"1/6","#6"],[35,"Dune: Part Two",19,"1/6","#7"],[36,"Rise of the Planet of the Apes",18,"2/6","#13"],[37,"E.T. the Extra-Terrestrial",18,"1/6","#8"],[38,"Mars Express",18,"1/6","#8"],[39,"The Running Man",17,"2/6","#11"],[40,"Total Recall",16,"1/6","#10"],[41,"1984",14,"1/6","#12"],[42,"Weird Science",14,"1/6","#12"],[43,"Event Horizon",13,"1/6","#13"],[44,"Dredd",12,"2/6","#15"],[45,"V for Vendetta",12,"2/6","#19"],[46,"Super 8",12,"1/6","#14"],[47,"Upgrade",12,"1/6","#14"],[48,"Contagion",11,"1/6","#15"],[49,"Metropolis",10,"2/6","#18"],[50,"Idiocracy",9,"1/6","#17"],[51,"The Road",9,"1/6","#17"],[52,"Escape from New York",8,"2/6","#20"],[53,"Armageddon",8,"1/6","#18"],[54,"The Mitchells vs. the Machines",8,"1/6","#18"],[55,"Possessor",7,"1/6","#19"],[56,"Ready Player One",7,"1/6","#19"],[57,"Ad Astra",5,"1/6","#21"],[58,"Invasion of the Body Snatchers",5,"1/6","#21"],[59,"Soylent Green",4,"1/6","#22"],[60,"Sunshine",4,"1/6","#22"],[61,"Don't Look Up",3,"1/6","#23"],[62,"THX 1138",3,"1/6","#23"],[63,"Mad Max 2: The Road Warrior",2,"1/6","#24"],[64,"I Am Mother",1,"1/6","#25"],[65,"Rollerball",1,"1/6","#25"],[66,"The Fly",1,"1/6","#25"]];
  const rawAnimation=[[1,"Akira",102,"5/7","#1"],[2,"Spirited Away",99,"5/7","#1"],[3,"Spider-Man: Into the Spider-Verse",92,"6/7","#3"],[4,"The Nightmare Before Christmas",87,"5/7","#3"],[5,"Toy Story",86,"5/7","#3"],[6,"Ghost in the Shell",79,"5/7","#1"],[7,"Princess Mononoke",78,"4/7","#4"],[8,"My Neighbor Totoro",74,"4/7","#1"],[9,"Les Douze Travaux d’Astérix",70,"5/7","#4"],[10,"The Lion King",65,"4/7","#5"],[11,"Fantastic Mr. Fox",61,"5/7","#2"],[12,"Le Roi et l’Oiseau",61,"4/7","#7"],[13,"Who Framed Roger Rabbit",56,"4/7","#3"],[14,"Ratatouille",52,"4/7","#5"],[15,"Toy Story 2",46,"2/7","#2"],[16,"Paprika",44,"4/7","#6"],[17,"Les Triplettes de Belleville",44,"3/7","#5"],[18,"WALL-E",41,"5/7","#13"],[19,"Cars",41,"3/7","#8"],[20,"The Iron Giant",40,"3/7","#6"],[21,"Toy Story 3",37,"3/7","#11"],[22,"The Incredibles",36,"3/7","#7"],[23,"Castle in the Sky",29,"2/7","#2"],[24,"Inside Out",28,"3/7","#14"],[25,"Spider-Man: Across the Spider-Verse",28,"2/7","#10"],[26,"L’Homme qui plantait des arbres",25,"1/7","#1"],[27,"The Land Before Time",25,"1/7","#1"],[28,"Howl’s Moving Castle",24,"2/7","#5"],[29,"Finding Nemo",24,"2/7","#12"],[30,"Peter Pan",24,"1/7","#2"],[31,"Ninja Scroll",23,"1/7","#3"],[32,"Rango",22,"2/7","#14"],[33,"Grave of the Fireflies",22,"1/7","#4"],[34,"Tekkonkinkreet",22,"1/7","#4"],[35,"Aladdin",20,"2/7","#9"],[36,"Batman: Mask of the Phantasm",20,"1/7","#6"],[37,"Kiki’s Delivery Service",20,"1/7","#6"],[38,"The Animatrix",20,"1/7","#6"],[39,"Pinocchio",19,"1/7","#7"],[40,"Mars Express",18,"2/7","#17"],[41,"LE...K",18,"1/7","#8"],[42,"Memories",18,"1/7","#8"],[43,"Perfect Blue",18,"1/7","#8"],[44,"Ponyo",18,"1/7","#8"],[45,"Astérix chez les Bretons",17,"1/7","#9"],[46,"Coraline",17,"1/7","#9"],[47,"Isle of Dogs",17,"1/7","#9"],[48,"The Adventures of Tintin",17,"1/7","#9"],[49,"The Boy and the Beast",16,"1/7","#10"],[50,"The Lord of the Rings",16,"1/7","#10"],[51,"Dragon Ball Z: Broly - Second Coming",14,"1/7","#12"],[52,"Metropolis",14,"1/7","#12"],[53,"Kung Fu Panda",13,"2/7","#17"],[54,"The Great Mouse Detective",13,"1/7","#13"],[55,"Persepolis",12,"2/7","#15"],[56,"The Lego Movie",12,"2/7","#17"],[57,"Cowboy Bebop: The Movie",12,"1/7","#14"],[58,"Flow",12,"1/7","#14"],[59,"How to Train Your Dragon 2",11,"1/7","#15"],[60,"Klaus",11,"1/7","#15"],[61,"Nausicaä of the Valley of the Wind",11,"1/7","#15"],[62,"Up",11,"1/7","#15"],[63,"Chicken Run",10,"2/7","#17"],[64,"The Simpsons Movie",10,"2/7","#19"],[65,"La Planète sauvage",10,"1/7","#16"],[66,"The Snowman",10,"1/7","#16"],[67,"Shrek",9,"2/7","#21"],[68,"Monsters, Inc.",9,"1/7","#17"],[69,"Waltz with Bashir",8,"2/7","#22"],[70,"Kubo and the Two Strings",8,"1/7","#18"],[71,"Lascars",8,"1/7","#18"],[72,"A Close Shave",7,"1/7","#19"],[73,"Astérix et Cléopâtre",7,"1/7","#19"],[74,"Shrek 2",7,"1/7","#19"],[75,"Sleeping Beauty",6,"1/7","#20"],[76,"South Park: Bigger, Longer & Uncut",6,"1/7","#20"],[77,"The Mitchells vs. the Machines",5,"1/7","#21"],[78,"Yellow Submarine",5,"1/7","#21"],[79,"The Emperor’s New Groove",4,"1/7","#22"],[80,"The Swan Princess",4,"1/7","#22"],[81,"Aladdin and the Wonderful Lamp",3,"1/7","#23"],[82,"Robot Carnival",3,"1/7","#23"],[83,"Zootopia",3,"1/7","#23"],[84,"Mary and Max",2,"1/7","#24"],[85,"Robin Hood",2,"1/7","#24"],[86,"Steamboy",2,"1/7","#24"],[87,"Team America: World Police",2,"1/7","#24"],[88,"L’Illusionniste",1,"1/7","#25"],[89,"Magnificent Life",1,"1/7","#25"],[90,"The Story of Jean Valjean",1,"1/7","#25"]];
  const rawBiopic=[[1,"GoodFellas",76,"6/8","#1"],[2,"Schindler's List",74,"6/8","#1"],[3,"The Social Network",68,"6/8","#2"],[4,"Catch Me If You Can",42,"3/8","#1"],[5,"Moneyball",40,"6/8","#5"],[6,"Amadeus",38,"3/8","#1"],[7,"Lawrence of Arabia",36,"3/8","#2"],[8,"Raging Bull",34,"4/8","#5"],[9,"The Wolf of Wall Street",33,"4/8","#6"],[10,"Oppenheimer",31,"4/8","#4"],[11,"The Insider",31,"4/8","#6"],[12,"Erin Brockovich",26,"4/8","#4"],[13,"Donnie Brasco",19,"2/8","#3"],[14,"Lion",18,"2/8","#7"],[15,"Malcolm X",17,"2/8","#3"],[16,"Man on the Moon",16,"2/8","#2"],[17,"The Assassination of Jesse James by the Coward Robert Ford",16,"2/8","#7"],[18,"Vice",15,"1/8","#1"],[19,"Blow",14,"1/8","#2"],[20,"Intouchables",13,"2/8","#5"],[21,"Downfall",13,"2/8","#6"],[22,"12 Years a Slave",13,"1/8","#3"],[23,"All the President's Men",12,"1/8","#4"],[24,"Milk",12,"1/8","#4"],[25,"Mishima: A Life in Four Chapters",12,"1/8","#4"],[26,"The Iceman",12,"1/8","#4"],[27,"The Aviator",11,"2/8","#9"],[28,"Serpico",11,"2/8","#10"],[29,"Daaaaaalí!",11,"1/8","#5"],[30,"In the Name of the Father",11,"1/8","#5"],[31,"The Killing Fields",11,"1/8","#5"],[32,"Walk the Line",11,"1/8","#5"],[33,"The King's Speech",10,"2/8","#10"],[34,"The Elephant Man",10,"1/8","#6"],[35,"The Theory of Everything",10,"1/8","#6"],[36,"The Pianist",9,"2/8","#8"],[37,"I'm Not There",9,"1/8","#7"],[38,"Cinderella Man",8,"1/8","#8"],[39,"The Diving Bell and the Butterfly",8,"1/8","#8"],[40,"8 Mile",7,"1/8","#9"],[41,"A Beautiful Mind",7,"1/8","#9"],[42,"The Last Emperor",7,"1/8","#9"],[43,"Control",6,"1/8","#10"],[44,"Born on the Fourth of July",5,"1/8","#11"],[45,"Mesrine: Public Enemy No. 1",5,"1/8","#11"],[46,"The Doors",5,"1/8","#11"],[47,"The Imitation Game",5,"1/8","#11"],[48,"The Revenant",5,"1/8","#11"],[49,"Braveheart",4,"2/8","#13"],[50,"Behind the Candelabra",4,"1/8","#12"],[51,"Dead Man Walking",4,"1/8","#12"],[52,"The Motorcycle Diaries",4,"1/8","#12"],[53,"American Splendor",3,"1/8","#13"],[54,"Hunger",3,"1/8","#13"],[55,"Into the Wild",3,"1/8","#13"],[56,"JFK",3,"1/8","#13"],[57,"Midnight Express",3,"1/8","#13"],[58,"The Disaster Artist",3,"1/8","#13"],[59,"Ed Wood",2,"1/8","#14"],[60,"Gainsbourg: A Heroic Life",2,"1/8","#14"],[61,"Ray",2,"1/8","#14"],[62,"Sully",2,"1/8","#14"],[63,"Dallas Buyers Club",1,"1/8","#15"],[64,"Nouvelle Vague",1,"1/8","#15"],[65,"The Big Short",1,"1/8","#15"],[66,"Violeta Went to Heaven",1,"1/8","#15"],[67,"Wyatt Earp",1,"1/8","#15"]];

  TOPS.push(
    {
      id:'sci-fi-realiste',label:'Sci-fi réalistes',community:'Une communauté de 6 cinéphiles',
      theme:{accent:'#55d7c5',secondary:'#95aeb4',bg:'#070b0c',panel:'#0d1416'},
      hero:{image:posterFor('Children of Men'),line:'Top 25',em:'Sci-fi réalistes / plausibles',position:'center 35%'},
      films:makeFilms(rawSciFi),ghosts:[],
      sections:[
        {kicker:'Le palmarès collectif',title:'TOP 25',kind:'top25'},
        {kicker:'Le classement complet',title:'#26–66',kind:'full',start:26,batch:20}
      ],
      sidebar:[
        {kind:'insight',icon:'◎',title:'Monsieur Consensus',sub:'Max · 19 films du Top 25',bullets:['19 de ses 25 films se retrouvent dans le Top 25 collectif.','Garci, Simon, Alex et Monette en placent chacun 16.']},
        {kind:'insight',icon:'♡',title:'Duo cinéphile',sub:'Max + Monette · 15 en commun',bullets:['C’est le duo le plus proche de cette catégorie.','Alex + Max suivent avec 14 films en commun.']},
        {kind:'insight',icon:'◇',title:'OVNI',sub:'Vincent · 8 choix uniques sur 15',bullets:['Contact, Signs, Dune, Dune: Part Two, E.T., Total Recall, Weird Science et Super 8 sont uniques à sa liste.']},
        {kind:'year',label:'Année reine',title:'2013',sub:'3 films · 2010–2019 = 32%',bars:[1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,0,0,0,0,1,0,1,0,1,1,1,0,1,2,0,1,0,1,0,1,1,1,0,0,3,1,2,0,1],yearStart:1968,notes:['2013 — Her · Gravity · Snowpiercer','2002 — 2 films','2015 — 2 films','2010–2019 — 8 films sur 25']},
        {kind:'directors',label:'Réalisateur',title:'Steven Spielberg · 3 films',faces:['jurassic-park'],entries:[['Steven Spielberg','Minority Report · Jurassic Park · A.I. Artificial Intelligence'],['Stanley Kubrick','A Clockwork Orange · 2001: A Space Odyssey'],['Alfonso Cuarón','Children of Men · Gravity'],['Ridley Scott','Blade Runner · The Martian'],['Denis Villeneuve','Blade Runner 2049']]}
      ]
    },
    {
      id:'animation',label:'Animation',community:'Une communauté de 7 cinéphiles',
      theme:{accent:'#ffb43b',secondary:'#f06b6b',bg:'#090908',panel:'#14120e'},
      hero:{image:posterFor('Akira'),line:'Top 25',em:'Animation',position:'center 30%'},
      films:makeFilms(rawAnimation),ghosts:[],
      sections:[
        {kicker:'Le palmarès collectif',title:'TOP 25',kind:'top25'},
        {kicker:'Le classement complet',title:'#26–90',kind:'full',start:26,batch:25}
      ],
      sidebar:[
        {kind:'insight',icon:'◎',title:'Monsieur Consensus',sub:'Max · 19 films du Top 25',bullets:['Max est nettement le plus près du canon collectif.','Il ne compte que 3 choix uniques.']},
        {kind:'insight',icon:'♡',title:'Duo cinéphile',sub:'Garci + Max · 13 en commun',bullets:['Garci + Max partagent 13 films.','Alex + Max atteignent eux aussi 13 films en commun.']},
        {kind:'insight',icon:'◇',title:'OVNI officiel',sub:'Quentin · 13 choix uniques',bullets:['Seulement 9 de ses 25 films atteignent le Top 25 collectif.','Batman: Mask of the Phantasm, Tekkonkinkreet, Cowboy Bebop, Dragon Ball Z, Lascars et South Park illustrent cette singularité.']},
        {kind:'year',label:'Année reine',title:'1988',sub:'3 films · 2000–2009 = 32%',bars:[1,0,0,0,1,0,0,0,0,0,1,0,3,0,0,0,0,1,1,2,0,1,0,2,0,1,0,1,1,0,2,1,1,1,1,0,0,0,0,1,0,0,1,0,0,0,0,1],yearStart:1976,notes:['1988 — Akira · My Neighbor Totoro · Who Framed Roger Rabbit','1995 — 2 films','1999 — 2 films','2000–2009 — 8 films sur 25']},
        {kind:'directors',label:'Réalisateur',title:'Hayao Miyazaki · 4 films',faces:['princess-mononoke'],entries:[['Hayao Miyazaki','Spirited Away · Princess Mononoke · My Neighbor Totoro · Castle in the Sky'],['Brad Bird','Ratatouille · The Iron Giant · The Incredibles'],['John Lasseter','Toy Story · Toy Story 2 · Cars'],['Satoshi Kon','Paprika'],['Katsuhiro Otomo','Akira']]}
      ]
    },
    {
      id:'biopics',label:'Biopics / faits vécus',community:'Une communauté de 8 cinéphiles',
      theme:{accent:'#d9b06f',secondary:'#9d8b76',bg:'#0b0a09',panel:'#15120f'},
      hero:{image:posterFor('GoodFellas'),line:'Top 15',em:'Biopics / faits vécus',position:'center 28%'},
      films:makeFilms(rawBiopic),ghosts:[],
      sections:[
        {kicker:'Le palmarès collectif',title:'TOP 15',kind:'top25'},
        {kicker:'Le classement complet',title:'#16–67',kind:'full',start:16,batch:20}
      ],
      sidebar:[
        {kind:'insight',icon:'◎',title:'Monsieur Consensus',sub:'Max · 11 films du Top 15',bullets:['Max possède la liste la plus centrale de la catégorie.','GoodFellas, Social Network, Schindler, Raging Bull, Oppenheimer, Wolf, Moneyball et Insider structurent son noyau.']},
        {kind:'insight',icon:'♡',title:'Duo cinéphile',sub:'Max + Monette · 8 en commun',bullets:['C’est le plus gros chevauchement du groupe.','Leur terrain commun est particulièrement canonique.']},
        {kind:'insight',icon:'◇',title:'OVNI',sub:'Quentin · 10 choix uniques',bullets:['Quentin détient le record de choix uniques.','Garci suit avec 9 choix uniques et une liste plus auteuriste et internationale.']},
        {kind:'year',label:'Décennie reine',title:'1990–1999',sub:'5 films · 33% du Top 15',bars:[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,1,1,0,0,0,1,0,1,1,0,1,0,0,0,0,0,0,0,1,1,0,1,0,0,1,0,0,0,0,0,0,1],yearStart:1962,notes:['1990 — GoodFellas','1992 — Malcolm X','1993 — Schindler’s List','1997 — Donnie Brasco','1999 — The Insider']},
        {kind:'directors',label:'Réalisateur',title:'Martin Scorsese · 3 films',faces:['goodfellas'],entries:[['Martin Scorsese','GoodFellas · Raging Bull · The Wolf of Wall Street'],['Steven Spielberg',"Schindler's List · Catch Me If You Can"],['David Fincher','The Social Network'],['Christopher Nolan','Oppenheimer'],['Michael Mann','The Insider']]}
      ]
    }
  );
})();
