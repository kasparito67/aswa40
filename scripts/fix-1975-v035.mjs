import fs from 'node:fs/promises';

const file='1975-1999/index.html';
let html=await fs.readFile(file,'utf8');

html=html.replace(/\n?<link rel="stylesheet" href="\.\.\/assets\/1975-mobile-v095\.css[^>]*>/g,'');
html=html.replace('</head>','<link rel="stylesheet" href="../assets/1975-mobile-v095.css?v=0.9.35">\n</head>');
html=html.replaceAll('v0.9.34','v0.9.35');

await fs.writeFile(file,html);
