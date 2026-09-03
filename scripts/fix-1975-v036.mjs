import fs from 'node:fs/promises';

const file='1975-1999/index.html';
let html=await fs.readFile(file,'utf8');

// Restore the complete SVG from the original production source instead of
// the later truncated/minified asset that was accidentally deployed.
try {
  const producer=await fs.readFile('scripts/apply-1975-production.mjs','utf8');
  const match=producer.match(/const titleSvg='([^']+)'/);
  if(match) await fs.writeFile('assets/header-title-1975-1999.svg',Buffer.from(match[1],'base64'));
} catch {}

html=html.replace(/<link rel="stylesheet" href="\.\.\/assets\/1975-mobile-v095\.css[^>]*>\n?/g,'');
html=html.replace(/<link rel="stylesheet" href="\.\.\/assets\/1975-unified-v096\.css[^>]*>\n?/g,'');
html=html.replace('</head>','<link rel="stylesheet" href="../assets/1975-unified-v096.css?v=0.9.36">\n</head>');
html=html.replaceAll('v0.9.35','v0.9.36').replaceAll('v0.9.34','v0.9.36');

const oldModal='<div class="modalbg" id="mb"><div class="modal" id="modal"><button class="close" type="button" aria-label="Fermer">×</button><button class="modal-nav modal-prev" type="button" aria-label="Film précédent">‹</button><button class="modal-nav modal-next" type="button" aria-label="Film suivant">›</button><div class="modal-layout"><div class="modal-thumb" id="thumb"></div><div><div class="modal-rank" id="mr"></div><h2 id="mt"></h2><div class="stats" id="stats"></div></div></div></div></div>';
const newModal='<div class="modalbg" id="mb"><div class="modal" id="modal"><img class="modal-backdrop" id="modalBackdrop" alt="" hidden><button class="close" type="button" aria-label="Fermer">×</button><button class="modal-nav modal-prev" type="button" aria-label="Film précédent">‹</button><button class="modal-nav modal-next" type="button" aria-label="Film suivant">›</button><div class="modal-layout"><div class="modal-thumb" id="thumb"></div><div class="modal-copy"><div class="modal-rank" id="mr"></div><h2 id="mt"></h2><div class="stats" id="stats"></div><div class="modal-body" id="modalBody"></div></div></div></div></div>';
html=html.replace(oldModal,newModal);

html=html.replace(
  "const mb=document.querySelector('#mb'),modal=document.querySelector('#modal'),thumb=document.querySelector('#thumb'),mr=document.querySelector('#mr'),mt=document.querySelector('#mt'),stats=document.querySelector('#stats');",
  "const mb=document.querySelector('#mb'),modal=document.querySelector('#modal'),thumb=document.querySelector('#thumb'),mr=document.querySelector('#mr'),mt=document.querySelector('#mt'),stats=document.querySelector('#stats'),modalBackdrop=document.querySelector('#modalBackdrop'),modalBody=document.querySelector('#modalBody');"
);

const oldShow="function showAt(idx){current=(idx+F.length)%F.length;const f=F[current];thumb.innerHTML=`<img src=\"${poster(f)}\" alt=\"Affiche de ${f[1]}\">`;mr.textContent=`#${f[0]} · classement collectif`;mt.textContent=f[1];stats.innerHTML=`<span><b>${f[2]}</b> points</span><span><b>${f[3]}</b> votes</span><span>Best rank <b>${f[4]}</b></span>`;mb.classList.add('open')}";
const newShow="function showAt(idx){current=(idx+F.length)%F.length;const f=F[current];thumb.innerHTML=`<img src=\"${poster(f)}\" alt=\"Affiche de ${f[1]}\">`;mr.textContent=`#${f[0]} · classement collectif`;mt.textContent=f[1];stats.innerHTML=`<span><b>${f[2]}</b> points</span><span><b>${f[3]}</b> votes</span><span>Best rank <b>${f[4]}</b></span>`;const bd=filmBackdrops[String(f[0])];if(bd){modalBackdrop.src=`../${bd}`;modalBackdrop.alt=`Image d’ambiance de ${f[1]}`;modalBackdrop.hidden=false}else{modalBackdrop.hidden=true;modalBackdrop.removeAttribute('src')}const editorial={1:['Un n°1 que personne ne met en n°1','Star Wars termine #1 collectivement sans être le #1 de personne. 6 cinéphiles sur 7 le choisissent et son meilleur rang individuel est #2.'],2:['Moins universel. Plus passionnel.','Apocalypse Now récolte 91 points auprès de 4 cinéphiles sur 7, avec au moins un classement individuel au #1.'],13:['Le consensus sans passion.','Schindler’s List est choisi par 5 cinéphiles sur 7, mais personne ne le classe mieux que #13.']};const ed=editorial[f[0]];modalBody.innerHTML=ed?`<b>${ed[0]}</b><span>${ed[1]}</span>`:`<b>Dans le classement collectif</b><span>${f[2]} points · ${f[3]} votes · meilleur rang individuel ${f[4]}.</span>`;mb.classList.add('open')}";
html=html.replace(oldShow,newShow);

// Keep ghost modal clean when switching from a ranked film.
html=html.replace(
  "mr.textContent='Grand absent · 0/7';mt.textContent=x[0];stats.innerHTML='<span><b>0/7</b> votes</span>';mb.classList.add('open')",
  "mr.textContent='Grand absent · 0/7';mt.textContent=x[0];stats.innerHTML='<span><b>0/7</b> votes</span>';modalBackdrop.hidden=true;modalBackdrop.removeAttribute('src');modalBody.innerHTML='<b>Les grands oubliés</b><span>Aucun vote dans le classement collectif.</span>';mb.classList.add('open')"
);

const yearsLine="const years=[3,2,2,0,3,3,2,2,2,4,3,2,3,4,3,3,6,3,5,4,8,2,7,8,5];document.querySelector('#chart').innerHTML=years.map((v,i)=>`<span class=\"bar ${1975+i===1999?'hot':''}\" style=\"--v:${v}\" data-y=\"${1975+i}\"></span>`).join('');";
const yearsEnhanced=yearsLine+`
const chart=document.querySelector('#chart');
const yearDetail=document.querySelector('.year-card .side-detail');
const rollover=document.createElement('div');rollover.className='year-rollover';rollover.innerHTML='<b>1999</b>Fight Club · The Matrix';
chart.insertAdjacentElement('afterend',rollover);
const bars=[...chart.querySelectorAll('.bar')];bars.forEach((bar,i)=>{bar.tabIndex=0;bar.setAttribute('role','button');bar.setAttribute('aria-label',\`${1975+i} · ${years[i]} film${years[i]===1?'':'s'}\`)});
const yearStories=[
 {label:'Les plus denses',years:[1995,1998],title:'1995 · 1998',copy:'8 films chacune'},
 {label:'1999',years:[1999],title:'1999',copy:'Fight Club · The Matrix'},
 {label:'Années-monuments',years:[1975,1976,1979,1980,1982],title:'1975 · 76 · 79 · 80 · 82',copy:'Les années qui structurent le plus fortement le canon du groupe.'},
 {label:'Le creux',years:[1978],title:'1978',copy:'Aucun film'}
];
function highlightYears(story){chart.classList.add('is-exploring');bars.forEach(b=>b.classList.toggle('is-highlighted',story.years.includes(+b.dataset.y)));rollover.innerHTML=\`<b>${story.label} · ${story.title}</b>${story.copy}\`}
function resetYears(){chart.classList.remove('is-exploring');bars.forEach(b=>b.classList.remove('is-highlighted'));rollover.innerHTML='<b>1999</b>Fight Club · The Matrix'}
bars.forEach((bar,i)=>{const story={label:String(1975+i),years:[1975+i],title:String(1975+i),copy:years[i]+(years[i]===1?' film':' films')};bar.addEventListener('pointerenter',()=>highlightYears(story));bar.addEventListener('focus',()=>highlightYears(story));bar.addEventListener('pointerleave',resetYears);bar.addEventListener('blur',resetYears)});
const links=[...yearDetail.querySelectorAll('.year-links span')];links.forEach((el,i)=>{el.tabIndex=0;el.setAttribute('role','button');el.addEventListener('pointerenter',()=>highlightYears(yearStories[i]));el.addEventListener('focus',()=>highlightYears(yearStories[i]));el.addEventListener('pointerleave',resetYears);el.addEventListener('blur',resetYears)});
`;
html=html.replace(yearsLine,yearsEnhanced);

await fs.writeFile(file,html);
