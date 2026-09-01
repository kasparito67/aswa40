from pathlib import Path

path = Path('index.html')
html = path.read_text(encoding='utf-8')

if 'ASWA40_YEAR_INSIGHT_V1' in html:
    raise SystemExit('Year insight already present')

css = r'''
/* ASWA40_YEAR_INSIGHT_V1 */
.year-insight-card{
  border:1px solid var(--line);
  border-radius:16px;
  background:linear-gradient(145deg,#11171a 0%,#0e1214 72%);
  padding:16px;
  display:grid;
  gap:13px;
  overflow:hidden;
  position:relative;
}
.year-insight-card:after{
  content:"";
  position:absolute;
  inset:auto -34px -42px auto;
  width:110px;
  height:110px;
  border-radius:50%;
  background:radial-gradient(circle,rgba(255,49,49,.14),transparent 68%);
  pointer-events:none;
}
.year-insight-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.year-insight-kicker{font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--a)}
.year-insight-big{font:800 34px/.9 'Inter Tight',sans-serif;letter-spacing:-.045em;color:#fff;margin-top:5px}
.year-insight-big span{font-size:13px;letter-spacing:-.02em;color:#aeb7bb;font-weight:700;margin-left:4px}
.year-insight-badge{flex:none;border:1px solid #3a464c;border-radius:999px;padding:6px 8px;color:#c6ced1;font-size:9px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;background:#0b0f11}
.year-insight-line{height:1px;background:#283036}
.year-insight-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 12px}
.year-insight-stat{display:grid;gap:2px}
.year-insight-stat b{font-size:14px;color:#f7f5f1;line-height:1}
.year-insight-stat span{font-size:9px;color:#899399;line-height:1.2;text-transform:uppercase;letter-spacing:.055em}
.year-insight-note{font-size:10px;line-height:1.35;color:#9aa4a8}
.year-insight-note strong{color:#d7dddf;font-weight:750}
'''

card = r'''
<div class="year-insight-card" aria-label="Répartition du classement par année">
  <div class="year-insight-top">
    <div>
      <div class="year-insight-kicker">Génération 2000</div>
      <div class="year-insight-big">55% <span>du classement</span></div>
    </div>
    <div class="year-insight-badge">74 / 135</div>
  </div>
  <div class="year-insight-line"></div>
  <div class="year-insight-grid">
    <div class="year-insight-stat"><b>2000</b><span>année reine · 13 films</span></div>
    <div class="year-insight-stat"><b>2007</b><span>11 films</span></div>
    <div class="year-insight-stat"><b>2001–02</b><span>10 films chacune</span></div>
    <div class="year-insight-stat"><b>2024</b><span>1 seul film</span></div>
  </div>
  <div class="year-insight-note"><strong>Le creux :</strong> 2008, 2018 et 2020 n'ont que 2 films chacune. Aucune année 2000–2024 n'est complètement absente.</div>
</div>
'''

html = html.replace('</style></head>', css + '\n</style></head>', 1)
needle = '<div class="sidebar-title">Insights collectifs</div>'
if needle not in html:
    raise SystemExit('Sidebar title anchor not found')
html = html.replace(needle, needle + '\n' + card, 1)
path.write_text(html, encoding='utf-8')
