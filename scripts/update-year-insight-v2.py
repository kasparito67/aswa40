from pathlib import Path
import re

path = Path('index.html')
html = path.read_text(encoding='utf-8')

# Replace previous year insight CSS/card with a compact native-details version.
html = re.sub(r'/\* ASWA40_YEAR_INSIGHT_V1 \*/.*?\.year-insight-note strong\{color:#d7dddf;font-weight:750\}\n', '', html, flags=re.S)
html = re.sub(r'<div class="year-insight-card" aria-label="Répartition du classement par année">.*?</div>\n(?=\s*<div class="insight-item" data-insight="religion">)', '', html, flags=re.S)

css = r'''
/* ASWA40_YEAR_INSIGHT_V2 */
.year-insight-card{border:1px solid var(--line);border-radius:16px;background:#0f1416;overflow:hidden}
.year-insight-card summary{list-style:none;cursor:pointer;padding:15px 16px;position:relative}
.year-insight-card summary::-webkit-details-marker{display:none}
.year-insight-card summary:after{content:'↓';position:absolute;right:15px;top:15px;color:var(--a);font-size:18px;transition:transform .28s cubic-bezier(.16,1,.3,1)}
.year-insight-card[open] summary:after{transform:rotate(180deg)}
.year-insight-kicker{font-size:9px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#9da6aa;margin-bottom:7px}
.year-insight-hero{display:flex;align-items:flex-end;gap:8px;padding-right:28px}
.year-insight-year{font:800 34px/.82 'Inter Tight',sans-serif;letter-spacing:-.055em;color:#fff}
.year-insight-label{font-size:10px;font-weight:850;letter-spacing:.09em;text-transform:uppercase;color:var(--a);padding-bottom:2px}
.year-insight-maincount{font-size:11px;color:#c4cbce;margin-top:5px;font-weight:700}
.year-insight-mini{display:grid;grid-template-columns:1fr 1fr;gap:5px 10px;margin-top:11px;padding-right:26px}
.year-insight-mini span{font-size:9px;line-height:1.25;color:#8f999e}.year-insight-mini b{color:#eef1f2;font-size:11px;margin-right:3px}
.year-insight-detail{border-top:1px solid #293137;padding:14px 16px 16px;display:grid;gap:12px;background:#0b0f11}
.year-insight-decade{display:flex;align-items:baseline;justify-content:space-between;gap:12px}.year-insight-decade b{font-size:12px;color:#f3f3f1}.year-insight-decade strong{font:800 24px/.9 'Inter Tight',sans-serif;color:var(--a);letter-spacing:-.04em}
.year-chart{height:88px;display:flex;align-items:flex-end;gap:2px;padding:8px 0 15px;border-bottom:1px solid #222b30;position:relative}
.year-chart-bar{flex:1;min-width:2px;border-radius:2px 2px 0 0;background:#5e6a70;opacity:.72;height:calc(var(--v) * 4.1px);position:relative}
.year-chart-bar.hot{background:var(--a);opacity:1}.year-chart-bar:after{content:attr(data-y);position:absolute;left:50%;bottom:-12px;transform:translateX(-50%);font-size:6px;color:#687278;display:none}.year-chart-bar:nth-child(1):after,.year-chart-bar:nth-child(6):after,.year-chart-bar:nth-child(11):after,.year-chart-bar:nth-child(16):after,.year-chart-bar:nth-child(21):after,.year-chart-bar:nth-child(25):after{display:block}
.year-insight-note{font-size:9.5px;line-height:1.38;color:#8f999e}.year-insight-note strong{color:#d9dfe1}
'''

values=[13,10,10,6,6,6,6,11,2,4,5,5,4,6,8,6,4,5,2,3,2,3,4,3,1]
bars=''.join(f'<span class="year-chart-bar{" hot" if v>=10 else ""}" style="--v:{v}" data-y="{2000+i}"></span>' for i,v in enumerate(values))
card=f'''
<details class="year-insight-card" aria-label="Répartition du classement par année">
  <summary>
    <div class="year-insight-kicker">Génération 2000</div>
    <div class="year-insight-hero"><span class="year-insight-year">2000</span><span class="year-insight-label">Année reine</span></div>
    <div class="year-insight-maincount">13 films</div>
    <div class="year-insight-mini">
      <span><b>2007</b>11 films</span>
      <span><b>2001–02</b>10 films chacune</span>
      <span><b>2024</b>1 seul film</span>
    </div>
  </summary>
  <div class="year-insight-detail">
    <div class="year-insight-decade"><b>2000–2009</b><strong>55%</strong></div>
    <div class="year-chart" aria-label="Nombre de films par année de 2000 à 2024">{bars}</div>
    <div class="year-insight-note"><strong>Le creux :</strong> 2008, 2018 et 2020 n'ont que 2 films chacune. Aucune année 2000–2024 n'est complètement absente.</div>
  </div>
</details>
'''

html = html.replace('</style></head>', css + '\n</style></head>', 1)
needle = '<div class="sidebar-title">Insights collectifs</div>'
# Remove any remaining v1/v2 card directly after the title, then insert new card.
html = re.sub(re.escape(needle)+r'\s*<details class="year-insight-card".*?</details>', needle, html, count=1, flags=re.S)
html = html.replace(needle, needle + '\n' + card, 1)
path.write_text(html, encoding='utf-8')
