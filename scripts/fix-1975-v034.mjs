import fs from 'node:fs/promises';

const file='1975-1999/index.html';
let html=await fs.readFile(file,'utf8');

html=html.replaceAll('v0.9.33','v0.9.34');

const css=`
/* v0.9.34 — make the approved SVG the actual visible hero title */
.hero-logo{
  position:absolute!important;
  inset:17% 28px 8%!important;
  display:grid!important;
  place-items:center!important;
  pointer-events:none!important;
  z-index:3!important;
}
.hero-logo>img{display:none!important}
.hero-logo::before{
  content:"";
  display:block;
  width:min(54.6vw,728px);
  max-width:100%;
  aspect-ratio:1320/580;
  background:url('../assets/header-title-1975-1999.svg') center/contain no-repeat;
  filter:drop-shadow(0 18px 36px rgba(0,0,0,.58));
}
@media(max-width:1000px){
  .hero-logo::before{width:min(64vw,546px)}
}
@media(max-width:700px){
  .hero-logo{inset:17% 14px 8%!important}
  .hero-logo::before{width:72.8vw}
}
`;

if(!html.includes('v0.9.34 — make the approved SVG')){
  html=html.replace('</style>',css+'\n</style>');
}

await fs.writeFile(file,html);
console.log('Applied v0.9.34 visible SVG hero title fix');
