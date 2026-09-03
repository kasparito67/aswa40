const ASSET = '../assets/';
const path2000 = value => value ? `../${value}` : '';
const canonical2000Films = films.map(f => ({...f,img:path2000(f.img)}));
const canonical2000Ghosts = ghosts.map(g => ({title:g[0],copy:g[1],img:path2000(g[2])}));

const raw1975 = [
[1,'Star Wars',131,'6/7','#2','star-wars'],[2,'Apocalypse Now',91,'4/7','#1','apocalypse-now'],[3,'Indiana Jones',84,'5/7','#3','indiana-jones'],[4,'Pulp Fiction',80,'5/7','#3','pulp-fiction'],[5,'Fargo',67,'5/7','#4','fargo'],[6,'Blade Runner',62,'4/7','#1','blade-runner'],[7,'GoodFellas',60,'4/7','#2','goodfellas'],[8,'Back to the Future',55,'3/7','#2','back-to-the-future'],[9,'Fight Club',55,'3/7','#2','fight-club'],[10,'The Matrix',49,'4/7','#5','the-matrix'],[11,'The Shining',49,'3/7','#8','the-shining'],[12,'The Shawshank Redemption',48,'3/7','#1','the-shawshank-redemption'],[13,"Schindler's List",47,'5/7','#13','schindlers-list'],[14,'The Big Lebowski',44,'3/7','#4','the-big-lebowski'],[15,'Taxi Driver',44,'2/7','#1','taxi-driver'],[16,'Se7en',43,'3/7','#1','se7en'],[17,'The Dinner Game',40,'3/7','#7','the-dinner-game'],[18,'Alien',39,'3/7','#4','alien'],[19,'Jaws',37,'4/7','#5','jaws'],[20,'Toy Story',36,'3/7','#8','toy-story'],[21,'Terminator 2: Judgment Day',35,'3/7','#12','terminator-2'],[22,'Full Metal Jacket',33,'2/7','#8','full-metal-jacket'],[23,'Groundhog Day',32,'2/7','#7','groundhog-day'],[24,'Jurassic Park',31,'3/7','#13','jurassic-park'],[25,"All the President's Men",28,'2/7','#2','all-the-presidents-men'],[26,'Heat',27,'2/7','#6','heat'],[27,'Princess Mononoke',25,'2/7','#7','princess-mononoke'],[28,'Léon: The Professional',25,'2/7','#12','leon-the-professional'],[29,'Beverly Hills Cop',25,'1/7','#1','beverly-hills-cop'],[30,"One Flew Over the Cuckoo's Nest",25,'1/7','#1','one-flew-over-the-cuckoos-nest'],[31,'Trainspotting',24,'3/7','#9','trainspotting'],[32,'E.T. the Extra-Terrestrial',24,'2/7','#7','et-the-extra-terrestrial'],[33,'Jesus of Nazareth',24,'1/7','#2','jesus-of-nazareth'],[34,'The Sacrifice',24,'1/7','#2','the-sacrifice'],[35,'Forrest Gump',23,'2/7','#13','forrest-gump'],[36,'In the Mood for Love',23,'1/7','#3','in-the-mood-for-love'],[37,'La Haine',22,'3/7','#17','la-haine'],[38,'Manhattan',22,'1/7','#4','manhattan'],[39,'Ran',22,'1/7','#4','ran'],[40,'Akira',21,'3/7','#9','akira'],[41,'The Silence of the Lambs',21,'3/7','#17','the-silence-of-the-lambs'],[42,'Dead Poets Society',21,'1/7','#5','dead-poets-society'],[43,'Kagemusha',21,'1/7','#5','kagemusha'],[44,'The Thin Red Line',20,'3/7','#9','the-thin-red-line'],[45,'Titanic',20,'1/7','#6','titanic'],[46,'Das Boot',19,'1/7','#7','das-boot'],[47,'Scarface',19,'1/7','#7','scarface'],[48,'Barry Lyndon',18,'1/7','#8','barry-lyndon'],[49,'The Cook, the Thief, His Wife & Her Lover',18,'1/7','#8','the-cook-the-thief-his-wife-and-her-lover'],[50,'Tombstone',18,'1/7','#8','tombstone'],[51,'The Big Chill',17,'1/7','#9','the-big-chill'],[52,'The Usual Suspects',17,'1/7','#9','the-usual-suspects'],[53,'The Nightmare Before Christmas',16,'3/7','#19','the-nightmare-before-christmas'],[54,'Misery',16,'1/7','#10','misery'],[55,'Raging Bull',16,'1/7','#10','raging-bull'],[56,'The Breakfast Club',16,'1/7','#10','the-breakfast-club'],[57,'Eyes Wide Shut',15,'1/7','#11','eyes-wide-shut'],[58,'Planes, Trains and Automobiles',15,'1/7','#11','planes-trains-and-automobiles'],[59,'The Killer',15,'1/7','#11','the-killer'],[60,'Saving Private Ryan',14,'2/7','#15','saving-private-ryan'],[61,'Die Hard',14,'2/7','#18','die-hard'],[62,'Cinema Paradiso',14,'1/7','#12','cinema-paradiso'],[63,'The Fifth Element',14,'1/7','#12','the-fifth-element'],[64,'Man Bites Dog',13,'1/7','#13','man-bites-dog'],[65,'Amadeus',12,'1/7','#14','amadeus'],[66,'Delicatessen',12,'1/7','#14','delicatessen'],[67,'Europa',12,'1/7','#14','europa'],[68,'Good Morning, Vietnam',12,'1/7','#14','good-morning-vietnam'],[69,'My Neighbor Totoro',12,'1/7','#14','my-neighbor-totoro'],[70,'Good Will Hunting',11,'2/7','#17','good-will-hunting'],[71,'Casino',11,'2/7','#18','casino'],[72,'Reservoir Dogs',11,'1/7','#15','reservoir-dogs'],[73,'Being John Malkovich',10,'1/7','#16','being-john-malkovich'],[74,'Gattaca',10,'1/7','#16','gattaca'],[75,'Ghost in the Shell',10,'1/7','#16','ghost-in-the-shell'],[76,'Unforgiven',10,'1/7','#16','unforgiven'],[77,'Once Upon a Time in America',9,'1/7','#17','once-upon-a-time-in-america'],[78,'Rushmore',8,'3/7','#22','rushmore'],[79,'The Blair Witch Project',7,'1/7','#19','the-blair-witch-project'],[80,"Ferris Bueller's Day Off",6,'1/7','#20','ferris-buellers-day-off'],[81,'Hook',6,'1/7','#20','hook'],[82,'Taxi',5,'1/7','#21','taxi-1998'],[83,'Thelma & Louise',5,'1/7','#21','thelma-and-louise'],[84,'Boogie Nights',3,'1/7','#23','boogie-nights'],[85,'The Truman Show',3,'1/7','#23','the-truman-show'],[86,'Ghostbusters',2,'1/7','#24','ghostbusters'],[87,'Run Lola Run',2,'1/7','#24','run-lola-run'],[88,'Dances with Wolves',1,'1/7','#25','dances-with-wolves'],[89,'The Game',1,'1/7','#25','the-game'],[90,'Underground',1,'1/7','#25','underground']
];
const canonical1975Films = raw1975.map(f=>({rank:f[0],title:f[1],pts:f[2],votes:f[3],best:f[4],img:`${ASSET}posters/1975-1999/${f[5]}.jpg`}));

