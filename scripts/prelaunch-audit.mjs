import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
const errors=[];
const warnings=[];
const fail=m=>errors.push(m),warn=m=>warnings.push(m);
const read=p=>fs.readFileSync(path.resolve(root,p),'utf8');

const index=read('v2/index.html');
const styleOrder=[...index.matchAll(/<link\s+[^>]*href=["']styles\/([^"']+)["']/g)].map(m=>m[1]);
const pos=name=>styleOrder.indexOf(name);
for(const name of ['mobile-cinema-header.css','mobile-performance.css','mobile-desktop-parity.css'])if(pos(name)<0)fail(`Missing mobile stylesheet: ${name}`);
if(!(pos('mobile-desktop-parity.css')>pos('mobile-cinema-header.css')&&pos('mobile-desktop-parity.css')>pos('mobile-performance.css')))fail('mobile-desktop-parity.css must load after the base mobile styles.');

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

const top2000=tops?.find(t=>t.id==='2000-2024');
if(top2000?.theme?.accent?.toLowerCase()!=='#d8b15a')fail(`Top 2000 accent must be gold #d8b15a, got ${top2000?.theme?.accent}`);

for(const top of tops||[]){
  const full=top.sections?.find(s=>s.kind==='full');
  if(full&&full.title!=='Le reste')fail(`${top.id}: full section is '${full.title}', expected 'Le reste'`);
  const year=top.sidebar?.find(i=>i.kind==='year');
  if(year&&!/^(Année reine|Années reines|Décennie reine)$/.test(year.label||''))fail(`${top.id}: unexpected year label '${year.label}'`);
  const ranks=new Set((top.films||[]).map(f=>Number(f.rank)));
  for(const ghost of top.ghosts||[]){
    if(ghost.rank==null&&ranks.has(Number(ghost.rank)))fail(`${top.id}: unranked ghost collision for ${ghost.title}`);
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

const bootstrap=read('v2/scripts/bootstrap.js');
for(const required of ['shared-content-normalization.js','header-media-config.js','mobile-content-fixes.js'])if(!bootstrap.includes(required))fail(`bootstrap missing ${required}`);

console.log('\nASWA40 prelaunch audit');
console.log('======================');
for(const m of warnings)console.log(`⚠ ${m}`);
for(const m of errors)console.error(`✗ ${m}`);
console.log(`\n${errors.length} error(s), ${warnings.length} warning(s).`);
if(errors.length)process.exit(1);