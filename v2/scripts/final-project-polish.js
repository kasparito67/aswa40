(()=>{
  if(typeof TOPS==='undefined'||!Array.isArray(TOPS))return;

  // Keep the documentary palette neutral, but slightly denser than the previous
  // near-white grey so it reads as a real accent on both desktop and mobile.
  const docs=TOPS.find(top=>top.id==='documentaires');
  if(docs?.theme)docs.theme.accent='#b5babd';

  // The Biopics Top 15 sat a few pixels too close to the clipped section edge on
  // desktop. Add only the breathing room needed without changing the shared grid.
  if(!document.getElementById('aswa40-final-project-polish')){
    const style=document.createElement('style');
    style.id='aswa40-final-project-polish';
    style.textContent=`
      .desktop-native .era-screen[data-top-id="biopics"] .sec[data-kind="top25"] .pad{
        padding-top:20px!important;
      }
    `;
    document.head.appendChild(style);
  }
})();