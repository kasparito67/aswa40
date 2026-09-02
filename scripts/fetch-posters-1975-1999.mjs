import fs from 'node:fs/promises';
import path from 'node:path';

const ranked = [
  [1,'Star Wars (franchise)',1977,'Star Wars 1977 film','star-wars'],
  [2,'Apocalypse Now',1979,'Apocalypse Now 1979 film','apocalypse-now'],
  [3,'Indiana Jones (franchise)',1981,'Raiders of the Lost Ark 1981 film','indiana-jones'],
  [4,'Pulp Fiction',1994,'Pulp Fiction 1994 film','pulp-fiction'],
  [5,'Fargo',1996,'Fargo 1996 film','fargo'],
  [6,'Blade Runner',1982,'Blade Runner 1982 film','blade-runner'],
  [7,'GoodFellas',1990,'Goodfellas 1990 film','goodfellas'],
  [8,'Back to the Future',1985,'Back to the Future 1985 film','back-to-the-future'],
  [9,'Fight Club',1999,'Fight Club 1999 film','fight-club'],
  [10,'The Matrix',1999,'The Matrix 1999 film','the-matrix'],
  [11,'The Shining',1980,'The Shining 1980 film','the-shining'],
  [12,'The Shawshank Redemption',1994,'The Shawshank Redemption 1994 film','the-shawshank-redemption'],
  [13,"Schindler's List",1993,"Schindler's List 1993 film",'schindlers-list'],
  [14,'The Big Lebowski',1998,'The Big Lebowski 1998 film','the-big-lebowski'],
  [15,'Taxi Driver',1976,'Taxi Driver 1976 film','taxi-driver'],
  [16,'Se7en',1995,'Seven 1995 film Fincher','se7en'],
  [17,'The Dinner Game',1998,'Le Dîner de Cons 1998 film','the-dinner-game'],
  [18,'Alien',1979,'Alien 1979 film','alien'],
  [19,'Jaws',1975,'Jaws 1975 film','jaws'],
  [20,'Toy Story (franchise)',1995,'Toy Story 1995 film','toy-story'],
  [21,'Terminator 2: Judgment Day',1991,'Terminator 2 Judgment Day 1991 film','terminator-2'],
  [22,'Full Metal Jacket',1987,'Full Metal Jacket 1987 film','full-metal-jacket'],
  [23,'Groundhog Day',1993,'Groundhog Day 1993 film','groundhog-day'],
  [24,'Jurassic Park',1993,'Jurassic Park 1993 film','jurassic-park'],
  [25,"All the President's Men",1976,"All the President's Men 1976 film",'all-the-presidents-men'],
  [26,'Heat',1995,'Heat 1995 film','heat'],
  [27,'Princess Mononoke',1997,'Princess Mononoke 1997 film','princess-mononoke'],
  [28,'Léon: The Professional',1994,'Léon The Professional 1994 film','leon-the-professional'],
  [29,'Beverly Hills Cop',1984,'Beverly Hills Cop 1984 film','beverly-hills-cop'],
  [30,"One Flew Over the Cuckoo's Nest",1975,"One Flew Over the Cuckoo's Nest 1975 film",'one-flew-over-the-cuckoos-nest'],
  [31,'Trainspotting',1996,'Trainspotting 1996 film','trainspotting'],
  [32,'E.T. the Extra-Terrestrial',1982,'E.T. the Extra-Terrestrial 1982 film','et-the-extra-terrestrial'],
  [33,'Jesus of Nazareth',1977,'Jesus of Nazareth 1977 miniseries','jesus-of-nazareth'],
  [34,'The Sacrifice',1986,'The Sacrifice 1986 film Tarkovsky','the-sacrifice'],
  [35,'Forrest Gump',1994,'Forrest Gump 1994 film','forrest-gump'],
  [36,'In the Mood for Love',2000,'In the Mood for Love 2000 film','in-the-mood-for-love'],
  [37,'La Haine',1995,'La Haine 1995 film','la-haine'],
  [38,'Manhattan',1979,'Manhattan 1979 film Woody Allen','manhattan'],
  [39,'Ran',1985,'Ran 1985 film Kurosawa','ran'],
  [40,'Akira',1988,'Akira 1988 film','akira'],
  [41,'The Silence of the Lambs',1991,'The Silence of the Lambs 1991 film','the-silence-of-the-lambs'],
  [42,'Dead Poets Society',1989,'Dead Poets Society 1989 film','dead-poets-society'],
  [43,'Kagemusha',1980,'Kagemusha 1980 film','kagemusha'],
  [44,'The Thin Red Line',1998,'The Thin Red Line 1998 film','the-thin-red-line'],
  [45,'Titanic',1997,'Titanic 1997 film','titanic'],
  [46,'Das Boot',1981,'Das Boot 1981 film','das-boot'],
  [47,'Scarface',1983,'Scarface 1983 film','scarface'],
  [48,'Barry Lyndon',1975,'Barry Lyndon 1975 film','barry-lyndon'],
  [49,'The Cook, the Thief, His Wife & Her Lover',1989,'The Cook the Thief His Wife and Her Lover 1989 film','the-cook-the-thief-his-wife-and-her-lover'],
  [50,'Tombstone',1993,'Tombstone 1993 film','tombstone'],
  [51,'The Big Chill',1983,'The Big Chill 1983 film','the-big-chill'],
  [52,'The Usual Suspects',1995,'The Usual Suspects 1995 film','the-usual-suspects'],
  [53,'The Nightmare Before Christmas',1993,'The Nightmare Before Christmas 1993 film','the-nightmare-before-christmas'],
  [54,'Misery',1990,'Misery 1990 film','misery'],
  [55,'Raging Bull',1980,'Raging Bull 1980 film','raging-bull'],
  [56,'The Breakfast Club',1985,'The Breakfast Club 1985 film','the-breakfast-club'],
  [57,'Eyes Wide Shut',1999,'Eyes Wide Shut 1999 film','eyes-wide-shut'],
  [58,'Planes, Trains and Automobiles',1987,'Planes Trains and Automobiles 1987 film','planes-trains-and-automobiles'],
  [59,'The Killer',1989,'The Killer 1989 film John Woo','the-killer'],
  [60,'Saving Private Ryan',1998,'Saving Private Ryan 1998 film','saving-private-ryan'],
  [61,'Die Hard',1988,'Die Hard 1988 film','die-hard'],
  [62,'Cinema Paradiso',1988,'Cinema Paradiso 1988 film','cinema-paradiso'],
  [63,'The Fifth Element',1997,'The Fifth Element 1997 film','the-fifth-element'],
  [64,'Man Bites Dog',1992,'Man Bites Dog 1992 film','man-bites-dog'],
  [65,'Amadeus',1984,'Amadeus 1984 film','amadeus'],
  [66,'Delicatessen',1991,'Delicatessen 1991 film','delicatessen'],
  [67,'Europa',1991,'Europa 1991 film Lars von Trier','europa'],
  [68,'Good Morning, Vietnam',1987,'Good Morning Vietnam 1987 film','good-morning-vietnam'],
  [69,'My Neighbor Totoro',1988,'My Neighbor Totoro 1988 film','my-neighbor-totoro'],
  [70,'Good Will Hunting',1997,'Good Will Hunting 1997 film','good-will-hunting'],
  [71,'Casino',1995,'Casino 1995 film','casino'],
  [72,'Reservoir Dogs',1992,'Reservoir Dogs 1992 film','reservoir-dogs'],
  [73,'Being John Malkovich',1999,'Being John Malkovich 1999 film','being-john-malkovich'],
  [74,'Gattaca',1997,'Gattaca 1997 film','gattaca'],
  [75,'Ghost in the Shell',1995,'Ghost in the Shell 1995 film','ghost-in-the-shell'],
  [76,'Unforgiven',1992,'Unforgiven 1992 film','unforgiven'],
  [77,'Once Upon a Time in America',1984,'Once Upon a Time in America 1984 film','once-upon-a-time-in-america'],
  [78,'Rushmore',1998,'Rushmore 1998 film','rushmore'],
  [79,'The Blair Witch Project',1999,'The Blair Witch Project 1999 film','the-blair-witch-project'],
  [80,"Ferris Bueller's Day Off",1986,"Ferris Bueller's Day Off 1986 film",'ferris-buellers-day-off'],
  [81,'Hook',1991,'Hook 1991 film Spielberg','hook'],
  [82,'Taxi',1998,'Taxi 1998 French film','taxi-1998'],
  [83,'Thelma & Louise',1991,'Thelma and Louise 1991 film','thelma-and-louise'],
  [84,'Boogie Nights',1997,'Boogie Nights 1997 film','boogie-nights'],
  [85,'The Truman Show',1998,'The Truman Show 1998 film','the-truman-show'],
  [86,'Ghostbusters',1984,'Ghostbusters 1984 film','ghostbusters'],
  [87,'Run Lola Run',1998,'Run Lola Run 1998 film','run-lola-run'],
  [88,'Dances with Wolves',1990,'Dances with Wolves 1990 film','dances-with-wolves'],
  [89,'The Game',1997,'The Game 1997 film Fincher','the-game'],
  [90,'Underground',1995,'Underground 1995 film Kusturica','underground']
];

