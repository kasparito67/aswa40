from pathlib import Path
p=Path('index.html')
s=p.read_text(encoding='utf-8')
marker='/* ASWA40_YEAR_ROMAN */'
if marker not in s:
    s=s.replace('</style></head>', f'''\n{marker}\n.hero-title em{{font-style:normal!important}}\n</style></head>''', 1)
p.write_text(s, encoding='utf-8')
