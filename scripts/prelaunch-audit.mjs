import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
const errors=[];
const warnings=[];
const fail=m=>errors.push(m),warn=m=>warnings.push(m);
const read=p=>fs.readFileSync(path.resolve(root,p),'utf8');
const exists=p=>fs.existsSync(path.resolve(root,p));
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();

const index=read('v2/index.html');
const styleOrder=[...index.matchAll(/<link\s+[^>]*href=["']styles\/([^"']+)["']/g)].map(m=>m[1]);
const pos=name=>styleOrder.indexOf(name);
for(const name of ['mobile-cinema-header.css','mobile-performance.css','mobile-desktop-parity.css'])if(pos(name)<0)fail(`Missing mobile stylesheet: ${name}`);
if(!(pos('mobile-desktop-parity.css')>pos('mobile-cinema-header.css')&&pos('mobile-desktop-parity.css')>pos('mobile-performance.css')))fail('mobile-desktop-parity.css must load after the base mobile styles.');

// Resolve every local stylesheet url() reference exactly as a browser would.
for(const cssName of styleOrder){
  const cssPath=`v2/styles/${cssName}`;
  if(!exists(cssPath)){fail(`Missing stylesheet ${cssPath}`);continue}
  const css=read(cssPath);
  for(const m of css.matchAll(/url\((['"]?)([^)'"\s]+)\1\)/g)){
    const ref=m[2];
    if(!ref||/^(?:data:|https?:|\/\/|#)/i.test(ref))continue;
    const target=path.normalize(path.join(path.dirname(cssPath),ref));
    if(!exists(target))fail(`${cssPath}: missing url() asset ${ref} -> ${target}`);
  }
}

const context={console,matchMedia:()=>({matches:false}),navigator:{connection:null},location:{pathname:'/tops/1975-1999',search:'',hash:''}};
context.window=context;context.globalThis=context;vm.createContext(context);
const pipeline=[
  'scripts/data.js','scripts/backdrops.js','v2/scripts/data.js','v2/scripts/new-tops.js','v2/scripts/animation-data.js',
  'v2/scripts/expanded-tops.js','v2/scripts/poster-metadata.js','v2/scripts/poster-aliases.js','v2/scripts/expansion-media.js',
  'v2/scripts/canonical-data.js','v2/scripts/top-skeletons.js','v2/scripts/hero-config.js','v2/scripts/platform-config.js',
  'v2/scripts/shared-content-normalization.js','v2/scripts/header-media-config.js'
];
for(const file of pipeline)vm.runInContext(read(file),context,{filename:file});
vm.runInContext('globalThis.__TOPS=TOPS',context);
const tops=context.__TOPS;
const media=context.ASWA40_HEADER_MEDIA;
if(!Array.isArray(tops)||tops.length!==7)fail(`Expected 7 Tops, got ${tops?.length}`);
if(!media)fail('Header media config did not initialize.');

if(media){
  const keys=Object.keys(media.backdrops||{});
  if(keys.length!==35)fail(`Expected 35 curated Top-5 backdrops, got ${keys.length}`);
  const focusKeys=Object.keys(media.mobileFocus||{});
  if(focusKeys.length!==35)fail(`Expected 35 mobile focal points, got ${focusKeys.length}`);
  const expectedTitles={
    '2000-2024:5':'Batman','animation:3':'Spiderman','animation:4':'Nightmare before…',
    'rewatched:2':'Lord of the Rings','rewatched:4':'Les 12 travaux'
  };
  for(const [key,value] of Object.entries(expectedTitles))if(media.displayTitles?.[key]!==value)fail(`Short title mismatch ${key}: ${media.displayTitles?.[key]}`);
}

const localAsset=(value,owner)=>{
  const src=String(value||'');
  if(!src||/^(?:data:|https?:|blob:)/i.test(src))return;
  let candidate=src.split(/[?#]/)[0];
  if(candidate.startsWith('/'))candidate=candidate.slice(1);
  else if(candidate.startsWith('../'))candidate=path.normalize(path.join('v2',candidate));
  else candidate=path.normalize(path.join('v2',candidate));
  if(!exists(candidate))fail(`${owner}: missing local asset ${src} -> ${candidate}`);
};

const top2000=tops?.find(t=>t.id==='2000-2024');
if(top2000?.theme?.accent?.toLowerCase()!=='#d8b15a')fail(`Top 2000 accent must be gold #d8b15a, got ${top2000?.theme?.accent}`);

for(const top of tops||[]){
  const films=top.films||[];
  const rankList=films.map(f=>Number(f.rank));
  const rankSet=new Set(rankList);
  if(rankSet.size!==rankList.length)fail(`${top.id}: duplicate ranks`);
  for(let i=1;i<=films.length;i++)if(!rankSet.has(i))fail(`${top.id}: missing rank #${i}`);
  const titleSet=new Set();
  for(const film of films){
    const key=norm(film.title);if(titleSet.has(key))warn(`${top.id}: duplicate normalized title '${film.title}'`);titleSet.add(key);
    localAsset(film.img,`${top.id} #${film.rank} poster`);
  }
  localAsset(top.hero?.image,`${top.id} hero`);localAsset(top.hero?.titleArt,`${top.id} title art`);

  const featured=top.sections?.find(s=>s.kind==='top25');
  const featuredCount=Math.min(films.length,Number(featured?.count)||25);
  const full=top.sections?.find(s=>s.kind==='full');
  if(full){
    if(full.title!=='Le reste')fail(`${top.id}: full section is '${full.title}', expected 'Le reste'`);
    if(Number(full.start)!==featuredCount+1)fail(`${top.id}: full section starts at #${full.start}, expected #${featuredCount+1}`);
  }
  const year=top.sidebar?.find(i=>i.kind==='year');
  if(year&&!/^(Année reine|Années reines|Décennie reine)$/.test(year.label||''))fail(`${top.id}: unexpected year label '${year.label}'`);

  const ghostTitles=new Set();
  for(const ghost of top.ghosts||[]){
    const key=norm(ghost.title);
    if(ghostTitles.has(key))fail(`${top.id}: duplicate ghost '${ghost.title}'`);ghostTitles.add(key);
    localAsset(ghost.img,`${top.id} ghost '${ghost.title}'`);
  }

  if(['1975-1999','2000-2024','documentaires'].includes(top.id)){
    for(const ghost of top.ghosts||[])if(titleSet.has(norm(ghost.title)))fail(`${top.id}: forgotten film is also ranked: ${ghost.title}`);
  }
}

for(const id of ['1975-1999','2000-2024','documentaires']){
  const top=tops?.find(t=>t.id===id);
  if(top?.ghosts?.length&&!top.sections?.some(s=>s.kind==='ghosts'&&!/ovni/i.test(s.title||'')))fail(`${id}: documented forgotten films exist but section is missing`);
}
for(const id of ['sci-fi-realiste','animation','biopics']){
  const top=tops?.find(t=>t.id===id);
  if(top?.ghosts?.length)warn(`${id}: forgotten-film data exists; verify it against an editorial source before launch.`);
}

const docs=tops?.find(t=>t.id==='documentaires');
const expectedDocGhosts=['Shoah','The Thin Blue Line','Grey Gardens','Paris Is Burning','Harlan County, USA','Crumb',"Hearts of Darkness: A Filmmaker's Apocalypse"];
if(docs){
  const actual=(docs.ghosts||[]).map(g=>g.title);
  expectedDocGhosts.forEach((title,i)=>{if(actual[i]!==title)fail(`documentaires ghost ${i+1}: '${actual[i]}' expected '${title}'`)});
  if(actual.some(t=>/Harlan County War/i.test(t)))fail('Documentaires still contains Harlan County War; expected documentary Harlan County, USA.');
}

const bootstrap=read('v2/scripts/bootstrap.js');
for(const required of ['shared-content-normalization.js','header-media-config.js','mobile-content-fixes.js'])if(!bootstrap.includes(required))fail(`bootstrap missing ${required}`);

// Lightweight repository secret scan. Fail only on high-confidence credential shapes.
const scanExt=new Set(['.js','.mjs','.html','.css','.json','.yml','.yaml','.md','.txt']);
const secretPatterns=[
  ['JWT',/\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\b/g],
  ['GitHub token',/\bgh[pousr]_[A-Za-z0-9]{30,}\b/g],
  ['Google API key',/\bAIza[0-9A-Za-z_-]{35}\b/g]
];
const walk=dir=>{
  for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
    if(['.git','node_modules'].includes(ent.name))continue;
    const full=path.join(dir,ent.name);
    if(ent.isDirectory())walk(full);
    else if(scanExt.has(path.extname(ent.name).toLowerCase())){
      let text='';try{text=fs.readFileSync(full,'utf8')}catch{continue}
      for(const [label,re] of secretPatterns){re.lastIndex=0;if(re.test(text))fail(`${label} shape found in ${path.relative(root,full)}`)}
    }
  }
};
walk(root);

console.log('\nASWA40 prelaunch audit');
console.log('======================');
for(const m of warnings)console.log(`⚠ ${m}`);
for(const m of errors)console.error(`✗ ${m}`);
console.log(`\n${errors.length} error(s), ${warnings.length} warning(s).`);
if(errors.length)process.exit(1);