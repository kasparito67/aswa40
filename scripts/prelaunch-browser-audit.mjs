import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root=process.cwd(),port=4174,failures=[];
const assert=(ok,msg)=>{if(!ok)failures.push(msg)};
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
  const u=new URL(req.url,'http://localhost');let p=decodeURIComponent(u.pathname);
  if(p==='/'||p==='/v2'||p==='/v2/'||p.startsWith('/tops/'))p='/v2/index.html';
  const file=path.resolve(root,'.'+p);
  if(!file.startsWith(root)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);res.end('Not found');return}
  res.writeHead(200,{'content-type':mime[path.extname(file).toLowerCase()]||'application/octet-stream','cache-control':'no-store'});fs.createReadStream(file).pipe(res);
});
await new Promise(r=>server.listen(port,'127.0.0.1',r));
const browser=await chromium.launch({headless:true});

async function diagnostics(page,label){
  page.on('pageerror',e=>failures.push(`${label} pageerror: ${e.message}`));
  page.on('console',m=>{if(m.type()==='error')failures.push(`${label} console.error: ${m.text()}`)});
  page.on('response',r=>{const u=new URL(r.url());if(u.hostname==='127.0.0.1'&&r.status()>=400)failures.push(`${label} local ${r.status()}: ${u.pathname}`)});
}

try{
  const dc=await browser.newContext({viewport:{width:1440,height:900}});const d=await dc.newPage();await diagnostics(d,'desktop');
  await d.goto(`http://127.0.0.1:${port}/tops/1975-1999`,{waitUntil:'domcontentloaded'});await d.waitForSelector('.era-screen.is-active-top');
  const side= d.locator('.era-screen.is-active-top .site-sidebar');
  const card=side.locator('.insight-card').first();
  const geo=await d.evaluate(()=>{const s=document.querySelector('.era-screen.is-active-top .site-sidebar').getBoundingClientRect(),c=document.querySelector('.era-screen.is-active-top .insight-card').getBoundingClientRect();return{sL:s.left,sR:s.right,cL:c.left,cR:c.right,r:getComputedStyle(document.querySelector('.era-screen.is-active-top .insight-card')).borderRadius}});
  assert(Math.abs(geo.sL-geo.cL)<2&&Math.abs(geo.sR-geo.cR)<2,'desktop sidebar hover row is not full bleed');
  assert(geo.r==='0px','desktop sidebar row is rounded');
  const plus=await card.locator('.insight-chevron').evaluate(el=>getComputedStyle(el,'::before').content);
  assert(String(plus).includes('+'),'desktop sidebar disclosure is not a plus');
  await card.click();
  assert(await side.locator('.insight-item').first().evaluate(el=>el.classList.contains('is-open')),'desktop sidebar insight did not open');
  const year=side.locator('.year-insight-card');if(await year.count()){await year.locator('.year-toggle').click();await d.waitForTimeout(40);const tips=await year.locator('.year-chart-bar').evaluateAll(b=>b.every(x=>!!x.dataset.tip));assert(tips,'desktop year chart bars are missing rollover labels')}

  await d.goto(`http://127.0.0.1:${port}/tops/2000-2024`,{waitUntil:'domcontentloaded'});await d.waitForSelector('.era-screen.is-active-top');
  const full=d.locator('.era-screen.is-active-top .sec[data-kind="full"]');await full.locator('.toggle').click();await d.waitForTimeout(80);
  const before=await full.locator('.full-grid .tile').count();const more=full.locator('.full-reveal-button');
  if(await more.isVisible()){await more.click();await d.waitForTimeout(260);const after=await full.locator('.full-grid .tile').count();assert(after>before,'desktop Voir plus did not append films')}
  await dc.close();

  const mc=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const m=await mc.newPage();await diagnostics(m,'mobile');
  const widths=[];
  for(const id of ['1975-1999','2000-2024','sci-fi-realiste','animation','biopics','documentaires','rewatched']){
    await m.goto(`http://127.0.0.1:${port}/tops/${id}`,{waitUntil:'domcontentloaded'});await m.waitForSelector('.era-screen.mobile-cinema-header');
    widths.push(await m.locator('.hero-title-art-wrap').evaluate(el=>el.getBoundingClientRect().width));
    const overflow=await m.evaluate(()=>document.documentElement.scrollWidth-innerWidth);assert(overflow<=2,`mobile ${id}: horizontal document overflow ${overflow}px`);
    const fullTitle=m.locator('.sec[data-kind="full"] .toggle strong');if(await fullTitle.count())assert((await fullTitle.textContent()).trim()==='Le reste',`mobile ${id}: full section is not named Le reste`);
    const sc=m.locator('.site-sidebar .insight-card').first();if(await sc.count()){
      const shape=await sc.evaluate(el=>{const c=el.getBoundingClientRect(),s=el.closest('.site-sidebar').getBoundingClientRect();return{radius:getComputedStyle(el).borderRadius,left:c.left-s.left,right:s.right-c.right,plus:getComputedStyle(el.querySelector('.insight-chevron'),'::before').content}});
      assert(shape.radius==='0px',`mobile ${id}: sidebar row is rounded`);assert(Math.abs(shape.left)<2&&Math.abs(shape.right)<2,`mobile ${id}: sidebar row is not full bleed`);assert(String(shape.plus).includes('+'),`mobile ${id}: disclosure is not a plus`);
    }
    if(id==='2000-2024'){const accent=await m.locator('.era-screen').evaluate(el=>getComputedStyle(el).getPropertyValue('--accent').trim().toLowerCase());assert(accent==='#d8b15a',`mobile 2000 accent is ${accent}, expected gold`)}
  }
  assert(Math.max(...widths)-Math.min(...widths)<8,`mobile header title widths diverge by ${Math.round(Math.max(...widths)-Math.min(...widths))}px`);

  await m.goto(`http://127.0.0.1:${port}/tops/documentaires`,{waitUntil:'domcontentloaded'});await m.waitForSelector('.era-screen.mobile-cinema-header');
  const ghostSec=m.locator('.sec[data-kind="ghosts"]');assert(await ghostSec.count()===1,'mobile documentaires: Grands oubliés section missing');
  if(await ghostSec.count()){await ghostSec.locator('.toggle').click();await m.waitForTimeout(80);const ghost=ghostSec.locator('.ghost-card').first();assert(await ghost.count()>0,'mobile documentaires: no forgotten-film cards');if(await ghost.count()){await ghost.click();await m.waitForSelector('#modalBg.open',{timeout:5000});assert((await m.locator('#modalTitle').textContent()).trim().length>0,'mobile forgotten-film modal did not populate')}}
  await mc.close();
}finally{await browser.close();server.close()}

if(failures.length){console.error('\nPrelaunch browser audit failures');for(const f of failures)console.error(`✗ ${f}`);process.exit(1)}
console.log('✓ Prelaunch desktop/mobile parity audit passed.');