const forgotten = [
  ['The Thing',1982,'The Thing 1982 film','the-thing'],
  ['Blue Velvet',1986,'Blue Velvet 1986 film','blue-velvet'],
  ['The Deer Hunter',1978,'The Deer Hunter 1978 film','the-deer-hunter'],
  ['Network',1976,'Network 1976 film','network'],
  ['Do the Right Thing',1989,'Do the Right Thing 1989 film','do-the-right-thing'],
  ['Brazil',1985,'Brazil 1985 film','brazil'],
  ['Before Sunrise',1995,'Before Sunrise 1995 film','before-sunrise']
];

const api = 'https://en.wikipedia.org/w/api.php';
const ua = 'ASWA40-poster-fetch/1.0 (personal film-ranking site; poster asset preparation)';

async function wikipediaImage(search) {
  const params = new URLSearchParams({
    action:'query', format:'json', origin:'*', generator:'search',
    gsrsearch: search, gsrlimit:'5', gsrnamespace:'0',
    prop:'pageimages|info', piprop:'thumbnail|original|name', pithumbsize:'700', inprop:'url'
  });
  const res = await fetch(`${api}?${params}`, {headers:{'user-agent':ua}});
  if (!res.ok) throw new Error(`Wikipedia ${res.status}`);
  const data = await res.json();
  const pages = Object.values(data?.query?.pages || {}).sort((a,b)=>(a.index||99)-(b.index||99));
  for (const p of pages) {
    const url = p.thumbnail?.source || p.original?.source;
    if (url) return {url, pageTitle:p.title, pageUrl:p.fullurl || null, file:p.pageimage || null};
  }
  return null;
}

