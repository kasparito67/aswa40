const TOPS = [
  {
    id:'1975-1999',
    label:'1975–1999',
    community:'Une communauté de 7 cinéphiles',
    hero:{image:'../assets/cinema-hero-1975-1999.jpg',titleArt:'../assets/header-title-1975-1999.svg'},
    sections:[
      {kicker:'Les gros scoreurs',title:'TOP 25',kind:'ranking'},
      {kicker:'Le classement complet',title:'#26–90',kind:'placeholder',copy:'Le classement complet sera branché à partir du dataset final.'},
      {kicker:'Aucun vote',title:'Les grands oubliés',kind:'placeholder',copy:'Blue Velvet · The Deer Hunter · Network · Brazil · Do the Right Thing · The Thing · Before Sunrise'},
      {kicker:'Les bons derniers',title:'Les OVNIS',kind:'placeholder',copy:'Les films singuliers du bas du classement seront reconnectés ici.'}
    ],
    insights:[
      {icon:'⌁',title:'A Galaxy far away',sub:'Un n°1 que personne ne met en n°1',detail:'Star Wars termine #1 collectivement sans être le #1 de personne. 6 cinéphiles sur 7 le choisissent et son meilleur rang individuel est #2.'},
      {icon:'◎',title:'Le barycentre',sub:'Max · 15 films du Top 25',detail:'Max est le centre de gravité du groupe. 15 de ses 25 choix figurent dans le Top 25 collectif. Simon suit avec 14.'},
      {icon:'♡',title:'Duo cinéphile',sub:'Max + Simon · 13 en commun',detail:'Max + Simon partagent 13 films ou franchises, le duo le plus proche du canon collectif.'},
      {icon:'◇',title:"L'explorateur",sub:'Monette · 10 choix uniques',detail:'Monette compte 10 choix uniques. Beverly Hills Cop : seul vote, classé #1. Titanic ne compte lui aussi qu’un seul vote.'},
      {icon:'◷',title:'1999',sub:'Années phares · Fight Club · The Matrix',detail:'1990–1999 représente 57% du classement. 1995 et 1998 sont les années les plus denses avec 8 films.'},
      {icon:'◉',title:'Spielberg mène la marche',sub:'Réalisateurs',detail:"Jaws · E.T. · Schindler's List · Jurassic Park · Saving Private Ryan · Indiana Jones"}
    ],
    films:[
      [1,'Star Wars',131,'6/7','#2','star-wars'],[2,'Apocalypse Now',91,'4/7','#1','apocalypse-now'],[3,'Indiana Jones',84,'5/7','#3','indiana-jones'],[4,'Pulp Fiction',80,'5/7','#3','pulp-fiction'],[5,'Fargo',67,'5/7','#4','fargo'],[6,'Blade Runner',62,'4/7','#1','blade-runner'],[7,'GoodFellas',60,'4/7','#2','goodfellas'],[8,'Back to the Future',55,'3/7','#2','back-to-the-future'],[9,'Fight Club',55,'3/7','#2','fight-club'],[10,'The Matrix',49,'4/7','#5','the-matrix'],[11,'The Shining',49,'3/7','#8','the-shining'],[12,'The Shawshank Redemption',48,'3/7','#1','the-shawshank-redemption'],[13,"Schindler's List",47,'5/7','#13','schindlers-list'],[14,'The Big Lebowski',44,'3/7','#4','the-big-lebowski'],[15,'Taxi Driver',44,'2/7','#1','taxi-driver'],[16,'Se7en',43,'3/7','#1','se7en'],[17,'The Dinner Game',40,'3/7','#7','the-dinner-game'],[18,'Alien',39,'3/7','#4','alien'],[19,'Jaws',37,'4/7','#5','jaws'],[20,'Toy Story',36,'3/7','#8','toy-story'],[21,'Terminator 2: Judgment Day',35,'3/7','#12','terminator-2'],[22,'Full Metal Jacket',33,'2/7','#8','full-metal-jacket'],[23,'Groundhog Day',32,'2/7','#7','groundhog-day'],[24,'Jurassic Park',31,'3/7','#13','jurassic-park'],[25,"All the President's Men",28,'2/7','#2','all-the-presidents-men']
    ].map(f=>({rank:f[0],title:f[1],pts:f[2],votes:f[3],best:f[4],img:`../assets/posters/1975-1999/${f[5]}.jpg`}))
  },
  {
    id:'2000-2024',
    label:'2000–2024',
    community:'Une communauté de 9 cinéphiles',
    hero:{image:'../assets/cinema-hero.jpg',line:'Top films',em:'2000–2024'},
    sections:[
      {kicker:'Les gros scoreurs',title:'TOP 25',kind:'ranking'},
      {kicker:'Le classement complet',title:'#25–135',kind:'placeholder',copy:'Le classement complet et son reveal progressif seront reconnectés depuis les données legacy.'},
      {kicker:'Aucun vote',title:'Les grands oubliés',kind:'placeholder',copy:'Les grands oubliés seront branchés comme dataset autonome.'},
      {kicker:'Les bons derniers',title:'Les OVNIS',kind:'placeholder',copy:'Les OVNIS conservent leur section dédiée dans le moteur commun.'}
    ],
    insights:[
      {icon:'◎',title:'Consensus',sub:'Le canon collectif',detail:'Insight collectif du Top 2000–2024 à reconnecter depuis la version finale legacy.'},
      {icon:'♡',title:'Duo cinéphile',sub:'Les goûts qui se croisent',detail:'Cette carte utilisera le contenu exact de la sidebar finale.'},
      {icon:'◇',title:'L’explorateur',sub:'Les choix les plus singuliers',detail:'La structure permet des insights différents pour chaque top sans modifier les composants.'}
    ],
    films:[
      [1,'Lord of the Rings',164,'8/9','#1','001-lord-of-the-rings.jpg'],[2,'Inglourious Basterds',111,'7/9','#1','002-inglourious-basterds.jpg'],[3,'Spirited Away',79,'4/9','#2','003-spirited-away.jpg'],[4,'The Social Network',71,'4/9','#1','004-the-social-network.jpg'],[5,'Christopher Nolan’s Batman',62,'4/9','#1','005-christopher-nolan-s-batman.jpg'],[6,'The Departed',61,'4/9','#7','006-the-departed.jpg'],[7,'Lost in Translation',59,'5/9','#5','007-lost-in-translation.jpg'],[8,'Amélie',57,'5/9','#3','008-amelie.jpg'],[9,'Gladiator',54,'3/9','#2','009-gladiator.jpg'],[10,'Kill Bill',51,'4/9','#9','010-kill-bill.jpg'],[11,'Crouching Tiger, Hidden Dragon',51,'3/9','#3','011-crouching-tiger-hidden-dragon.jpg'],[12,'Requiem for a Dream',48,'2/9','#2','012-requiem-for-a-dream.jpg'],[13,'Catch Me If You Can',47,'3/9','#8','013-catch-me-if-you-can.jpg'],[14,'Sideways',44,'3/9','#6','014-sideways.jpg'],[15,'City of God',43,'3/9','#5','015-city-of-god.jpg'],[16,'Snatch',42,'2/9','#3','016-snatch.jpg'],[17,'Shaun of the Dead',39,'2/9','#2','017-shaun-of-the-dead.jpg'],[18,'Black Hawk Down',39,'2/9','#5','018-black-hawk-down.jpg'],[19,'Dune',38,'5/9','#10','019-dune.jpg'],[20,'A Prophet',38,'3/9','#10','020-a-prophet.jpg'],[21,'The Wolf of Wall Street',38,'3/9','#10','021-the-wolf-of-wall-street.jpg'],[22,'Slumdog Millionaire',37,'2/9','#4','022-slumdog-millionaire.jpg'],[23,'Children of Men',35,'2/9','#4','023-children-of-men.jpg'],[24,'Inception',33,'2/9','#6','024-inception.jpg'],[25,'The King’s Speech',32,'2/9','#6','025-the-king-s-speech.jpg']
    ].map(f=>({rank:f[0],title:f[1],pts:f[2],votes:f[3],best:f[4],img:`../assets/posters/2000-2024/${f[5]}`}))
  }
];
