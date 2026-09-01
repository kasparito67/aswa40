from pathlib import Path
import re

p = Path('index.html')
html = p.read_text(encoding='utf-8')

# Avoid re-applying the same direct patch.
if 'ASWA40_DIRECT_FIXES_V1' in html:
    raise SystemExit(0)

# Preload Inter Tight and add the cinema favicon directly in the real document.
head_bits = """
<!-- ASWA40_DIRECT_FIXES_V1 -->
<link rel="preload" href="assets/inter-tight-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/inter-tight-italic-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="icon" type="image/svg+xml" href="favicon.svg?v=direct1">
"""
html = html.replace('<style>', head_bits + '<style>', 1)
html = html.replace("font-display:swap", "font-display:block")

extra_css = r'''
/* ASWA40 direct polish */
.hero-title h1{font-weight:700!important;line-height:.84!important;letter-spacing:-.07em!important}
.hero-title em{font-weight:700!important}

.sec:not(.open){transition:border-color .22s ease,background-color .22s ease,box-shadow .22s ease,transform .22s ease}
.sec:not(.open)>.toggle{transition:background-color .22s ease}
.sec:not(.open)>.toggle strong{transition:color .22s ease}
@media (hover:hover) and (pointer:fine){
  .stack>.sec:not(.open):hover{border-color:#4b5960;background:#11171a;box-shadow:0 12px 34px rgba(0,0,0,.22);transform:translateY(-1px)}
  .stack>.sec:not(.open):hover>.toggle{background:linear-gradient(90deg,rgba(255,49,49,.07),transparent 52%)}
  .stack>.sec:not(.open):hover>.toggle strong{color:#fff}
  .stack>.sec:not(.open):hover>.toggle .arr{transform:translateY(3px)}
}

.sec.open .inner{animation:aswaWindowIn .34s cubic-bezier(.16,1,.3,1) both}
@keyframes aswaWindowIn{from{opacity:.25;transform:translateY(7px) scale(.994)}to{opacity:1;transform:none}}

#topHero .tile.cf-active{transform:translate3d(0,-4px,0) scale(1.20)!important}
#topRest .tile.cf-active{transform:translate3d(0,-8px,62px) scale(1.34)!important}
#full .tile.cf-active{transform:translate3d(0,-9px,76px) scale(1.41)!important}
#bottom .tile.cf-active{transform:translate3d(0,-8px,62px) scale(1.33)!important}
.tile.cf-active img{object-fit:contain!important;background:#090b0c}

@media(prefers-reduced-motion:reduce){.sec.open .inner{animation:none!important}}
'''
html = html.replace('</style>', extra_css + '\n</style>', 1)

cross = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2v17.6M6.6 8.7h10.8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>'
hearts = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.2 18.4 4.7 15.1C2.5 13 3.6 9.5 6.4 9.5c1.1 0 2 .5 2.6 1.4.6-.9 1.5-1.4 2.6-1.4 2.8 0 3.9 3.5 1.7 5.6l-3.5 3.3c-.4.4-1.1.4-1.6 0Z" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/><path d="M14.3 18.4 10.8 15.1c-2.2-2.1-1.1-5.6 1.7-5.6 1.1 0 2 .5 2.6 1.4.6-.9 1.5-1.4 2.6-1.4 2.8 0 3.9 3.5 1.7 5.6l-3.5 3.3c-.4.4-1.1.4-1.6 0Z" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/></svg>'

for key, icon in [('religion', cross), ('duo', hearts)]:
    pattern = rf'(<div class="insight-item" data-insight="{key}">.*?<span class="insight-icon">)(.*?)(</span>)'
    html, n = re.subn(pattern, lambda m: m.group(1) + icon + m.group(3), html, count=1, flags=re.S)
    if n != 1:
        raise RuntimeError(f'Could not patch {key} icon')

p.write_text(html, encoding='utf-8')