async function download(item, folder) {
  const [rankOrTitle, titleOrYear, yearOrSearch, searchOrSlug, maybeSlug] = item;
  const rankedItem = typeof rankOrTitle === 'number';
  const rank = rankedItem ? rankOrTitle : null;
  const title = rankedItem ? titleOrYear : rankOrTitle;
  const year = rankedItem ? yearOrSearch : titleOrYear;
  const search = rankedItem ? searchOrSlug : yearOrSearch;
  const slug = rankedItem ? maybeSlug : searchOrSlug;
  const meta = await wikipediaImage(search);
  if (!meta) return {rank,title,year,slug,status:'missing',search};

  const img = await fetch(meta.url, {headers:{'user-agent':ua}});
  if (!img.ok) return {rank,title,year,slug,status:'download-error',search,source:meta};
  const type = img.headers.get('content-type') || '';
  const ext = type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : 'jpg';
  const dest = path.join(folder, `${slug}.${ext}`);
  await fs.mkdir(folder,{recursive:true});
  await fs.writeFile(dest, Buffer.from(await img.arrayBuffer()));
  return {rank,title,year,slug,status:'ok',file:dest.replaceAll('\\','/'),source:meta};
}

const manifest = {generatedAt:new Date().toISOString(), ranked:[], forgotten:[]};
for (const item of ranked) {
  try { manifest.ranked.push(await download(item,'assets/posters/1975-1999')); }
  catch (e) { manifest.ranked.push({rank:item[0],title:item[1],year:item[2],slug:item[4],status:'error',error:String(e)}); }
  await new Promise(r=>setTimeout(r,120));
}
for (const item of forgotten) {
  try { manifest.forgotten.push(await download(item,'assets/grands-oublies/1975-1999')); }
  catch (e) { manifest.forgotten.push({title:item[0],year:item[1],slug:item[3],status:'error',error:String(e)}); }
  await new Promise(r=>setTimeout(r,120));
}

await fs.mkdir('data/1975-1999',{recursive:true});
await fs.writeFile('data/1975-1999/poster-manifest.json', JSON.stringify(manifest,null,2)+'\n');
const ok = [...manifest.ranked,...manifest.forgotten].filter(x=>x.status==='ok').length;
const missing = [...manifest.ranked,...manifest.forgotten].filter(x=>x.status!=='ok');
console.log(`Downloaded ${ok}/${ranked.length+forgotten.length} poster candidates.`);
if (missing.length) {
  console.log('Needs review:', missing.map(x=>`${x.rank ? '#'+x.rank+' ' : ''}${x.title} (${x.status})`).join(', '));
  process.exitCode = 2;
}
