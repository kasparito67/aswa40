from pathlib import Path

p=Path('index.html')
h=p.read_text(encoding='utf-8')
if 'ASWA40_DIRECTOR_QUARTET_V1' in h:
    raise SystemExit('already present')

css=r'''
/* ASWA40_DIRECTOR_QUARTET_V1 */
.director-card{border:1px solid var(--line);border-radius:16px;background:#0f1315;overflow:hidden}
.director-toggle{width:100%;border:0;background:transparent;color:inherit;padding:15px;display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;text-align:left;cursor:pointer}
.director-k{font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--a)}
.director-title{font:800 22px/.95 'Inter Tight',sans-serif;letter-spacing:-.035em;margin-top:4px}
.director-sub{font-size:10px;color:#9ba5a9;margin-top:4px}
.director-faces{display:flex;align-items:center;padding-left:10px}
.director-faces img{width:34px;height:34px;border-radius:50%;object-fit:cover;border:2px solid #0f1315;margin-left:-9px;background:#20272b}
.director-arrow{font-size:18px;color:#aeb7bb;transition:transform .25s ease}
.director-card.open .director-arrow{transform:rotate(180deg)}
.director-detail{display:grid;grid-template-rows:0fr;transition:grid-template-rows .34s cubic-bezier(.16,1,.3,1);border-top:1px solid transparent}
.director-card.open .director-detail{grid-template-rows:1fr;border-top-color:var(--line)}
.director-detail-inner{overflow:hidden}
.director-list{padding:14px;display:grid;gap:12px}
.director-row{display:grid;grid-template-columns:38px 1fr;gap:10px;align-items:start}
.director-row img{width:38px;height:38px;border-radius:50%;object-fit:cover;background:#20272b}
.director-row b{display:block;font-size:12px;margin-bottom:3px}
.director-films{font-size:10px;line-height:1.35;color:#9aa4a8}
.director-credit{font-size:8px;line-height:1.35;color:#667177;padding:0 14px 14px}
'''

card=r'''
<div class="director-card" id="directorQuartet">
  <button class="director-toggle" type="button" aria-expanded="false">
    <div>
      <div class="director-k">Le quatuor</div>
      <div class="director-title">4 films chacun</div>
      <div class="director-sub">Villeneuve · Nolan · Tarantino · Anderson</div>
    </div>
    <div style="display:flex;align-items:center;gap:8px">
      <div class="director-faces" aria-hidden="true">
        <img src="assets/directors/denis-villeneuve.jpg" alt="">
        <img src="assets/directors/christopher-nolan.jpg" alt="">
        <img src="assets/directors/quentin-tarantino.jpg" alt="">
        <img src="assets/directors/wes-anderson.jpg" alt="">
      </div>
      <span class="director-arrow">↓</span>
    </div>
  </button>
  <div class="director-detail">
    <div class="director-detail-inner">
      <div class="director-list">
        <div class="director-row"><img src="assets/directors/denis-villeneuve.jpg" alt="Denis Villeneuve"><div><b>Denis Villeneuve</b><div class="director-films">Dune (franchise) · Incendies · Arrival · Blade Runner 2049</div></div></div>
        <div class="director-row"><img src="assets/directors/christopher-nolan.jpg" alt="Christopher Nolan"><div><b>Christopher Nolan</b><div class="director-films">Christopher Nolan’s Batman (franchise) · Inception · Interstellar · Dunkirk</div></div></div>
        <div class="director-row"><img src="assets/directors/quentin-tarantino.jpg" alt="Quentin Tarantino"><div><b>Quentin Tarantino</b><div class="director-films">Inglourious Basterds · Kill Bill (franchise) · Django Unchained · Once Upon a Time… in Hollywood</div></div></div>
        <div class="director-row"><img src="assets/directors/wes-anderson.jpg" alt="Wes Anderson"><div><b>Wes Anderson</b><div class="director-films">The Royal Tenenbaums · The Darjeeling Limited · Fantastic Mr. Fox · The Grand Budapest Hotel</div></div></div>
      </div>
      <div class="director-credit">Portraits: Wikimedia Commons. Denis Villeneuve — Gage Skidmore; Christopher Nolan — sbclick; Quentin Tarantino — Ilan Costica; Wes Anderson — Popperipopp.</div>
    </div>
  </div>
</div>
'''

h=h.replace('</style></head>',css+'\n</style></head>',1)
start=h.find('<div class="year-insight-card"')
if start<0: raise SystemExit('year card not found')
pos=start; depth=0; end=None
while pos < len(h):
    no=h.find('<div',pos); nc=h.find('</div>',pos)
    if nc<0: break
    if no!=-1 and no<nc:
        depth+=1; pos=no+4
    else:
        depth-=1; pos=nc+6
        if depth==0:
            end=pos; break
if end is None: raise SystemExit('year card end not found')
h=h[:end]+'\n'+card+h[end:]
js=r'''<script>
(()=>{const c=document.getElementById('directorQuartet');if(!c)return;const b=c.querySelector('.director-toggle');b.addEventListener('click',()=>{const o=c.classList.toggle('open');b.setAttribute('aria-expanded',String(o));});})();
</script>'''
h=h.replace('</body>',js+'\n</body>',1)
p.write_text(h,encoding='utf-8')