const TOPS = [
  {
    id:'1975-1999', label:'1975–1999', community:'Une communauté de 7 cinéphiles',
    theme:{accent:'#e60d45',secondary:'#d59b62',bg:'#080a0b',panel:'#0e1214'},
    hero:{image:`${ASSET}cinema-hero-1975-1999.jpg`,titleArt:`${ASSET}header-title-1975-1999.svg`,position:'center 46%'},
    films:canonical1975Films,
    ghosts:[
      {title:'Blue Velvet',copy:'Aucun vote.',img:`${ASSET}grands-oublies/1975-1999/blue-velvet.jpg`},
      {title:'The Deer Hunter',copy:'Aucun vote.',img:`${ASSET}grands-oublies/1975-1999/the-deer-hunter.jpg`},
      {title:'Network',copy:'Aucun vote.',img:`${ASSET}grands-oublies/1975-1999/network.jpg`},
      {title:'Brazil',copy:'Aucun vote.',img:`${ASSET}grands-oublies/1975-1999/brazil.jpg`},
      {title:'Do the Right Thing',copy:'Aucun vote.',img:`${ASSET}grands-oublies/1975-1999/do-the-right-thing.jpg`},
      {title:'The Thing',copy:'Aucun vote.',img:`${ASSET}grands-oublies/1975-1999/the-thing.jpg`},
      {title:'Before Sunrise',copy:'Aucun vote.',img:`${ASSET}grands-oublies/1975-1999/before-sunrise.jpg`}
    ],
    sections:[
      {kicker:'Les gros scoreurs',title:'TOP 25',kind:'top25'},
      {kicker:'Le classement complet',title:'#26–90',kind:'full',start:26,batch:25},
      {kicker:'Aucun vote',title:'Les grands oubliés',kind:'ghosts'},
      {kicker:'Les bons derniers',title:'Les OVNIS',kind:'bottom',count:10}
    ],
    sidebar:[
      {kind:'insight',icon:'⌁',title:'A Galaxy far away',sub:'Un n°1 que personne ne met en n°1',bullets:['Star Wars termine #1 collectivement sans être le #1 de personne.','6 cinéphiles sur 7 le choisissent.','Son meilleur rang individuel est #2.']},
      {kind:'insight',icon:'◎',title:'Le barycentre',sub:'Max · 15 films du Top 25',bullets:['Max est le centre de gravité du groupe.','15 de ses 25 choix figurent dans le Top 25 collectif.','Simon suit avec 14.']},
      {kind:'insight',icon:'♡',title:'Duo cinéphile',sub:'Max + Simon · 13 en commun',bullets:['Max + Simon partagent 13 films ou franchises.','Max + Monette et Garci + Simon en partagent 11.','C’est le duo le plus proche du canon collectif.']},
      {kind:'insight',icon:'◇',title:"L'explorateur",sub:'Monette · 10 choix uniques',bullets:['Monette compte 10 choix uniques.','Beverly Hills Cop : seul vote, classé #1.','Titanic ne compte lui aussi qu’un seul vote.']},
      {kind:'year',label:'Années phares',title:'1999',sub:'1990–1999 · 57%',bars:[3,2,2,0,3,3,2,2,2,4,3,2,3,4,3,3,6,3,5,4,8,2,7,8,5],yearStart:1975,notes:['1995 · 1998 — 8 films','1999 — Fight Club · The Matrix','1975 · 76 · 79 · 80 · 82','1978 — aucun film']},
      {kind:'directors',label:'Réalisateurs',title:'Spielberg mène la marche',faces:['jaws','taxi-driver','the-shining','fight-club','the-big-lebowski'],entries:[['Steven Spielberg',"Jaws · E.T. · Schindler's List · Jurassic Park · Saving Private Ryan · Indiana Jones"],['Martin Scorsese','GoodFellas · Taxi Driver · Raging Bull · Casino'],['Stanley Kubrick','The Shining · Full Metal Jacket · Barry Lyndon · Eyes Wide Shut'],['David Fincher','Fight Club · Se7en · The Game'],['Frères Coen','Fargo · The Big Lebowski'],['Akira Kurosawa','Ran · Kagemusha']]}
    ]
  },
  {
    id:'2000-2024', label:'2000–2024', community:'Une communauté de 9 cinéphiles',
    theme:{accent:'#ff3131',secondary:'#879da8',bg:'#080a0b',panel:'#0e1214'},
    hero:{image:`${ASSET}cinema-hero.jpg`,line:'Top films',em:'2000–2024',position:'center 52%'},
    films:canonical2000Films, ghosts:canonical2000Ghosts, details,
    sections:[
      {kicker:'Les gros scoreurs',title:'TOP 25',kind:'top25'},
      {kicker:'Le classement complet',title:'#25–135',kind:'full',start:26,batch:25},
      {kicker:'Aucun vote',title:'Les grands oubliés',kind:'ghosts'},
      {kicker:'Les bons derniers',title:'Les OVNIS',kind:'bottom',count:10}
    ],
    sidebar:[
      {kind:'insight',icon:'✝',title:'Religion commune',sub:'LOTR · 8/9 · JB est le seul absent',bullets:['LOTR est partagé par presque tout le groupe.','8 cinéphiles sur 9 ont voté pour la franchise.','JB est le seul absent.']},
      {kind:'insight',icon:'◎',title:'Monsieur Consensus',sub:'Simon · 14 films du Top 25',bullets:['Simon place 14 de ses choix dans le Top 25 collectif.','Il est le profil le plus proche du classement commun.']},
      {kind:'insight',icon:'♡',title:'Duo cinéphile',sub:'Alex + Simon · 11 en commun',bullets:['Alex + Simon partagent 11 films.','Leur proximité traverse plusieurs genres.']},
      {kind:'insight',icon:'◇',title:'OVNI culturel',sub:'JB · 17 choix uniques',bullets:['JB possède 17 choix uniques.','Son profil est le plus singulier du groupe.']},
      {kind:'year',label:'Année reine',title:'2000',sub:'13 films · 2000–2009 = 55%',bars:[13,10,10,6,6,6,6,11,2,4,5,7,4,4,5,7,3,6,5,7,7,4,5,5,2],yearStart:2000,notes:['2000 — 13 films','2007 — 11 films','2001 · 2002 — 10 films','2000–2009 — 55%']}
    ]
  }
];
