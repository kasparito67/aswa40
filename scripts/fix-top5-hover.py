from pathlib import Path

p=Path('assets/styles.css')
h=p.read_text(encoding='utf-8')
marker='/* ASWA40_TOP5_HOVER_FIX */'
if marker in h:
    raise SystemExit('already present')

needle=".tile.cf-active img {\n  object-fit:contain;\n  background:#090b0c\n}\n"
if needle not in h:
    raise SystemExit('active image rule not found')

override="""\n/* ASWA40_TOP5_HOVER_FIX */\n#topHero .tile.cf-active img {\n  object-fit:cover;\n  background:transparent\n}\n"""
h=h.replace(needle, needle+override, 1)
p.write_text(h, encoding='utf-8')
